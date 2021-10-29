import collapseSearch from './src/index';

collapseSearch.install = function(Vue) {
  Vue.component(collapseSearch.name, collapseSearch);
};

export default collapseSearch;
