// Initialize donor dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadDonorStats();
});

// Load user data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('userWelcome').textContent = `Welcome, ${user.name}`;
    }
}

// Load donor statistics
async function loadDonorStats() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    const stats = await getDonorStats(user.id);
    
    if (stats.error) {
        // Use mock data as fallback
        document.getElementById('totalDonations').textContent = '5';
        document.getElementById('mealsProvided').textContent = '250';
        document.getElementById('activeRequests').textContent = '2';
        document.getElementById('completionRate').textContent = '80%';
    } else {
        // Use real data
        document.getElementById('totalDonations').textContent = stats.totalDonations;
        document.getElementById('mealsProvided').textContent = stats.mealsProvided;
        document.getElementById('activeRequests').textContent = stats.activeRequests;
        document.getElementById('completionRate').textContent = stats.completionRate;
    }
}

// Open donation form
function openDonationForm() {
    document.getElementById('donationModal').style.display = 'flex';
}

// Close donation form
function closeDonationModal() {
    document.getElementById('donationModal').style.display = 'none';
}

// Submit donation
async function submitDonation() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const foodName = document.getElementById('foodName').value;
    const foodDescription = document.getElementById('foodDescription').value;
    const quantity = document.getElementById('foodQuantity').value;
    const storageTemp = document.getElementById('storageTemp').value;
    const hoursCooked = document.getElementById('hoursCooked').value;
    const address = document.getElementById('pickupAddress').value;
    const locationLink = document.getElementById('locationLink').value;

    if (!foodName || !quantity || !hoursCooked || !address) {
        showMessaget('Please fill all required fields');
        return;
    }

  const category = classifyFood(parseInt(hoursCooked), storageTemp);
console.log('🎯 FINAL CATEGORY:', category); // ADD THIS LINE

const donationData = {
    donor_id: user.id,
    food_name: foodName,
    description: foodDescription,
    quantity: parseFloat(quantity),
    storage_temp: storageTemp,
    hours_cooked: parseInt(hoursCooked),
    category: category, // This is what gets saved
    address: address,
    location_link: locationLink
};

    console.log('Creating donation:', donationData);

    const result = await createDonation(donationData);
    
    if (result.success) {
        showMessage(`✅ Donation submitted!\n\nFood: ${foodName}\nQuantity: ${quantity}kg\nCategory: ${category}\n\nNGOs/Farms will be notified.`);
        closeDonationModal();
        resetDonationForm();
    } else {
        showMessage(`❌ Failed to submit donation: ${result.error}`);
    }
}

// Classify food based on safety rules
function classifyFood(hoursCooked, storageTemp) {
    console.log('🔍 Classification Input:', { hoursCooked, storageTemp });
    
    if (storageTemp === 'Refrigerated' && hoursCooked <= 24) {
        return 'Edible - Donate to NGO';
    } else if (storageTemp === 'Frozen' && hoursCooked <= 72) {
        return 'Edible - Donate to NGO';
    } else if (storageTemp === 'Room Temperature' && hoursCooked <= 4) {
        return 'Edible - Donate to NGO';
    } 
    else if ((storageTemp === 'Refrigerated' && hoursCooked <= 48) ||
             (storageTemp === 'Frozen' && hoursCooked <= 168) ||
             (storageTemp === 'Room Temperature' && hoursCooked <= 8)) {
        return 'Risky - Animal Feed';
    }
    else {
        return 'Not Safe - Composting';
    }
}

// Reset donation form
function resetDonationForm() {
    document.getElementById('foodName').value = '';
    document.getElementById('foodDescription').value = '';
    document.getElementById('foodImage').value = '';
    document.getElementById('foodQuantity').value = '';
    document.getElementById('hoursCooked').value = '';
}
// Firebase configuration
const firebaseConfig = {
    apiKey: "demo-key-for-now",
    authDomain: "foodwise-india.firebaseapp.com",
    projectId: "foodwise-india",
    storageBucket: "foodwise-india.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase (commented for now - will work in production)
// firebase.initializeApp(firebaseConfig);
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