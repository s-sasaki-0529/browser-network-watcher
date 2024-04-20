// オーバーレイ表示用のDOMを追加する
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.bottom = '10px';
overlay.style.right = '10px';
overlay.style.backgroundColor = 'white';
overlay.style.border = '1px solid black';
overlay.style.padding = '5px';
overlay.style.zIndex = '1000';
document.body.appendChild(overlay);

// background から受け取っったメッセージを描画する
chrome.runtime.onMessage.addListener((message) => {
  if (message.text) {
    overlay.innerText = message.text;
  }
});