chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in content script:', message);

    if (message.taskName) {
      // Perform DOM manipulations here
      const harvestTimer = document.querySelector('.harvest-timer');
      if (harvestTimer) {
        harvestTimer.setAttribute('data-item', JSON.stringify({ id: message.id, name: message.taskName }));
        if (message.tabURL) {
          harvestTimer.setAttribute('data-permalink', message.tabURL);
        }
        harvestTimer.click();
        sendResponse({ status: 'DOM updated successfully' });
      } else {
        console.warn('Harvest timer element not found.');
        sendResponse({ status: 'Harvest timer not found' });
      }
    } else {
      sendResponse({ status: 'No task name provided' });
    }

    // Return true to indicate async response
    return true;
  });
