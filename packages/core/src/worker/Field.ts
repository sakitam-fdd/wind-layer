
const ctx: Worker = self as any;

ctx.addEventListener('message', async ({ data: payload }) => {
  ctx.postMessage({
    data: [],
    status: 'success',
  });
});
