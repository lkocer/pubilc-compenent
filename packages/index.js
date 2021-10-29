import TagsView from './Tagsview'
import CollapseSearch from './CollapseSearch'
import FilterTable from './FilterTable'
import PopoverTable from './PopoverTable'
import EditableCell from './EditableCell'
import Editable from './Editable'
import RightToolbar from './RightToolbar'
import SSelect from './SSelect'
import SelectSearch from './SelectSearch'
import STable from './STable'
const version = '1.0.0'

const components = [
  TagsView,
  CollapseSearch,
  FilterTable,
  PopoverTable,
  EditableCell,
  Editable,
  RightToolbar,
  SSelect,
  SelectSearch,
  STable
]

const install = function(Vue){
    components.forEach(component => {
      Vue.component(component.name, component)
    })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export {
  TagsView,
  CollapseSearch,
  FilterTable,
  PopoverTable,
  EditableCell,
  Editable,
  RightToolbar,
  SSelect,
  SelectSearch,
  STable
}

export default {
  version: version,
  install
}