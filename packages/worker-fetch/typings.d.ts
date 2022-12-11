declare module '*.json';
declare module '*.glsl';
declare module 'web-worker:*' {
  const WokerFactory: new () => Worker;
  export default WokerFactory;
}

type WithNull<T> = T | null;
type Callback<T> = (error?: Error | null, result?: T | null) => void;
type Cancelable = {
  cancel: () => void;
};
