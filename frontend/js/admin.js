let currentAdmin = null;

// Check if admin is logged in
function checkAdminAuth() {
    // For now, just load the dashboard
    loadAdminDashboard();
}

// Load admin dashboard data
async function loadAdminDashboard() {
    console.log('📊 Loading admin dashboard...');
    
    try {
        // Load pending registrations
        const pendingResult = await getPendingRegistrations();
        if (pendingResult.pendingRegistrations) {
            displayPendingRegistrations(pendingResult.pendingRegistrations);
            document.getElementById('pendingCount').textContent = pendingResult.pendingRegistrations.length;
        }

        // Load platform stats
        const statsResult = await getStats();
        if (statsResult.stats) {
            updateStats(statsResult.stats);
        }

    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

// Display pending registrations
function displayPendingRegistrations(users) {
    const container = document.getElementById('pendingList');
    
    if (users.length === 0) {
        container.innerHTML = '<p>No pending registrations</p>';
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="user-card">
            <h4>${user.name} (${user.role})</h4>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Address:</strong> ${user.address}</p>
            <p><strong>Registered:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
            
            <!-- Documents Section -->
            <div class="documents-section">
                <h5>Uploaded Documents:</h5>
                <div id="documents-${user.id}">
                    <button class="btn btn-primary" onclick="loadUserDocuments(${user.id})">View Documents</button>
                </div>
            </div>
            
            <div class="user-actions">
                <button class="btn btn-approve" onclick="approveUser(${user.id})">Approve</button>
                <button class="btn btn-reject" onclick="rejectUser(${user.id})">Reject</button>
            </div>
        </div>
    `).join('');
}

// Update stats
function updateStats(stats) {
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('donorsCount').textContent = stats.totalDonors || 0;
    document.getElementById('ngosCount').textContent = stats.totalReceivers || 0;
}

// Approve user
async function approveUser(userId) {
    if (confirm('Are you sure you want to approve this user?')) {
        const result = await updateUserStatus(userId, 'approve');
        if (result.success) {
            alert('User approved successfully!');
            loadAdminDashboard(); // Refresh
        } else {
            alert('Error: ' + result.error);
        }
    }
}

// Reject user
async function rejectUser(userId) {
    if (confirm('Are you sure you want to reject this user?')) {
        const result = await updateUserStatus(userId, 'reject');
        if (result.success) {
            alert('User rejected successfully!');
            loadAdminDashboard(); // Refresh
        } else {
            alert('Error: ' + result.error);
        }
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏢 Admin dashboard loaded');
    checkAdminAuth();
});
// Load user documents
// Load user documents
// Load user documents
async function loadUserDocuments(userId) {
    try {
        const response = await fetch(`${API_BASE}/uploads/user-documents/${userId}`);
        const result = await response.json();
        
        if (result.documents && result.documents.length > 0) {
            const documentsHtml = result.documents.map(doc => `
                <div class="document-item">
                    <strong>${doc.document_type}:</strong> 
                    <a href="#" onclick="viewDocumentInfo('${doc.document_type}', ${userId})" class="btn btn-primary">
                        View Document Info
                    </a>
                </div>
            `).join('');
            
            document.getElementById(`documents-${userId}`).innerHTML = documentsHtml;
        } else {
            document.getElementById(`documents-${userId}`).innerHTML = '<p>No documents uploaded</p>';
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        document.getElementById(`documents-${userId}`).innerHTML = '<p>Error loading documents</p>';
    }
}
// Show document information
function viewDocumentInfo(docType, userId) {
    alert(`📄 Document: ${docType}\n👤 User ID: ${userId}\n\nIn a real system, this would show the actual uploaded file. For now, this confirms the document was registered in our system.`);
}