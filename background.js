chrome.webRequest.onBeforeRequest.addListener((details) => {
  const requestUrl = new URL(details.url)
  const currentUrl = new URL(details.initiator || "")
  if (requestUrl.hostname === currentUrl.hostname && requestUrl.href.includes('/api/')) {
    console.log(requestUrl.href.split('/api/')[1])
  }
  return {};
}, { urls: ['<all_urls>'] })