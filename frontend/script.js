const ws = new WebSocket('ws://127.0.0.1:8000/ws/hashtags');
let previousOrder = [];

/**
 * Updates the connection status UI
 * @param {boolean} connected 
 * @param {string} text 
 */
function updateStatus(connected, text) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (connected) {
        statusDot.classList.add('connected');
        statusText.textContent = 'Live';
    } else {
        statusDot.classList.remove('connected');
        statusText.textContent = text;
    }
}

/**
 * Returns CSS class for top ranks
 * @param {number} index 
 */
function getRankClass(index) {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
}

/**
 * Displays leaderboard data
 * @param {object} data 
 */
function displayLeaderboard(data) {
    const list = document.getElementById('leaderboardList');

    if (Object.keys(data).length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                </svg>
                <h3>No Data Yet</h3>
                <p>Waiting for hashtags to appear...</p>
            </div>
        `;
        return;
    }

    const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const currentOrder = sorted.map(([hashtag]) => hashtag);

    // Detect position changes
    const changedPositions = new Set();
    currentOrder.forEach((hashtag, index) => {
        const prevIndex = previousOrder.indexOf(hashtag);
        if (prevIndex !== -1 && prevIndex !== index) {
            changedPositions.add(hashtag);
        }
    });

    list.innerHTML = sorted.map(([hashtag, count], index) => `
        <div class="leaderboard-item ${changedPositions.has(hashtag) ? 'position-change' : ''}">
            <div class="rank ${getRankClass(index)}">#${index + 1}</div>
            <div class="hashtag-info">
                <div class="hashtag-label">Hashtag</div>
                <div class="hashtag-name">#${hashtag}</div>
            </div>
            <div class="tweet-count">
                <div class="count-number">${count.toLocaleString()}</div>
                <div class="count-label">Tweets</div>
            </div>
        </div>
    `).join('');

    previousOrder = currentOrder;
}

// WebSocket event handlers
ws.onopen = () => updateStatus(true, 'Live');
ws.onmessage = event => displayLeaderboard(JSON.parse(event.data));
ws.onerror = error => {
    console.error('WebSocket error:', error);
    updateStatus(false, 'Error');
};
ws.onclose = () => updateStatus(false, 'Disconnected');
