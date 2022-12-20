declare module '*.json';
declare module '*.glsl';
declare module 'web-worker:*' {
  const WokerFactory: new () => Worker;
  export default WokerFactory;
}

type WithNull<T> = T | null;
