function GRlog(text) {
  console.log(`[GR-Time-Tracker]: ${text}`);
}

function GRWarn(text) {
  console.warn(`[GR-Time-Tracker]: ${text}`);
}

function GRError(text) {
  console.error(`[GR-Time-Tracker]: ${text}`);
}

let taskName = 'Unknown Task';
let taskId = 'Unknown ID';
let tabURL = '';
let frameDetected = false;

// Clear existing message listeners to prevent duplicates
chrome.runtime.onMessage.removeListener(handleMessage);

// Message listener to process task details
function handleMessage(response) {
  if (response && response.id && response.title) {
    taskId = response.id;
    taskName = response.title;
    GRlog('Message received from content script:', response);
    updateUI();
  } else {
    GRWarn('Invalid message received:', response);
  }
}

// Register the message listener
chrome.runtime.onMessage.addListener(handleMessage);

// Query the active tab and send a message to the content script
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    const activeTab = tabs[0];
    tabURL = activeTab.url;
    GRlog(`Active Tab URL: ${tabURL}`);

    if (
      /^https:\/\/(gitlab\.com|github\.com|.*\.ghe\.com|.*\.atlassian\.net|zammad\.com)/.test(
        tabURL
      )
    ) {
      GRlog('Sending message to content script...');
      chrome.tabs.sendMessage(activeTab.id, { action: 'getTaskDetails' }, (response) => {
        if (chrome.runtime.lastError) {
          GRError('Error communicating with content script:', chrome.runtime.lastError.message);
        } else if (response) {
          GRlog('Response from content script:', response);
          handleMessage(response);
        } else {
          GRWarn('No response from content script.');
        }
      });
    } else {
      GRError('Unsupported URL, content script not loaded.');
    }
  } else {
    GRError('No active tab found.');
  }
});

// Update the popup UI
function updateUI() {
  const harvestTimer = document.querySelector('.harvest-timer');
  if (harvestTimer) {
    harvestTimer.setAttribute('data-item', JSON.stringify({ id: taskId, name: taskName }));
    harvestTimer.setAttribute('data-permalink', tabURL);
    harvestTimer.click();
    GRlog('UI updated with task details.');
  }
}

// Detect and adjust the iframe
function detectAndAdjustIframe() {
  const detectFrame = setInterval(() => {
    const harvestIframe = document.getElementById('harvest-iframe');

    if (harvestIframe && !frameDetected) {
      frameDetected = true;

      harvestIframe.style.top = '10px';

      const harvestOverlay = document.querySelector('.harvest-overlay');
      if (harvestOverlay) {
        harvestOverlay.style.background = 'white';
        harvestOverlay.style.overflow = 'hidden';
      }

      let scrollHeight = 300; // Default height
      setInterval(() => {
        if (
          harvestIframe.scrollHeight !== 300 &&
          harvestIframe.scrollHeight !== 0 &&
          harvestIframe.scrollHeight !== scrollHeight
        ) {
          document.body.style.height = `${harvestIframe.scrollHeight}px`;
          document.body.style.width = '500px';
          scrollHeight = harvestIframe.scrollHeight;
          GRlog(`Popup resized to height: ${scrollHeight}`);
        }
      }, 100);
    }

    if (!harvestIframe && frameDetected) {
      GRlog('Iframe removed, closing popup.');
      window.close();
      clearInterval(detectFrame);
    }
  }, 10);
}

// Call the iframe detection function on load
detectAndAdjustIframe();
