// MedBridge Platform JavaScript
// Assessment data and medical logic

// Global variables
let selectedSymptoms = [];
let selectedSeverity = '';
let currentStep = 1;
let userLocation = null;

// Medical assessment database
const medicalDatabase = {
    // Symptom combinations and their possible conditions
    assessments: {
        'fever,headache,nausea': {
            conditions: ['Malaria', 'Typhoid Fever', 'Viral Infection'],
            urgency: 'moderate',
            actions: [
                'Take temperature every 2 hours and record it',
                'Drink plenty of fluids (water, oral rehydration solution)',
                'Rest in a cool, well-ventilated area',
                'Take paracetamol for fever (follow package instructions)',
                'Monitor for worsening symptoms'
            ],
            seekHelp: 'If fever exceeds 39°C (102°F) or symptoms worsen, seek medical attention immediately'
        },
        'fever,headache,joint-pain': {
            conditions: ['Dengue Fever', 'Chikungunya', 'Malaria'],
            urgency: 'high',
            actions: [
                'Seek medical attention immediately - do not delay',
                'Take paracetamol for pain (avoid aspirin and ibuprofen)',
                'Drink fluids frequently to prevent dehydration',
                'Monitor for bleeding, severe abdominal pain, or difficulty breathing',
                'Rest completely'
            ],
            seekHelp: 'Immediate medical attention required - these symptoms may indicate dengue or other serious conditions'
        },
        'diarrhea,nausea,abdominal': {
            conditions: ['Gastroenteritis', 'Food Poisoning', 'Cholera'],
            urgency: 'moderate',
            actions: [
                'Start oral rehydration therapy immediately',
                'Drink small amounts of clear fluids frequently',
                'Avoid solid food until vomiting stops',
                'Monitor for signs of dehydration',
                'Keep a record of fluid intake and output'
            ],
            seekHelp: 'Seek medical help if unable to keep fluids down for 12+ hours or signs of severe dehydration appear'
        },
        'breathing,chest-pain': {
            conditions: ['Asthma Attack', 'Pneumonia', 'Heart Emergency'],
            urgency: 'high',
            actions: [
                'CALL EMERGENCY SERVICES IMMEDIATELY',
                'Sit upright, do not lie down',
                'Loosen tight clothing around neck and chest',
                'If conscious and not allergic, give aspirin (if available)',
                'Stay calm and reassure the person'
            ],
            seekHelp: 'EMERGENCY - Call ambulance/emergency services now'
        },
        'fever,rash': {
            conditions: ['Measles', 'Dengue Fever', 'Allergic Reaction'],
            urgency: 'moderate',
            actions: [
                'Isolate from others (potentially contagious)',
                'Take photos of rash to show healthcare provider',
                'Take paracetamol for fever',
                'Apply cool compress to reduce itching',
                'Monitor breathing and swallowing'
            ],
            seekHelp: 'Seek medical evaluation within 24 hours, immediately if breathing difficulties develop'
        }
    },
    
    // Default assessment for unknown combinations
    defaultAssessment: {
        conditions: ['Multiple Possible Conditions'],
        urgency: 'moderate',
        actions: [
            'Monitor symptoms closely and record changes',
            'Ensure adequate rest and hydration',
            'Take temperature and vital signs if possible',
            'Avoid self-medication unless absolutely necessary',
            'Prepare to seek medical attention if symptoms worsen'
        ],
        seekHelp: 'Consult with healthcare provider for proper diagnosis and treatment'
    }
};

// Emergency contacts by region (simplified)
const emergencyNumbers = {
    'US': '911',
    'UK': '999',
    'Nigeria': '199',
    'India': '108',
    'default': '911'
};

// Healthcare options database (mock data)
const healthcareOptions = {
    telemedicine: [
        { name: 'MedConnect24', type: 'Telemedicine', available: true, waitTime: '5-10 min' },
        { name: 'DocOnCall', type: 'Video Consultation', available: true, waitTime: '10-15 min' }
    ],
    clinics: [
        { name: 'Community Health Center', distance: '2.3 km', type: 'Clinic', open: true },
        { name: 'General Hospital', distance: '5.7 km', type: 'Hospital', open: true }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setEmergencyNumber();
});

// Initialize application
function initializeApp() {
    console.log('MedBridge Platform Initialized');
    
    // Set up event listeners
    setupEventListeners();
    
    // Request location permission
    requestLocation();
}

