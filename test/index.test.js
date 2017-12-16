describe('indexSpec', function () {
  it('throws an error when creating without new operator', function () {
    expect(function () {
      return WindLayer.appendTo();
    }).to.throwException();
  });
})
