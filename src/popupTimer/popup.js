var taskName;
var tabURL;
var tab;
var id;

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (response) {
  if (response.id && response.title) {
    id = response.id;
    taskName = response.title;
    console.log(`Task received: ID = ${id}, Title = ${taskName}`);
    updateUI();
  } else {
    console.warn('Invalid message received:', response);
  }
});

// Query the active tab and send a message to the content script
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  if (tabs.length === 0) {
    console.error('[GR-Time-Tracker]: No active tab found.');
    return;
  }

  const activeTab = tabs[0];
  console.log('[GR-Time-Tracker]: Active Tab URL:', activeTab.url);

  if (/^https:\/\/(gitlab\.com|github\.com|.*\.atlassian\.net|zammad\.com)/.test(activeTab.url)) {
    console.log('[GR-Time-Tracker]: Sending message to content script...');
    setTimeout(() => {
      chrome.tabs.sendMessage(activeTab.id, { action: 'getTaskDetails' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            '[GR-Time-Tracker]: Error communicating with content script:',
            chrome.runtime.lastError.message
          );
        } else {
          console.log('[GR-Time-Tracker]: Response from content script:', response);
        }
      });
    }, 500);
  } else {
    console.warn('[GR-Time-Tracker]: Tab URL does not match required patterns.');
  }
});

// Function to update the popup UI
function updateUI() {
  const harvestTimer = document.querySelector('.harvest-timer');
  if (!harvestTimer) {
    console.warn('Harvest timer element not found.');
    return;
  }

  const item = { id: id || 'N/A', name: taskName || 'No Task Selected' };
  harvestTimer.setAttribute('data-item', JSON.stringify(item));
  harvestTimer.setAttribute('data-permalink', tabURL || 'N/A');
  harvestTimer.click();
  console.log('UI updated with task details:', item);
}

// Detect and adjust the iframe if present
let frameDetected = false;
let detectFrame = setInterval(() => {
  const harvestIframe = document.getElementById('harvest-iframe');
  if (harvestIframe && !frameDetected) {
    frameDetected = true;

    harvestIframe.style.top = '10px';

    const harvestOverlay = document.querySelector('.harvest-overlay');
    if (harvestOverlay) {
      harvestOverlay.style.background = 'white';
      harvestOverlay.style.overflow = 'hidden';
    }

    let scrollHeight = 300;
    setInterval(() => {
      if (
        harvestIframe.scrollHeight !== 300 &&
        harvestIframe.scrollHeight !== 0 &&
        harvestIframe.scrollHeight === scrollHeight
      ) {
        document.body.style.height = `${harvestIframe.scrollHeight}px`;
        document.body.style.width = '500px';
      } else {
        scrollHeight = harvestIframe.scrollHeight;
      }
    }, 100);
  }

  if (!harvestIframe && frameDetected) {
    window.close();
    clearInterval(detectFrame);
  }
}, 500);
