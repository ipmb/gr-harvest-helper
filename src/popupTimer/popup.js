let taskName = 'Unknown Task';
let taskId = 'Unknown ID';
let tabURL = '';

// Clear existing message listeners to prevent duplicates
chrome.runtime.onMessage.removeListener(handleMessage);

// Message listener to process task details
function handleMessage(response) {
  if (response && response.id && response.title) {
    taskId = response.id;
    taskName = response.title;
    console.log('[GR-Time-Tracker]: Message received from content script:', response);
    updateUI();
  } else {
    console.warn('[GR-Time-Tracker]: Invalid message received:', response);
  }
}

// Register the message listener
chrome.runtime.onMessage.addListener(handleMessage);

// Query the active tab and send a message to the content script
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    const activeTab = tabs[0];
    tabURL = activeTab.url;
    console.log(`[GR-Time-Tracker]: Active Tab URL: ${tabURL}`);

    if (/^https:\/\/(gitlab\.com|github\.com|.*\.atlassian\.net|zammad\.com)/.test(tabURL)) {
      console.log('[GR-Time-Tracker]: Sending message to content script...');
      chrome.tabs.sendMessage(activeTab.id, { action: 'getTaskDetails' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            '[GR-Time-Tracker]: Error communicating with content script:',
            chrome.runtime.lastError.message
          );
        } else if (response) {
          console.log('[GR-Time-Tracker]: Response from content script:', response);
          handleMessage(response);
        } else {
          console.warn('[GR-Time-Tracker]: No response from content script.');
        }
      });
    } else {
      console.error('[GR-Time-Tracker]: Unsupported URL, content script not loaded.');
    }
  } else {
    console.error('[GR-Time-Tracker]: No active tab found.');
  }
});

// Update the popup UI
function updateUI() {
  const harvestTimer = document.querySelector('.harvest-timer');
  if (harvestTimer) {
    harvestTimer.setAttribute('data-item', JSON.stringify({ id: taskId, name: taskName }));
    harvestTimer.setAttribute('data-permalink', tabURL);
    harvestTimer.click();
    console.log('[GR-Time-Tracker]: UI updated with task details.');
  }
}
