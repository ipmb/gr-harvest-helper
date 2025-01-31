function GRlog(text) {
  console.log(`[GR-Time-Tracker]: ${text}`);
}

function detectPlatform() {
  if (document.querySelector('[name=application-name]')?.content === 'JIRA') return 'jira';
  if (document.querySelector('.ticket-title-update.js-objectTitle')) return 'zammad';
  if (document.querySelector('.detail-page-header-actions.js-issuable-actions')) return 'gitlab';
  if (document.querySelector('.markdown-title')) return 'github';
  return null;
}

async function getTaskDetails(platform) {
  switch (platform) {
    case 'jira':
      const issueId = new URLSearchParams(window.location.search).get('selectedIssue');
      const issueTitle = document.title.match(/\[(.*?)]/)?.[1] || 'Unknown';
      return { id: issueId, title: issueTitle };

    case 'zammad':
      const zammadTitle = document.querySelector('.ticket-title-update.js-objectTitle').textContent;
      return { id: 'N/A', title: zammadTitle };

    case 'gitlab':
      const gitlabTitle = document.querySelector('.title.qa-title').textContent;
      const gitlabId = document.querySelector('.breadcrumbs-sub-title').textContent;
      return { id: gitlabId, title: `${gitlabId}: ${gitlabTitle}` };

    case 'github':
      const githubTitle =
        document.querySelector('.markdown-title')?.textContent.trim() || 'No Title';
      const githubId = document.querySelector('h1 .gh-header-number')?.textContent || 'No ID';
      return { id: githubId, title: githubTitle };

    default:
      return null;
  }
}

const platform = detectPlatform();
if (platform) {
  GRlog(`${platform} detected`);
  getTaskDetails(platform).then((taskDetails) => {
    chrome.runtime.sendMessage(taskDetails);
  });
} else {
  GRlog('No supported platform detected');
}
