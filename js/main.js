// Configuration
const API_BASE_URL = 'http://localhost:8000'; // Update for production

// Smooth scrolling
function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({
        behavior: 'smooth'
    });
}

// Live demo functionality
async function runLiveDemo() {
    const contractAddress = document.getElementById('demoContract').value;
    const tokenId = document.getElementById('demoToken').value;
    const resultsDiv = document.getElementById('demoResults');
    
    // Show loading state
    resultsDiv.innerHTML = `
        <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Analyzing NFT authenticity...</p>
        </div>
    `;
    resultsDiv.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/verify-nft`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contract_address: contractAddress,
                token_id: tokenId
            })
        });
        
        const data = await response.json();
        displayDemoResults(data);
        
        // Track demo usage
        trackEvent('demo_completed', { contract: contractAddress, token: tokenId });
        
    } catch (error) {
        console.error('Demo error:', error);
        resultsDiv.innerHTML = `
            <div class="border-l-4 border-red-500 pl-4">
                <h3 class="text-xl font-bold text-red-700">❌ Demo Error</h3>
                <p class="text-red-600">Could not connect to verification service. Please try again.</p>
            </div>
        `;
    }
}

function displayDemoResults(data) {
    const resultsDiv = document.getElementById('demoResults');
    const score = data.authenticity_score || 0;
    const status = data.status || 'UNKNOWN';
    
    let statusColor, statusIcon, statusText;
    
    if (status === 'FRAUD_DETECTED') {
        statusColor = 'red';
        statusIcon = '🚨';
        statusText = 'FRAUD DETECTED';
    } else if (score >= 80) {
        statusColor = 'green';
        statusIcon = '✅';
        statusText = 'AUTHENTIC';
    } else if (score >= 60) {
        statusColor = 'yellow';
        statusIcon = '⚠️';
        statusText = 'QUESTIONABLE';
    } else {
        statusColor = 'red';
        statusIcon = '❌';
        statusText = 'HIGH RISK';
    }
    
    const greenFlags = data.green_flags || data.analysis?.green_flags || [];
    const redFlags = data.red_flags || data.analysis?.red_flags || [];
    
    resultsDiv.innerHTML = `
        <div class="border-l-4 border-${statusColor}-500 pl-4 mb-6">
            <h3 class="text-2xl font-bold text-${statusColor}-700">
                ${statusIcon} ${statusText}
            </h3>
            <p class="text-lg">Authenticity Score: ${score}%</p>
            ${data.fraud_type ? `<p class="text-sm text-red-600">Fraud Type: ${data.fraud_type}</p>` : ''}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="font-semibold text-green-700 mb-2">✅ Protective Factors</h4>
                <ul class="list-disc list-inside space-y-1">
                    ${greenFlags.length ? greenFlags.map(flag => `<li class="text-sm">${flag}</li>`).join('') : '<li class="text-sm text-gray-500">None detected</li>'}
                </ul>
            </div>
            
            <div>
                <h4 class="font-semibold text-red-700 mb-2">⚠️ Risk Factors</h4>
                <ul class="list-disc list-inside space-y-1">
                    ${redFlags.length ? redFlags.map(flag => `<li class="text-sm">${flag}</li>`).join('') : '<li class="text-sm text-gray-500">None detected</li>'}
                </ul>
            </div>
        </div>
        
        ${status !== 'FRAUD_DETECTED' ? `
        <div class="mt-6 p-4 bg-gray-50 rounded">
            <h4 class="font-semibold mb-2">Technical Details</h4>
            <p><strong>Collection:</strong> ${data.metadata?.name || 'Unknown'}</p>
            <p><strong>Owner:</strong> ${data.owner || 'Unknown'}</p>
            <p><strong>Recommendation:</strong> ${data.recommendation || 'Review manually'}</p>
        </div>
        ` : ''}
    `;
}

// Analytics tracking
function trackEvent(eventName, properties = {}) {
    // Add your analytics tracking here (Google Analytics, Mixpanel, etc.)
    console.log('Event tracked:', eventName, properties);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('NFT Authentication Platform loaded');
    trackEvent('page_viewed', { page: 'landing' });
});