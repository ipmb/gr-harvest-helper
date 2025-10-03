function GRlog(text) {
  console.log(`[GR-Time-Tracker]: ${text}`);
}

// Function to detect the platform based on the DOM
function detectPlatform() {
  if (document.querySelector('[name=application-name]')?.content === 'JIRA') return 'jira';
  if (document.querySelector('.ticket-title-update.js-objectTitle')) return 'zammad';
  if (document.querySelector('.title.gl-heading-1')) return 'gitlab';
  if (document.querySelector('.markdown-title')) return 'github';
  return null;
}

// Function to retrieve task details for JIRA
async function jiraGetIssueTitle() {
  let issueId;
  let issueIdMatches = document.title.match(/\[(.*?)]/);

  if (issueIdMatches) {
    issueId = issueIdMatches[1];
  } else {
    // fallback to get issue id from the url
    const urlParams = new URLSearchParams(window.location.search);
    issueId = urlParams.get('selectedIssue');
  }

  if (!issueId) return '';

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const issueTitle = await fetch(protocol + '//' + hostname + '/rest/api/2/issue/' + issueId, {
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.fields.summary;
    });
  return {
    id: issueId,
    title: `${issueId}: ${issueTitle}`,
  };
}

// Function to retrieve task details for Zammad
function zammadGetIssueTitle() {
  const title =
    document.getElementsByClassName('ticket-title-update js-objectTitle')[0].textContent ||
    'No Title';
  return { title };
}

// Function to retrieve task details for GitLab
function gitlabGetIssueTitle() {
  const taskName =
    document.getElementsByClassName('title gl-heading-1')[0]?.textContent || 'No Title';
  const taskId =
    document
      .querySelector('.gl-breadcrumbs .gl-breadcrumb-item:last-child a span')
      ?.textContent.trim() || 'No ID';
  return { id: taskId, title: `${taskId}: ${taskName}` };
}

// Function to retrieve task details for GitHub
function githubGetIssueTitle() {
  const taskName = document.querySelector('.markdown-title')?.textContent.trim() || 'No Title';
  const taskId =
    document.querySelector('.HeaderViewer-module__issueNumberText--ofQHQ')?.textContent ||
    document
      .querySelector('h1[data-component="PH_Title"], h1.gh-header-title')
      ?.querySelector('span')?.textContent ||
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
      GRlog(`Detected platform: ${platform}`);
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
