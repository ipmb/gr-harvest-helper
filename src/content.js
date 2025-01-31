console.log('[GR-Time-Tracker]: Content script loaded on', window.location.href);

function GRlog(text) {
  console.log('[GR-Time-Tracker]: ' + text);
}

function detectJira() {
  const appName = document.querySelector('[name=application-name]');
  return appName && appName.content === 'JIRA';
}

function detectZammad() {
  return (
    document && document.getElementsByClassName('ticket-title-update js-objectTitle').length > 0
  );
}

function detectGitlab() {
  return (
    document &&
    document.getElementsByClassName('detail-page-header-actions js-issuable-actions').length > 0
  );
}

function detectGithub() {
  return document && document.getElementsByClassName('markdown-title').length > 0;
}

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
  const issueTitle = await fetch(`${protocol}//${hostname}/rest/api/2/issue/${issueId}`, {
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

function zammadGetIssueTitle() {
  var title = document.getElementsByClassName('ticket-title-update js-objectTitle')[0].textContent;
  return {
    title: title,
  };
}

function gitlabGetIssueTitle() {
  var taskName = document.getElementsByClassName('title qa-title')[0].textContent;
  var taskId = document.getElementsByClassName('breadcrumbs-sub-title')[0].textContent;
  var title = `${taskName} (${taskId})`;
  return {
    id: taskId,
    title: title,
  };
}

function githubGetIssueTitle() {
  const taskNameElement = document.getElementsByClassName('markdown-title')[0];
  const taskName = taskNameElement ? taskNameElement.textContent.trim() : 'No Title';

  const taskId =
    document
      .querySelector('h1[data-component="PH_Title"], h1.gh-header-title')
      ?.querySelector('span')?.textContent || 'No ID';

  const title = `${taskId}: ${taskName}`;

  return {
    id: taskId,
    title: title,
  };
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTaskDetails') {
    if (detectJira()) {
      GRlog('jira detected');
      jiraGetIssueTitle().then((res) => {
        sendResponse(res);
      });
    } else if (detectZammad()) {
      GRlog('zammad detected');
      sendResponse(zammadGetIssueTitle());
    } else if (detectGitlab()) {
      GRlog('gitlab detected');
      sendResponse(gitlabGetIssueTitle());
    } else if (detectGithub()) {
      GRlog('github detected');
      sendResponse(githubGetIssueTitle());
    } else {
      GRlog('No supported platform detected');
      sendResponse(null);
    }
    return true; // Keeps the message channel open for asynchronous response
  }
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('[Content Script]: Received message:', message);

//   if (message.action === 'getTaskDetails') {
//     // Perform logic to retrieve task details
//     const taskDetails = {
//       id: '123', // Example task ID
//       title: 'Example Task Title', // Example task title
//     };
//     console.log('[Content Script]: Sending task details:', taskDetails);
//     sendResponse(taskDetails);
//   } else {
//     console.warn('[Content Script]: Unknown action:', message.action);
//   }

//   // Return true if using asynchronous sendResponse
//   return true;
// });
