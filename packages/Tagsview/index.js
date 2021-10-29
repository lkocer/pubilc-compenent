import TagsView from './src/index';

TagsView.install = function(Vue) {
  Vue.component(TagsView.name, TagsView);
};

export default TagsView;
