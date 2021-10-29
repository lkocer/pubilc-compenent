import SSelect from './src/index.jsx';

SSelect.install = function(Vue) {
  Vue.component(SSelect.name, SSelect);
};

export default SSelect;
