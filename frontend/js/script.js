// Global object to store form data - declare only once
if (typeof window.registrationData === 'undefined') {
    window.registrationData = {};
}
// Function to collect data from current step
function collectStepData(stepNumber) {
    const stepData = {};
    
    switch(stepNumber) {
        case 1: // Basic Info
            stepData.name = document.getElementById('name')?.value || '';
            stepData.email = document.getElementById('email')?.value || '';
            stepData.phone = document.getElementById('phone')?.value || '';
            stepData.address = document.getElementById('address')?.value || '';
            stepData.pincode = document.getElementById('pincode')?.value || '';
            break;
        // We'll handle document and bank data later
    }
    
    // Merge with existing data
    registrationData = { ...registrationData, ...stepData };
    console.log('📝 Collected step data:', stepData);
    console.log('💾 Total registration data:', registrationData);
}
// Stats Counter Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current).toLocaleString();
                setTimeout(updateCounter, 10);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// Modal Functions
function openRegistration(role) {
    console.log('Opening registration for:', role);
    const modal = document.getElementById('registrationModal');
    const modalBody = document.getElementById('modalBody');
    
    if (role === 'admin') {
        modalBody.innerHTML = `
            <h2>Admin Login</h2>
            <div class="form-group">
                <label for="admin-email">Email</label>
                <input type="email" id="admin-email" required>
            </div>
            <div class="form-group">
                <label for="admin-password">Password</label>
                <input type="password" id="admin-password" required>
            </div>
            <button class="btn btn-primary" onclick="adminLogin()">Login</button>
        `;
    } else if (role === 'volunteer') {
    modalBody.innerHTML = `
        <h2>Volunteer Registration</h2>
        <div class="form-group">
            <label for="volunteer-name">Full Name *</label>
            <input type="text" id="volunteer-name" required>
        </div>
        <div class="form-group">
            <label for="volunteer-email">Email *</label>
            <input type="email" id="volunteer-email" required>
        </div>
        <div class="form-group">
            <label for="volunteer-phone">Phone Number *</label>
            <input type="tel" id="volunteer-phone" required>
        </div>
        <div class="form-group">
            <label for="volunteer-address">Address</label>
            <textarea id="volunteer-address" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label for="volunteer-pincode">PIN Code *</label>
            <input type="text" id="volunteer-pincode" required>
        </div>
        <div class="form-group">
            <label for="volunteer-aadhar">Aadhaar Card *</label>
            <input type="file" id="volunteer-aadhar" accept=".pdf,.jpg,.png" required>
        </div>
        <div class="form-group">
            <label for="volunteer-id">ID Proof (Student ID/Employee ID) *</label>
            <input type="file" id="volunteer-id" accept=".pdf,.jpg,.png" required>
        </div>
        <button class="btn btn-primary" onclick="submitVolunteerRegistration()">Join as Volunteer</button>
    `;
}else {
        modalBody.innerHTML = getBasicInfoForm(role);
    }
    
    modal.style.display = 'flex';
}

function getBasicInfoForm(role) {
    let title, orgLabel;
    
    if (role === 'donor') {
        title = 'Food Donor Registration';
        orgLabel = 'Restaurant/Organization Name';
    } else if (role === 'receiver') {
        title = 'NGO Registration';
        orgLabel = 'NGO Name';
    } else if (role === 'animal') {
        title = 'Animal Feed Partner Registration';
        orgLabel = 'Farm/Organization Name';
    } else if (role === 'compost') {
        title = 'Composting Partner Registration';
        orgLabel = 'Facility/Organization Name';
    }
    
   return `
    <h2>${title}</h2>
    <div class="form-step active" id="step-1">
        <h3>Basic Information</h3>
        <div class="form-group">
            <label for="name">${orgLabel} *</label>
            <input type="text" id="name" value="${registrationData.name || ''}" required>
        </div>
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" value="${registrationData.email || ''}" required>
        </div>
        <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" value="${registrationData.phone || ''}" required>
        </div>
        <div class="form-group">
            <label for="address">Address</label>
            <textarea id="address" rows="3">${registrationData.address || ''}</textarea>
        </div>
        <div class="form-group">
            <label for="pincode">PIN Code</label>
            <input type="text" id="pincode" value="${registrationData.pincode || ''}" required>
        </div>
        <div class="form-navigation">
            <button type="button" class="btn btn-primary" onclick="showDocumentForm('${role}')">Next: Documents</button>
        </div>
    </div>
`;
}

