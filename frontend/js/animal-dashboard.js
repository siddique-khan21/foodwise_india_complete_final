document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadAnimalDonations();
});

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('userWelcome').textContent = `Welcome, ${user.name}`;
    }
}

async function loadAnimalDonations() {
    const result = await getAnimalDonations();
    const container = document.getElementById('donationsList');
    
    console.log('🐄 Animal API Result:', result); // ADD THIS
    
    if (result.error || !result.donations || result.donations.length === 0) {
        container.innerHTML = '<p>No animal feed donations available.</p>';
        return;
    }

    container.innerHTML = result.donations.map(donation => `
        <div class="donation-card">
            <h3>${donation.food_name}</h3>
            <p><strong>Donor:</strong> ${donation.donor_name}</p>
            <p><strong>Quantity:</strong> ${donation.quantity} kg</p>
            <p><strong>Description:</strong> ${donation.description || 'No description'}</p>
            <p><strong>Address:</strong> ${donation.address}</p>
            <p><strong>Storage:</strong> ${donation.storage_temp} • <strong>Cooked:</strong> ${donation.hours_cooked} hours ago</p>
            <button class="btn btn-accept" onclick="acceptAnimalDonation(${donation.id}, '${donation.donor_phone}')">Accept for Animal Feed</button>
        </div>
    `).join('');
}

async function acceptAnimalDonation(donationId, donorPhone) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const result = await acceptDonationAPI(donationId, user.id);
    
    if (result.success) {
        showMessage(`✅ Animal feed accepted!\n\nContact Donor: ${donorPhone}\n\nCoordinate pickup for animal feed.`);
        loadAnimalDonations();
    } else {
        showMessage(`❌ Failed to accept: ${result.error}`);
    }
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