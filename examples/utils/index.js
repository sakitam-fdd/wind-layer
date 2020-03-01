export const requireSDK = (jsApi, ak, host, callback) => new Promise(((resolve, reject) => {
  const head = document.head;
  let dom = head.querySelector(`[src*="${host}"]`);
  if (dom) {
    resolve(1);
    return;
  }
  window.HOST_TYPE = '2';
  dom = document.createElement('script');
  dom.type = 'text/javascript';
  dom.src = `${jsApi}&key=${ak}${callback && `&callback=${callback}`}`;
  dom.onerror = reject;
  dom.onload = resolve;
  head.appendChild(dom);
}));