function showDocumentForm(role) {
    // Collect data from current step first
    collectStepData(1);
    
    const modalBody = document.getElementById('modalBody');
    let title, documentFields;
    
    if (role === 'donor') {
        title = 'Food Donor Registration';
        documentFields = `
            <div class="form-group">
                <label>FSSAI License *</label>
                <input type="file" id="fssai-license" accept=".pdf,.jpg,.png" required>
            </div>
            <div class="form-group">
                <label>PAN Card *</label>
                <input type="file" id="pan-card" accept=".pdf,.jpg,.png" required>
            </div>
            <div class="form-group">
                <label>Business Registration *</label>
                <input type="file" id="business-reg" accept=".pdf,.jpg,.png" required>
            </div>
        `;
    } else if (role === 'receiver') {
        title = 'NGO Registration';
        documentFields = `
            <div class="form-group">
                <label>NGO Registration Certificate *</label>
                <input type="file" id="ngo-cert" accept=".pdf,.jpg,.png" required>
            </div>
            <div class="form-group">
                <label>80G Certificate *</label>
                <input type="file" id="80g-cert" accept=".pdf,.jpg,.png" required>
            </div>
            <div class="form-group">
                <label>PAN Card *</label>
                <input type="file" id="pan-card" accept=".pdf,.jpg,.png" required>
            </div>
        `;
    } else if (role === 'animal' || role === 'compost') {
        title = role === 'animal' ? 'Animal Feed Partner Registration' : 'Composting Partner Registration';
        documentFields = `
            <div class="form-group">
                <label>Business Registration *</label>
                <input type="file" id="business-reg" accept=".pdf,.jpg,.png" required>
            </div>
            <div class="form-group">
                <label>PAN Card *</label>
                <input type="file" id="pan-card" accept=".pdf,.jpg,.png" required>
            </div>
            <div class="form-group">
                <label>Environmental License *</label>
                <input type="file" id="env-license" accept=".pdf,.jpg,.png" required>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <div class="form-step active">
            <h3>Document Upload</h3>
            ${documentFields}
            <div class="form-group">
                <label>Address Proof *</label>
                <input type="file" id="address-proof" accept=".pdf,.jpg,.png" required>
            </div>
            <div class="form-navigation">
                <button type="button" class="btn btn-secondary" onclick="openRegistration('${role}')">Back</button>
                <button type="button" class="btn btn-primary" onclick="collectDocumentsAndProceed('${role}')">Next: Bank Details</button>
            </div>
        </div>
    `;
}
function showBankForm(role) {
    // Collect any additional data if needed
    console.log('💾 Current registration data:', registrationData);
    
    const modalBody = document.getElementById('modalBody');
    let title;
    
    if (role === 'donor') title = 'Food Donor Registration';
    else if (role === 'receiver') title = 'NGO Registration';
    else if (role === 'animal') title = 'Animal Feed Partner Registration';
    else if (role === 'compost') title = 'Composting Partner Registration';
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <div class="form-step active">
            <h3>Bank Details</h3>
            <div class="form-group">
                <label>Account Holder Name</label>
                <input type="text" required>
            </div>
            <div class="form-group">
                <label>Account Number</label>
                <input type="text" required>
            </div>
            <div class="form-group">
                <label>IFSC Code</label>
                <input type="text" required>
            </div>
            <div class="form-group">
                <label>Bank Name</label>
                <input type="text" required>
            </div>
            <div class="form-navigation">
                <button type="button" class="btn btn-secondary" onclick="showDocumentForm('${role}')">Back</button>
                <button type="button" class="btn btn-primary" onclick="submitRegistrationWithData('${role}')">Submit Registration</button>
            </div>
        </div>
    `;
}

function closeModal() {
    document.getElementById('registrationModal').style.display = 'none';
}

// Update registration to handle all roles
async function submitRegistration(role, formData) {
    console.log('🚀 Starting registration for:', role);
    
    const userData = {
        email: formData.email,
        password: 'TempPass123!',
        name: formData.name,
        phone: formData.phone,
        role: role,
        address: formData.address,
        pincode: formData.pincode
    };

    console.log('📦 Sending user data to API');
    const result = await registerUser(userData);
    
    if (result.success) {
        console.log('✅ User registered, uploading documents...');
        
        // Upload sample documents for this user
        const docTypes = getDocumentTypesForRole(role);
        let uploadedCount = 0;
        
        for (const docType of docTypes) {
            const uploadResult = await uploadDocumentReference(result.userId, docType);
            if (uploadResult.success) {
                uploadedCount++;
                console.log(`✅ ${docType} uploaded`);
            }
        }
        
        console.log(`📄 ${uploadedCount} documents uploaded for user ${result.userId}`);
        alert(`✅ ${getRoleDisplayName(role)} registration submitted successfully!\n\n${uploadedCount} documents uploaded. Our admin team will verify your account.`);
        closeModal();
    } else {
        alert(`❌ Registration failed: ${result.error}`);
    }
}

function submitVolunteerRegistration() {
    alert('Thank you for volunteering! We will contact you with opportunities soon.');
    closeModal();
}

function adminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    console.log('🔐 Admin login attempt:', email);

    // Call the actual admin login API
    adminLoginAPI(email, password)
        .then(result => {
            if (result.success) {
                alert('✅ Admin login successful!');
                // Redirect to admin dashboard
                window.location.href = 'admin.html';
            } else {
                alert(`❌ Admin login failed: ${result.error}`);
            }
        })
        .catch(error => {
            console.error('Admin login error:', error);
            alert('❌ Login failed. Please try again.');
        });
}

// Rules Toggle
function toggleRules(rulesId) {
    const rulesContent = document.getElementById(rulesId);
    rulesContent.classList.toggle('active');
}

// Chatbot Toggle
document.getElementById('chatbotToggle').addEventListener('click', function() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    chatbotWindow.style.display = chatbotWindow.style.display === 'block' ? 'none' : 'block';
});

function startChat(type) {
    const messages = {
        waste: "Our AI suggests: 1) Store food properly 2) Plan portions 3) Donate surplus 4) Compost scraps",
        quantity: "Based on event size: For 100 people, prepare 80-90 meals to minimize waste",
        recipe: "Try: Leftover vegetable curry, Stale bread croutons, Fruit peel chutney"
    };
    
    alert(`FoodWise AI: ${messages[type]}`);
    document.getElementById('chatbotWindow').style.display = 'none';
}

// Theme Toggle with proper contrast
document.getElementById('theme-checkbox').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// Initialize
window.onload = function() {
    animateStats();
    
    // Close modal when clicking outside
    document.getElementById('registrationModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
};


// Helper function to generate temporary password
function generateTempPassword() {
    return 'TempPass123!'; // In production, this would be user-provided
}

// Helper function to get display name for roles
function getRoleDisplayName(role) {
    const roleNames = {
        'donor': 'Food Donor',
        'receiver': 'NGO/Receiver', 
        'volunteer': 'Volunteer',
        'animal': 'Animal Feed Partner',
        'compost': 'Composting Partner',
        'admin': 'Admin'
    };
    return roleNames[role] || role;
}


// Collect form data and submit to API
async function submitRegistrationWithData(role) {
    console.log('💾 Using stored data:', registrationData);
    
    // Validate required fields
    if (!registrationData.name || !registrationData.email || !registrationData.phone) {
        alert('❌ Please fill in all required fields: Name, Email, and Phone');
        return;
    }

    await submitRegistration(role, registrationData);
    
    // Reset data after submission
    registrationData = {};
}
// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ FoodWise India fully loaded');
    animateStats();
    
    // Close modal when clicking outside
    document.getElementById('registrationModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
});
async function submitVolunteerRegistration() {
    const formData = {
        name: document.getElementById('volunteer-name').value,
        email: document.getElementById('volunteer-email').value,
        phone: document.getElementById('volunteer-phone').value,
        address: document.getElementById('volunteer-address').value,
        pincode: document.getElementById('volunteer-pincode').value
    };

    // Check if files are selected
    const aadharFile = document.getElementById('volunteer-aadhar').files[0];
    const idFile = document.getElementById('volunteer-id').files[0];

    if (!formData.name || !formData.email || !formData.phone || !formData.pincode) {
        alert('Please fill all required fields');
        return;
    }

    if (!aadharFile || !idFile) {
        alert('Please upload both Aadhaar Card and ID Proof');
        return;
    }

    await submitRegistration('volunteer', formData);
}


// Collect documents and proceed to next step
async function collectDocumentsAndProceed(role) {
    console.log('📄 Collecting documents for:', role);
    
    // Store that we have documents to upload later
    registrationData.hasDocuments = true;
    registrationData.role = role;
    
    // Proceed to bank details
    showBankForm(role);
}
// Upload sample documents for testing
async function uploadSampleDocuments(userId, role) {
    console.log('📤 Uploading sample documents for user:', userId);
    
    // Create sample document data (in real app, these would be actual files)
    const documentTypes = getDocumentTypesForRole(role);
    
    for (const docType of documentTypes) {
        try {
            // For now, we'll create a dummy file entry in the database
            // In a real app, we would upload the actual file
            await uploadDocumentReference(userId, docType, `sample_${docType}.pdf`);
        } catch (error) {
            console.error(`Failed to upload ${docType}:`, error);
        }
    }
    
    console.log('✅ Sample documents uploaded for user:', userId);
}

// Get document types based on role
function getDocumentTypesForRole(role) {
    const documentMap = {
        'donor': ['FSSAI License', 'PAN Card', 'Business Registration', 'Address Proof'],
        'receiver': ['NGO Registration Certificate', '80G Certificate', 'PAN Card', 'Address Proof'],
        'animal': ['Business Registration', 'PAN Card', 'Environmental License', 'Address Proof'],
        'compost': ['Business Registration', 'PAN Card', 'Environmental License', 'Address Proof'],
        'volunteer': ['Aadhaar Card', 'ID Proof']
    };
    return documentMap[role] || [];
}
// Open login modal
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}
// Submit login - KEEP ONLY THIS VERSION
async function submitLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    console.log('🔐 Login attempt:', email);

    const result = await loginUser({ email, password });
    console.log('🔐 Login result:', result);

    // DEBUG: Check what we're getting
    console.log('Result success:', result.success);
    console.log('Result user:', result.user);
    console.log('Result error:', result.error);

    if (result.user) {  // Changed from result.success
    const userName = result.user.name || 'User';
    alert(`✅ Login successful! Welcome ${userName}`);
    closeLoginModal();
    
    localStorage.setItem('currentUser', JSON.stringify(result.user));
    redirectToDashboard(result.user.role);
} else {
    const errorMsg = result.error || 'Unknown error occurred';
    alert(`❌ Login failed: ${errorMsg}`);
}
}
// Redirect to respective dashboard
function redirectToDashboard(role) {
    const dashboards = {
         'donor': 'donor-dashboard.html',
        'receiver': 'ngo-dashboard.html', 
        // 'volunteer': 'volunteer-dashboard.html', // REMOVE THIS LINE
        'animal': 'animal-dashboard.html',
        'compost': 'compost-dashboard.html',
        'admin': 'admin.html'
    };
    
    const dashboard = dashboards[role];
    if (dashboard) {
        window.location.href = dashboard;
    } else {
        alert('Dashboard not available for your role yet');
    }
}
// AI Chat Functions
async function chatAboutWaste() {
    const query = document.getElementById('wasteQuery').value;
    if (!query) {
        alert('Please enter your food waste question');
        return;
    }

    showAILoading('Analyzing your food waste query...');
    const response = await foodWiseAI.chatAboutFoodWaste(query);
    showAIResponse('Food Waste Advice', response);
}

async function predictQuantity() {
    const eventDetails = document.getElementById('eventDetails').value;
    if (!eventDetails) {
        alert('Please describe your event');
        return;
    }

    showAILoading('Calculating food quantities...');
    const response = await foodWiseAI.predictFoodQuantity(eventDetails);
    showAIResponse('Food Quantity Prediction', response);
}

async function generateRecipe() {
    const ingredients = document.getElementById('ingredientsList').value;
    if (!ingredients) {
        alert('Please list your available ingredients');
        return;
    }

    showAILoading('Creating delicious recipe...');
    const response = await foodWiseAI.generateRecipe(ingredients);
    showAIResponse('Recipe Generated', response);
}

// UI Helpers
function showAILoading(message) {
    alert(`🔄 ${message}\n\nPlease wait while AI processes your request...`);
}

function showAIResponse(title, content) {
    alert(`🤖 ${title}\n\n${content}\n\n---\nPowered by Gemini AI`);
    
    // Clear inputs
    document.getElementById('wasteQuery').value = '';
    document.getElementById('eventDetails').value = '';
    document.getElementById('ingredientsList').value = '';
    
    document.getElementById('chatbotWindow').style.display = 'none';
}
// Chatbot Functions
// =====================
// Chatbot Launcher (Home Page)
// =====================

// Show/hide the chatbot window (the small launcher on home page)
function toggleChatbot() {
  const chatbot = document.getElementById('chatbotWindow');
  if (!chatbot) return;
  chatbot.style.display = chatbot.style.display === 'flex' ? 'none' : 'flex';
}

// Close button inside chatbot
function closeChatbot() {
  const chatbot = document.getElementById('chatbotWindow');
  if (!chatbot) return;
  chatbot.style.display = 'none';
}

/**
 * When user clicks one of the options inside chatbot:
 * - prediction  -> open prediction-dashboard.html
 * - recipe      -> open recipe-dashboard.html
 * - waste       -> open waste-dashboard.html (chat-style)
 */
function showFeature(feature) {
  if (feature === 'prediction') {
    window.location.href = 'prediction-dashboard.html';
  } else if (feature === 'recipe') {
    window.location.href = 'recipe-dashboard.html';
  } else if (feature === 'waste') {
    window.location.href = 'waste-dashboard.html';
  }
}



function getFeatureName(feature) {
    const names = {
        'prediction': 'Food Quantity Prediction',
        'recipe': 'Recipe Generator', 
        'waste': 'Food Waste Advice'
    };
    return names[feature] || 'this feature';
}

function addBotMessage(text) {
    const chatBody = document.getElementById('chatbotBody');
    const message = document.createElement('div');
    message.className = 'chat-message bot-message';
    message.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
}
// Food Quantity Prediction
async function calculateFoodQuantity() {
    const formData = {
        eventType: document.getElementById('eventType').value,
        mealType: document.getElementById('mealType').value,
        guestCount: document.getElementById('guestCount').value,
        cuisineType: document.getElementById('cuisineType').value,
        vegNonVeg: document.getElementById('vegNonVeg').value,
        menuSummary: document.getElementById('menuSummary').value,
        servingStyle: document.getElementById('servingStyle').value,
        attendanceRate: document.getElementById('attendanceRate').value
    };

    // Validate required fields
    if (!formData.eventType || !formData.mealType || !formData.guestCount) {
        alert('Please fill in all required fields: Event Type, Meal Type, and Number of Guests');
        return;
    }

    showAILoading('Calculating precise food quantities...');
    
    try {
        const response = await foodWiseAI.predictFoodQuantity(formData);
        displayPredictionResult(response);
    } catch (error) {
        showAIError('Failed to calculate food quantities');
    }
}

// Recipe Generator
async function generateSmartRecipe() {
    const formData = {
        ingredientList: document.getElementById('ingredientList').value,
        foodState: document.getElementById('foodState').value,
        cuisinePreference: document.getElementById('cuisinePreference').value,
        dietType: document.getElementById('dietType').value,
        servingsNeeded: document.getElementById('servingsNeeded').value,
        timeAvailable: document.getElementById('timeAvailable').value
    };

    if (!formData.ingredientList) {
        alert('Please list your available ingredients');
        return;
    }

    showAILoading('Creating a delicious recipe...');
    
    try {
        const response = await foodWiseAI.generateSmartRecipe(formData);
        displayRecipeResult(response);
    } catch (error) {
        showAIError('Failed to generate recipe');
    }
}

// Food Waste Advice
async function getWasteAdvice() {
    const formData = {
        wasteChallenge: document.getElementById('wasteChallenge').value,
        userRole: document.getElementById('userRole').value,
        kitchenScale: document.getElementById('kitchenScale').value,
        wastedFoods: document.getElementById('wastedFoods').value,
        budgetLevel: document.getElementById('budgetLevel').value
    };

    if (!formData.wasteChallenge) {
        alert('Please describe your food waste challenge');
        return;
    }

    showAILoading('Analyzing your food waste situation...');
    
    try {
        const response = await foodWiseAI.getFoodWasteAdvice(formData);
        displayWasteResult(response);
    } catch (error) {
        showAIError('Failed to get waste advice');
    }
}

// UI Helpers
function showAILoading(message) {
    alert(`🔄 ${message}\n\nPlease wait while AI processes your request...`);
}

function showAIError(message) {
    alert(`❌ ${message}\n\nPlease check your internet connection and try again.`);
}

// Result Display Functions (to be implemented next)
function displayPredictionResult(response) {
    const resultDiv = document.getElementById('predictionResult');
    resultDiv.innerHTML = `<h4>📊 Prediction Results</h4><pre>${response}</pre>`;
    resultDiv.style.display = 'block';
}

function displayRecipeResult(response) {
    const resultDiv = document.getElementById('recipeResult');
    resultDiv.innerHTML = `<h4>👨‍🍳 Generated Recipe</h4><pre>${response}</pre>`;
    resultDiv.style.display = 'block';
}

function displayWasteResult(response) {
    const resultDiv = document.getElementById('wasteResult');
    resultDiv.innerHTML = `<h4>♻️ Waste Reduction Advice</h4><pre>${response}</pre>`;
    resultDiv.style.display = 'block';
}