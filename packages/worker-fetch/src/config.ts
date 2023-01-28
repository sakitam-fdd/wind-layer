let u = '';
export function setWorkerUrl(url) {
  u = url;
}

export function getWorkerUrl() {
  return u;
}

let deps = [];

/**
 * 设置外部依赖的路径
 * 一般我们在使用 importScripts 时需要指定
 * @param d
 */
export function configDeps(d) {
  deps = d;
}

export function getConfigDeps() {
  return deps;
}
