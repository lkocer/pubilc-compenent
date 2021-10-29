const SSelect = {
  name: 'SSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: String,
      default: undefined
    },
    decorator: {
      type: Array,
      default: () => {
        return []
      }
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    valueName: {
      type: String,
      default: 'name'
    },
    width: {
      type: Number,
      default: 100
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data () {
    return {
      selectData: []
    }
  },
  created () {
  },
  methods: {
    loadData (filters) {
      let parameter = {}
      const result = this.data(parameter)
      result.then(res => {
        this.selectData = res
      })
    }
  },
  render () {
    const changeValue = (e) => {
      this.$emit('change', e)
    }
    let selectMenu
    selectMenu = (
      <a-select style={{ width: this.width + 'px' }} value={this.value} decorator={this.decorator} onChange={changeValue} allowClear={this.allowClear} placeholder={this.placeholder}>
        {this.data.map(res => (
          <a-select-option value={res[this.valueKey]}>
            { res[this.valueName] }
          </a-select-option>
        ))}
      </a-select>
    )
    return (
      <div class="table-wrapper">
        { selectMenu }
      </div>
    )
  }
}

export default SSelect
