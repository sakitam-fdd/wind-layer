/* eslint-env es6 */
describe('helperSpec', () => {
  it('getTarget dom', () => {
    const container = document.createElement('div');
    container.id = 'my-test'
    document.body.appendChild(container);
    expect(ol3Echarts.getTarget('#my-test')[0]).to.be.eql(container);
    container.parentNode.removeChild(container);
    expect(ol3Echarts.getTarget('#my-test')[0]).to.be.eql(undefined);
  });

  it('merge object', () => {
    const a = {'a': 1, 'b': 2};
    const b = {'c': 3};
    const c = ol3Echarts.merge(a, b)
    expect(c.c).to.be.eql(3);
  })
})
