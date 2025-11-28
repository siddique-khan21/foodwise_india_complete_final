// FoodWise API Service
const API_BASE = 'http://localhost:3000/api';

console.log('✅ API.js loaded successfully');

// User registration
async function registerUser(userData) {
    console.log('📡 Registering user:', userData);
    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        const result = await response.json();
        console.log('✅ Registration response:', result);
        
        // Better error handling
        if (!response.ok) {
            return { error: result.error || 'Registration failed' };
        }
        return result;
    } catch (error) {
        console.error('❌ Registration error:', error);
        return { error: 'Network error - cannot connect to server' };
    }
}
// User login
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    } catch (error) {
        return { error: 'Network error - cannot connect to server' };
    }
}

// Get platform stats
async function getStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/stats`);
        return await response.json();
    } catch (error) {
        return { error: 'Failed to load statistics' };
    }
}

// Test API connection
async function testAPIConnection() {
    console.log('🧪 Testing API connection to:', API_BASE);
    try {
        const response = await fetch(`${API_BASE}/`);
        const data = await response.json();
        console.log('✅ API Connection successful:', data);
        return true;
    } catch (error) {
        console.error('❌ API Connection failed:', error);
        return false;
    }
}

// Initialize API test when script loads
console.log('🚀 FoodWise API initialized');
testAPIConnection();
// Admin login
async function adminLogin(credentials) {
    try {
        const response = await fetch(`${API_BASE}/auth/admin-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    } catch (error) {
        return { error: 'Network error - cannot connect to server' };
    }
}

// Get pending registrations
async function getPendingRegistrations() {
    try {
        const response = await fetch(`${API_BASE}/admin/pending-registrations`);
        return await response.json();
    } catch (error) {
        return { error: 'Failed to load pending registrations' };
    }
}

// Update user status
async function updateUserStatus(userId, action) {
    try {
        const response = await fetch(`${API_BASE}/admin/update-user-status/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action })
        });
        return await response.json();
    } catch (error) {
        return { error: 'Failed to update user status' };
    }
}
// Admin login
async function adminLoginAPI(email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/admin-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        console.log('🔐 Admin login response:', result);
        return result;
    } catch (error) {
        console.error('❌ Admin login error:', error);
        return { error: 'Network error - cannot connect to server' };
    }
}
// Upload document
async function uploadDocument(userId, documentType, file) {
    try {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('userId', userId);
        formData.append('documentType', documentType);

        const response = await fetch(`${API_BASE}/uploads/upload-document`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('Document upload error:', error);
        return { error: 'Failed to upload document' };
    }
}
// Upload document reference
async function uploadDocumentReference(userId, documentType) {
    try {
        console.log(`📤 Uploading ${documentType} for user ${userId}`);
        
        const response = await fetch(`${API_BASE}/uploads/upload-document`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                documentType: documentType
            })
        });
        
        const result = await response.json();
        console.log(`📄 ${documentType} upload result:`, result);
        return result;
        
    } catch (error) {
        console.error(`❌ ${documentType} upload error:`, error);
        return { error: 'Failed to upload document' };
    }
}
// User login
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        const result = await response.json();
        console.log('🔐 Login response:', result);
        return result;
    } catch (error) {
        console.error('❌ Login error:', error);
        return { error: 'Network error - cannot connect to server' };
    }
} 
// Get donor statistics
async function getDonorStats(userId) {
    try {
        // For now, return mock data - later connect to real API
        return {
            totalDonations: 8,
            mealsProvided: 400,
            activeRequests: 3,
            completionRate: '85%'
        };
    } catch (error) {
        return { error: 'Failed to load statistics' };
    }
}
// Get NGO statistics
async function getNGOStats(ngoId) {
    try {
        // Mock data - in real system, this would count from database
        return {
            totalReceived: Math.floor(Math.random() * 50) + 10,
            mealsServed: Math.floor(Math.random() * 2000) + 500,
            activeDonations: Math.floor(Math.random() * 8) + 1,
            volunteersAvailable: Math.floor(Math.random() * 10) + 3
        };
    } catch (error) {
        return { error: 'Failed to load statistics' };
    }
}
// Create donation
async function createDonation(donationData) {
    try {
        const response = await fetch(`${API_BASE}/donations/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donationData)
        });
        return await response.json();
    } catch (error) {
        return { error: 'Failed to create donation' };
    }
}

// Get donations for NGO
async function getNGODonations() {
    try {
        const response = await fetch(`${API_BASE}/donations/for-ngo`);
        return await response.json();
    } catch (error) {
        return { error: 'Failed to load donations' };
    }
}

// Get donations for Animal Farm
async function getAnimalDonations() {
    try {
        const response = await fetch(`${API_BASE}/donations/for-animal`);
        return await response.json();
    } catch (error) {
        return { error: 'Failed to load donations' };
    }
}

// Get donations for Composting
async function getCompostDonations() {
    try {
        const response = await fetch(`${API_BASE}/donations/for-compost`);
        return await response.json();
    } catch (error) {
        return { error: 'Failed to load donations' };
    }
}

// Accept donation
async function acceptDonationAPI(donationId, acceptorId) {
    try {
        const response = await fetch(`${API_BASE}/donations/accept/${donationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accepted_by: acceptorId })
        });
        return await response.json();
    } catch (error) {
        return { error: 'Failed to accept donation' };
    }
}
// Get real volunteers
async function getVolunteers() {
    try {
        const response = await fetch(`${API_BASE}/users/volunteers`);
        return await response.json();
    } catch (error) {
        return { error: 'Failed to load volunteers' };
    }
}