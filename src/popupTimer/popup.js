let taskName = 'Unknown Task';
let taskId = 'Unknown ID';
let tabURL = '';

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((response) => {
  if (response && response.id && response.title) {
    taskId = response.id;
    taskName = response.title;
    updateUI();
  } else {
    console.warn('[GR-Time-Tracker]: Invalid message received:', response);
  }
});

// Query the active tab to retrieve its URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    const activeTab = tabs[0];
    tabURL = activeTab.url;
    console.log(`[GR-Time-Tracker]: Active Tab URL: ${tabURL}`);
  } else {
    console.error('[GR-Time-Tracker]: No active tab found.');
  }
});

// Function to update the popup UI
function updateUI() {
  const harvestTimer = document.querySelector('.harvest-timer');
  if (harvestTimer) {
    harvestTimer.setAttribute('data-item', JSON.stringify({ id: taskId, name: taskName }));
    harvestTimer.setAttribute('data-permalink', tabURL);
    harvestTimer.click();
  }
}
