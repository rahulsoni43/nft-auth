function displayDemoResults(data) {
    const score = data.authenticity_score || 0;
    let statusColor, statusIcon, statusText, recommendation;
    
    if (score >= 90) {
        statusColor = 'green';
        statusIcon = '✅';
        statusText = 'VERIFIED AUTHENTIC';
        recommendation = 'SAFE TO PURCHASE';
    } else if (score >= 80) {
        statusColor = 'green';
        statusIcon = '✅'; 
        statusText = 'LIKELY AUTHENTIC';
        recommendation = 'LOW RISK';
    } else if (score >= 65) {
        statusColor = 'yellow';
        statusIcon = '⚠️';
        statusText = 'QUESTIONABLE';
        recommendation = 'INVESTIGATE FURTHER';
    } else if (score >= 40) {
        statusColor = 'orange';
        statusIcon = '⚠️';
        statusText = 'HIGH RISK';
        recommendation = 'AVOID PURCHASE';
    } else {
        statusColor = 'red';
        statusIcon = '❌';
        statusText = 'FRAUD SUSPECTED'; 
        recommendation = 'DO NOT PURCHASE';
    }
    
    // ... rest of display logic
}