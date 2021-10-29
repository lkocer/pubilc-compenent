import STable from './src/index.jsx';

STable.install = function(Vue) {
  Vue.component(STable.name, STable);
};

export default STable;
