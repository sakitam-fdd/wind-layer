let u = '';
export function setWorkerUrl(url: string) {
  u = url;
}

export function getWorkerUrl() {
  return u;
}

let deps: string[] = [];

/**
 * 设置外部依赖的路径
 * 一般我们在使用 importScripts 时需要指定
 * @param d
 */
export function configDeps(d: string[]) {
  deps = d;
}

export function getConfigDeps() {
  return deps;
}
