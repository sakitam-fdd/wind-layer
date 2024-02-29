/* eslint-disable */

var shared, worker, wgw;
function define(_, chunk) {
  if (!shared) {
    shared = chunk;
  } else if (!worker) {
    worker = chunk;
  } else {
    var workerBundleString = 'var sharedChunk = {}; (' + shared + ')(undefined, sharedChunk); (' + worker + ')(sharedChunk);'

    var sharedChunk = {};
    shared(undefined, sharedChunk);
    wgw = chunk(sharedChunk);
    if (typeof window !== 'undefined') {
      wgw.setWorkerUrl(window.URL.createObjectURL(new Blob([workerBundleString], { type: 'text/javascript' })));
    }
  }
}
