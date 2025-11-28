// Initialize NGO dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadNGOStats();
    loadAvailableDonations();
});

// Load user data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('userWelcome').textContent = `Welcome, ${user.name}`;
    }
}

// Load NGO statistics
async function loadNGOStats() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    const stats = await getNGOStats(user.id);
    
    if (stats.error) {
        // Fallback to basic numbers
        document.getElementById('totalReceived').textContent = '23';
        document.getElementById('mealsServed').textContent = '1,150';
        document.getElementById('activeDonations').textContent = '3';
        document.getElementById('volunteersAvailable').textContent = '5';
    } else {
        // Use auto-updating numbers
        document.getElementById('totalReceived').textContent = stats.totalReceived;
        document.getElementById('mealsServed').textContent = stats.mealsServed.toLocaleString();
        document.getElementById('activeDonations').textContent = stats.activeDonations;
        document.getElementById('volunteersAvailable').textContent = stats.volunteersAvailable;
    }
}

// Load available donations
async function loadAvailableDonations() {
    const result = await getNGODonations();
    const container = document.getElementById('donationsList');
    //console.log('🔄 NGO Donations Result:', result); // ADD THIS LINE
    
    if (result.error || !result.donations || result.donations.length === 0) {
        container.innerHTML = '<p>No available donations at the moment.</p>';
        return;
    }

    container.innerHTML = result.donations.map(donation => `
        <div class="donation-card">
            <h3>${donation.food_name}</h3>
            <p><strong>Donor:</strong> ${donation.donor_name}</p>
            <p><strong>Quantity:</strong> ${donation.quantity} kg</p>
            <p><strong>Description:</strong> ${donation.description || 'No description'}</p>
${donation.image_url ? `<p><strong>Food Image:</strong> <img src="${donation.image_url}" style="max-width: 100px; max-height: 100px; border-radius: 5px;"></p>` : '<p><strong>Food Image:</strong> Not provided</p>'}
<p><strong>Address:</strong> ${donation.address}</p>
            ${donation.location_link ? `<p><strong>Map:</strong> <a href="${donation.location_link}" target="_blank">View Location</a></p>` : ''}
            <p><strong>Storage:</strong> ${donation.storage_temp} • <strong>Cooked:</strong> ${donation.hours_cooked} hours ago</p>
            <p><strong>Category:</strong> ${donation.category}</p>
            <div class="user-actions">
                <button class="btn btn-accept" onclick="acceptDonation(${donation.id}, '${donation.donor_phone}')">Accept Donation</button>
                <button class="btn btn-request-volunteer" onclick="showVolunteers()">Need Volunteer Support</button>
            </div>
        </div>
    `).join('');
}

// Accept donation
async function acceptDonation(donationId, donorPhone) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    const result = await acceptDonationAPI(donationId, user.id);
    
    if (result.success) {
        showMessage(`✅ Donation accepted!\n\nContact Donor: ${donorPhone}\n\nPlease coordinate pickup details directly.`);
        loadAvailableDonations(); // Refresh the list
    } else {
        showMessage(`❌ Failed to accept donation: ${result.error}`);
    }
}

// Request volunteer
function requestVolunteer(donationId) {
    showMessage(`📞 Volunteer requested for donation #${donationId}! Available volunteers will be notified.`);
    // In real system: Notify nearby volunteers
}
// Show available volunteers
async function showVolunteers() {
    const result = await getVolunteers();
    const container = document.getElementById('volunteersList');
    
    if (result.error || !result.volunteers || result.volunteers.length === 0) {
        container.innerHTML = '<p>No volunteers available at the moment.</p>';
        return;
    }

    container.style.display = 'block';
    container.innerHTML = `
        <h4>Available Volunteers</h4>
        ${result.volunteers.map(volunteer => `
            <div class="volunteer-card" style="background: #f8f9fa; padding: 1rem; margin: 0.5rem 0; border-radius: 5px;">
                <p><strong>${volunteer.name}</strong></p>
                <p>📞 <a href="tel:${volunteer.phone}">${volunteer.phone}</a></p>
                <p>📍 ${volunteer.address}</p>
            </div>
        `).join('')}
    `;
}
function showMessage(message, isError = false) {
    const alert = document.createElement('div');
    alert.className = `custom-alert ${isError ? 'error' : ''}`;
    
    // Format message with line breaks
    const formattedMessage = message.split('\n').map(line => 
        `<div style="margin: 5px 0;">${line}</div>`
    ).join('');
    
    alert.innerHTML = `
        <div style="padding-right: 30px; line-height: 1.6;">
            ${formattedMessage}
        </div>
        <button class="close-btn" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(alert);
}
async function loadDonationHistory() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const response = await fetch(`${API_BASE}/donations/donor-history/${user.id}`);
    const result = await response.json();
    
    if (result.donations && result.donations.length > 0) {
        document.getElementById('donationsList').innerHTML = result.donations.map(donation => `
            <div class="donation-card">
                <h3>${donation.food_name} <button onclick="deleteDonation(${donation.id})" style="float: right; background: red; color: white; border: none; padding: 5px 10px; border-radius: 3px;">Delete</button></h3>
                <p><strong>Quantity:</strong> ${donation.quantity}kg</p>
                <p><strong>Status:</strong> ${donation.status}</p>
                <p><strong>Date:</strong> ${new Date(donation.created_at).toLocaleDateString()}</p>
            </div>
        `).join('');
    }
}

async function deleteDonation(donationId) {
    if (confirm('Delete this donation permanently?')) {
        const response = await fetch(`${API_BASE}/donations/${donationId}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
            showMessage('Donation deleted successfully');
            loadDonationHistory();
        }
    }
}