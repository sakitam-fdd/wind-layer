declare module '*.json';
declare module '*.glsl';
declare module 'web-worker:*' {
  const WokerFactory: new () => Worker;
  export default WokerFactory;
}
interface Window {}
