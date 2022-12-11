import { getWorkerUrl } from './config';

export type MessageListener = (a: { data: any; target: any }) => unknown;

// The main thread interface. Provided by Worker in a browser environment,
export interface WorkerInterface {
  addEventListener(type: 'message', listener: MessageListener): void;
  removeEventListener(type: 'message', listener: MessageListener): void;
  postMessage(message: any): void;
  terminate(): void;
}

export default function workerFactory() {
  return new Worker(getWorkerUrl());
}