// Set emergency number based on location
function setEmergencyNumber() {
    const emergencyElement = document.getElementById('localEmergencyNumber');
    // Default to 911, in real app would detect user's location
    emergencyElement.textContent = emergencyNumbers.default;
}

// Request user location
function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('Location acquired:', userLocation);
            },
            (error) => {
                console.log('Location access denied:', error);
            }
        );
    }
}

// Set up event listeners
function setupEventListeners() {
    // Symptom selection
    const symptomButtons = document.querySelectorAll('.symptom-btn');
    symptomButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleSymptom(this);
        });
    });
    
    // Severity selection
    const severityButtons = document.querySelectorAll('.severity-btn');
    severityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            selectSeverity(this);
        });
    });
}

// Start symptom assessment
function startAssessment() {
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('assessmentSection').classList.remove('hidden');
    updateProgress(50);
}

// Toggle symptom selection
function toggleSymptom(button) {
    const symptom = button.dataset.symptom;
    
    if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        selectedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    } else {
        button.classList.add('selected');
        selectedSymptoms.push(symptom);
    }
    
    // Enable/disable next button
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = selectedSymptoms.length === 0;
    
    console.log('Selected symptoms:', selectedSymptoms);
}

// Select severity level
function selectSeverity(button) {
    // Remove selection from other buttons
    document.querySelectorAll('.severity-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Select this button
    button.classList.add('selected');
    selectedSeverity = button.dataset.severity;
    
    // Enable assessment button
    document.getElementById('assessBtn').disabled = false;
    
    console.log('Selected severity:', selectedSeverity);
}

// Navigate to next step
function nextStep() {
    if (currentStep === 1) {
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        currentStep = 2;
        updateProgress(75);
    }
}

// Navigate to previous step
function prevStep() {
    if (currentStep === 2) {
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('step1').classList.remove('hidden');
        currentStep = 1;
        updateProgress(50);
    }
}

// Update progress bar
function updateProgress(percentage) {
    document.getElementById('progressFill').style.width = percentage + '%';
}

// Get medical assessment
function getAssessment() {
    updateProgress(100);
    
    // Hide assessment section
    document.getElementById('assessmentSection').classList.add('hidden');
    
    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // Generate assessment results
    const assessment = generateAssessment();
    displayResults(assessment);
}

// Generate assessment based on symptoms and severity
function generateAssessment() {
    const symptomKey = selectedSymptoms.sort().join(',');
    
    // Look for specific symptom combination
    let assessment = medicalDatabase.assessments[symptomKey];
    
    // If no specific match, use default
    if (!assessment) {
        assessment = medicalDatabase.defaultAssessment;
        
        // Adjust urgency based on severity and critical symptoms
        if (selectedSeverity === 'severe' || 
            selectedSymptoms.includes('chest-pain') || 
            selectedSymptoms.includes('breathing')) {
            assessment.urgency = 'high';
        }
    }
    
    // Adjust urgency based on severity
    if (selectedSeverity === 'severe' && assessment.urgency === 'moderate') {
        assessment.urgency = 'high';
    }
    
    return assessment;
}

// Display assessment results
function displayResults(assessment) {
    // Set result icon and title based on urgency
    const resultIcon = document.getElementById('resultIcon');
    const urgencyBadge = document.getElementById('urgencyBadge');
    
    switch(assessment.urgency) {
        case 'low':
            resultIcon.textContent = '✅';
            urgencyBadge.textContent = 'LOW URGENCY';
            urgencyBadge.className = 'urgency-badge low';
            break;
        case 'moderate':
            resultIcon.textContent = '⚠️';
            urgencyBadge.textContent = 'MODERATE URGENCY';
            urgencyBadge.className = 'urgency-badge moderate';
            break;
        case 'high':
            resultIcon.textContent = '🚨';
            urgencyBadge.textContent = 'HIGH URGENCY';
            urgencyBadge.className = 'urgency-badge high';
            break;
    }
    
    // Display possible conditions
    const conditionsList = document.getElementById('conditionsList');
    conditionsList.innerHTML = '';
    assessment.conditions.forEach(condition => {
        const li = document.createElement('li');
        li.textContent = condition;
        conditionsList.appendChild(li);
    });
    
    // Display immediate actions
    const actionsList = document.getElementById('actionsList');
    actionsList.innerHTML = '';
    assessment.actions.forEach(action => {
        const li = document.createElement('li');
        li.textContent = action;
        actionsList.appendChild(li);
    });
}

// Find telemedicine options
function findTelehealth() {
    alert('Connecting you with available doctors...\n\n' +
          '📞 MedConnect24 - Available now (5-10 min wait)\n' +
          '📞 DocOnCall - Available now (10-15 min wait)\n\n' +
          'This feature would connect to real telemedicine providers.');
}

// Find nearby clinics
function findNearbyClinic() {
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('healthcareFinder').classList.remove('hidden');
    
    // Show mock healthcare options
    showHealthcareOptions();
}

// Show healthcare options
function showHealthcareOptions() {
    const optionsContainer = document.getElementById('healthcareOptions');
    optionsContainer.innerHTML = `
        <div style="margin-top: 2rem;">
            <h4>🏥 Nearby Healthcare Facilities</h4>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">
                <div style="padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem;">
                    <strong>Community Health Center</strong>
                    <p>Distance: 2.3 km • Status: Open • Type: Primary Care</p>
                    <button class="btn btn-primary" style="margin-top: 0.5rem;">Get Directions</button>
                </div>
                <div style="padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem;">
                    <strong>General Hospital</strong>
                    <p>Distance: 5.7 km • Status: Open • Type: Emergency Care</p>
                    <button class="btn btn-primary" style="margin-top: 0.5rem;">Get Directions</button>
                </div>
            </div>
            
            <h4 style="margin-top: 2rem;">📞 Telemedicine Options</h4>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">
                <div style="padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem; background: rgba(34, 197, 94, 0.05);">
                    <strong>MedConnect24</strong>
                    <p>Available now • Wait time: 5-10 minutes</p>
                    <button class="btn btn-success" style="margin-top: 0.5rem;">Connect Now</button>
                </div>
                <div style="padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem; background: rgba(34, 197, 94, 0.05);">
                    <strong>DocOnCall</strong>
                    <p>Available now • Wait time: 10-15 minutes</p>
                    <button class="btn btn-success" style="margin-top: 0.5rem;">Connect Now</button>
                </div>
            </div>
        </div>
    `;
}

// Track symptoms feature
function trackSymptoms() {
    alert('Symptom Tracking Feature:\n\n' +
          '📊 Your symptoms will be saved\n' +
          '📈 Track progress over time\n' +
          '📤 Share data with your doctor\n\n' +
          'This feature would integrate with a symptom tracking system.');
}

// Share results
function shareResults() {
    const shareText = `MedBridge Assessment Results:\n\n` +
                     `Symptoms: ${selectedSymptoms.join(', ')}\n` +
                     `Severity: ${selectedSeverity}\n` +
                     `Urgency: ${document.getElementById('urgencyBadge').textContent}\n\n` +
                     `Generated by MedBridge Platform - medbridge.com`;
    
    if (navigator.share) {
        navigator.share({
            title: 'MedBridge Assessment',
            text: shareText
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Assessment results copied to clipboard!');
        });
    }
}

// Start new assessment
function startNewAssessment() {
    // Reset variables
    selectedSymptoms = [];
    selectedSeverity = '';
    currentStep = 1;
    
    // Reset UI
    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelectorAll('.severity-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('assessBtn').disabled = true;
    
    // Show welcome section
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('healthcareFinder').classList.add('hidden');
    document.getElementById('welcomeSection').classList.remove('hidden');
    
    updateProgress(0);
}

// Find nearby help
function findNearbyHelp() {
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('healthcareFinder').classList.remove('hidden');
    showHealthcareOptions();
}

// Call emergency services
function callEmergency() {
    const emergencyNumber = document.getElementById('localEmergencyNumber').textContent;
    
    if (confirm(`Call emergency services (${emergencyNumber}) now?\n\nThis will attempt to dial emergency services.`)) {
        // In a real app, this would make the call
        window.location.href = `tel:${emergencyNumber}`;
    }
}

// Find healthcare options based on location
function findHealthcareOptions() {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();
    
    if (!location && !userLocation) {
        alert('Please enter your location or allow GPS access.');
        return;
    }
    
    // In a real app, this would query a healthcare database
    showHealthcareOptions();
    
    // Show loading state briefly
    const optionsContainer = document.getElementById('healthcareOptions');
    optionsContainer.innerHTML = '<p>🔄 Finding healthcare options near you...</p>';
    
    setTimeout(() => {
        showHealthcareOptions();
    }, 1500);
}

// Console log for debugging
console.log('MedBridge Platform JavaScript loaded successfully');
