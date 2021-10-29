import EditableCell from './src/index';

EditableCell.install = function(Vue) {
  Vue.component(EditableCell.name, EditableCell);
};

export default EditableCell;
