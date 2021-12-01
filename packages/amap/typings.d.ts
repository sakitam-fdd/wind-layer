declare module '*.json';

declare module 'AMap' {
  const AmapFactory: new () => any;
  export default AmapFactory;
}

interface Window {}
