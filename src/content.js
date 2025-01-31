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

// Function to retrieve task details for JIRA
async function jiraGetIssueTitle() {
  let issueId;
  const issueIdMatches = document.title.match(/\[(.*?)]/);

  if (issueIdMatches) {
    issueId = issueIdMatches[1];
  } else {
    // fallback to get issue id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    issueId = urlParams.get('selectedIssue');
  }

  if (!issueId) return { id: 'No ID', title: 'Unknown' };

  try {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const issueTitle = await fetch(`${protocol}//${hostname}/rest/api/2/issue/${issueId}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => data.fields.summary);

    return { id: issueId, title: `${issueId}: ${issueTitle}` };
  } catch (error) {
    GRlog(`Error fetching JIRA issue title: ${error.message}`);
    return { id: issueId, title: 'Unknown' };
  }
}

// Function to retrieve task details for Zammad
function zammadGetIssueTitle() {
  const title =
    document.querySelector('.ticket-title-update.js-objectTitle')?.textContent || 'No Title';
  return { id: 'N/A', title };
}

// Function to retrieve task details for GitLab
function gitlabGetIssueTitle() {
  const taskName = document.querySelector('.title.qa-title')?.textContent || 'No Title';
  const taskId = document.querySelector('.breadcrumbs-sub-title')?.textContent || 'No ID';
  return { id: taskId, title: `${taskId}: ${taskName}` };
}

// Function to retrieve task details for GitHub
function githubGetIssueTitle() {
  const taskName = document.querySelector('.markdown-title')?.textContent.trim() || 'No Title';
  const taskId =
    document.querySelector('h1[data-component="PH_Title"], h1.gh-header-title span')?.textContent ||
    'No ID';
  return { id: taskId, title: `${taskId}: ${taskName}` };
}

// Function to retrieve task details based on the detected platform
async function getTaskDetails(platform) {
  try {
    switch (platform) {
      case 'jira':
        return jiraGetIssueTitle();
      case 'zammad':
        return zammadGetIssueTitle();
      case 'gitlab':
        return gitlabGetIssueTitle();
      case 'github':
        return githubGetIssueTitle();
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
