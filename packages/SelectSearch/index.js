import SelectSearch from './src/index.jsx';

SelectSearch.install = function(Vue) {
  Vue.component(SelectSearch.name, SelectSearch);
};

export default SelectSearch;
