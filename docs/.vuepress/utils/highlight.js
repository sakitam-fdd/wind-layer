import highlight from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';
let Highlight = {};
Highlight.install = function (Vue, options) {
  Vue.directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
      highlight.highlightBlock(block)
    })
  })
};

export default Highlight;
