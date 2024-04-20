function main() {
  chrome.webRequest.onBeforeRequest.addListener((details) => {
    const requestUrl = new URL(details.url)
    const currentUrl = new URL(details.initiator || "")
    if (requestUrl.hostname === currentUrl.hostname && requestUrl.href.includes('/api/')) {
      const apiPath = requestUrl.href.split('/api/')[1]
      chrome.tabs.sendMessage(details.tabId, { text: apiPath})
    }
    return {};
  }, { urls: ['<all_urls>'] })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    main()
  }
})