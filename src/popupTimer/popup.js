// Config object
const harvestPlatformConfig = {
  applicationName: 'UnoficialTimeTrackerExtension',
  skipStyling: true,
};

let taskName;
let tabURL;
let tab;
let id;

// Handle messages received in the service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in service worker:', message);

  if (message.id && message.title) {
    taskName = message.title;
    id = message.id;

    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { taskName, id, tabURL }, (response) => {
          console.log('Response from content script:', response);
        });
      }
    });
  }

  sendResponse({ status: 'Message processed in service worker' });
  return true;
});

// Query the active tab and inject the script
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab && /^https?:/.test(tab.url)) {
    chrome.tabs.sendMessage(tab.id, { taskName, id, tabURL }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to content script:', chrome.runtime.lastError.message);
      } else {
        console.log('Response from content script:', response);
      }
    });
  } else {
    console.error('No valid tab or unsupported tab URL.');
  }
});

// Simulate a timer and periodically check for conditions
let i = 0;
const timeout = 2000; // 2 seconds
const intervalTime = 10;

const taskNameInterval = setInterval(() => {
  if (taskName !== undefined || i === timeout / intervalTime) {
    clearInterval(taskNameInterval);

    const item = { id: id, name: taskName };
    console.log('Processed item:', item);

    // Perform additional logic if necessary
    if (taskName !== undefined) {
      console.log(`Task Name: ${taskName}, Tab URL: ${tabURL}`);
    }
  } else {
    i++;
  }
}, intervalTime);

// Detect and handle a frame (mocked functionality)
let frameDetected = false;

const detectFrame = setInterval(() => {
  // Replace frame detection logic with placeholder logic
  if (!frameDetected) {
    frameDetected = true;

    console.log('Frame detected and processed.');

    let scrollHeight = 300;
    setInterval(() => {
      const newScrollHeight = Math.random() * 500 + 100; // Simulated frame logic
      if (newScrollHeight !== scrollHeight) {
        scrollHeight = newScrollHeight;
        console.log(`Scroll height updated to: ${scrollHeight}`);
      }
    }, 100);
  }

  if (!frameDetected) {
    clearInterval(detectFrame);
    console.log('Frame detection ended.');
  }
}, 10);
