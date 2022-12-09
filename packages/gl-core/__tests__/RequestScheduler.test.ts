import { test, expect, describe } from 'vitest';
import RequestScheduler from '../src/utils/RequestScheduler';

describe('utils', async () => {
  test('constructor', () => {
    const requestScheduler = new RequestScheduler();
    expect(requestScheduler).toBeInstanceOf(RequestScheduler);
  });

  test('toThrowError', async () => {
    const requestScheduler = new RequestScheduler({ maxRequests: 1 });
    expect(requestScheduler).toBeInstanceOf(RequestScheduler);

    let requestToken = await requestScheduler.scheduleRequest({ id: 1 });
    expect(requestToken).toBeDefined();
    if (requestToken) {
      expect(requestScheduler.activeRequestCount).toEqual(1);
      requestToken.done();
      expect(requestScheduler.activeRequestCount).toEqual(0);

      requestToken.done();
      expect(requestScheduler.activeRequestCount).toEqual(0);

      requestToken = await requestScheduler.scheduleRequest({ id: 2 }, () => -1);
      expect(requestToken).toBeNull();
      expect(requestScheduler.activeRequestCount).toEqual(0);
    }

    // The following test checks that request#4 is only issued AFTER request#3 is resolved
    // By modifying request#4's priority during request#3
    let priority4 = 0;
    const request3 = async () => {
      priority4 = -1;
    };

    const result = await Promise.all([
      requestScheduler.scheduleRequest({ id: 3 }).then(async (reqToken: { done: () => void }) => {
        expect(requestScheduler.activeRequestCount).toEqual(1);
        await request3();
        if (reqToken) {
          reqToken.done();
        }
        expect(requestScheduler.activeRequestCount).toEqual(0);
      }),
      // priority callback should be called after the previous one is fully resolved
      requestScheduler.scheduleRequest({ id: 4 }, () => priority4),
    ]);

    expect(result[1]).toBeNull();
    expect(requestScheduler.activeRequestCount).toEqual(0);
  });
});
