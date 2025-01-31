function GRlog(text) {
  console.log(`[GR-Time-Tracker]: ${text}`);
}

// Function to detect the platform based on the DOM
function detectPlatform() {
  if (document.querySelector('[name=application-name]')?.content === 'JIRA') return 'jira';
  if (document.querySelector('.ticket-title-update.js-objectTitle')) return 'zammad';
  if (document.querySelector('.detail-page-header-actions.js-issuable-actions')) return 'gitlab';
  if (document.querySelector('.markdown-title')) return 'github';
  return null;
}

// Function to retrieve task details based on the detected platform
async function getTaskDetails(platform) {
  try {
    switch (platform) {
      case 'jira': {
        const issueId = new URLSearchParams(window.location.search).get('selectedIssue');
        const issueTitle = document.title.match(/\[(.*?)]/)?.[1] || 'Unknown';
        return { id: issueId, title: issueTitle };
      }

      case 'zammad': {
        const zammadTitle = document.querySelector('.ticket-title-update.js-objectTitle')
          .textContent;
        return { id: 'N/A', title: zammadTitle };
      }

      case 'gitlab': {
        const gitlabTitle = document.querySelector('.title.qa-title').textContent;
        const gitlabId = document.querySelector('.breadcrumbs-sub-title').textContent;
        return { id: gitlabId, title: `${gitlabId}: ${gitlabTitle}` };
      }

      case 'github': {
        const githubTitle =
          document.querySelector('.markdown-title')?.textContent.trim() || 'No Title';
        const githubId = document.querySelector('h1 .gh-header-number')?.textContent || 'No ID';
        return { id: githubId, title: githubTitle };
      }

      default:
        return null;
    }
  } catch (error) {
    GRlog(`Error retrieving task details for platform "${platform}": ${error.message}`);
    return null;
  }
}

// Listener to handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTaskDetails') {
    const platform = detectPlatform();
    if (platform) {
      getTaskDetails(platform).then((details) => {
        if (details) {
          GRlog(`Sending task details: ${JSON.stringify(details)}`);
          sendResponse(details);
        } else {
          GRlog('Failed to retrieve task details.');
          sendResponse(null);
        }
      });
    } else {
      GRlog('No supported platform detected.');
      sendResponse(null);
    }
    return true; // Keep the message channel open for asynchronous `sendResponse`
  }
});

// Auto-detect and send task details when the content script is loaded
const platform = detectPlatform();
if (platform) {
  GRlog(`${platform} detected`);
  getTaskDetails(platform).then((taskDetails) => {
    if (taskDetails) {
      chrome.runtime.sendMessage(taskDetails);
      GRlog(`Task details sent: ${JSON.stringify(taskDetails)}`);
    } else {
      GRlog('Failed to retrieve task details automatically.');
    }
  });
} else {
  GRlog('No supported platform detected on initial load.');
}
