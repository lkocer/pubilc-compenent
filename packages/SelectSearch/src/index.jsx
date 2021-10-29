import debounce from 'lodash/debounce'
const SelectSearch = {
  name: 'SelectSearch',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    data: {
      type: Function,
      default: () => {
        return []
      }
    },
    value: {
      type: String,
      default: undefined
    },
    initData: {
      type: Boolean,
      default: true
    },
    initLabel: {
      type: String,
      default: undefined
    },
    defaultData: {
      type: Object,
      default: () => {
        return []
      }
    },
    size: {
      type: String,
      default: 'default'
    },
    mode: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    parKey: {
      type: String,
      default: 'name'
    },
    decorator: {
      type: Array,
      default: () => {
        return []
      }
    },
    allowClear: {
      type: Boolean,
      default: true
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
      type: String,
      default: '100%'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    filterOption: {
      type: Boolean | Function,
      default: false
    },
    focusReload: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      init: null,
      selectData: [],
      fetchUser: null,
      fetching: true,
      spin: true,
      pageNum: 1,
      pageSize: 50
    }
  },
  created () {
    this.loadData = debounce(this.loadData, 400)
  },
  mounted () {
    // this.handleData()
    setTimeout(() => {
      // 如果有默认数据则不请求数据
      if (this.checkDefaultData()) {
        this.selectData.push(...this.defaultData)
      } else if (this.initData) {
        this.handleData(!!this.value)
      }
    }, 1)
  },
  methods: {
    // 校验默认数据是否有效
    checkDefaultData () {
      if (this.defaultData) {
        const newData = this.defaultData.filter(res => res[this.valueKey] && res[this.valueName])
        return newData.length > 0
      } else {
        return false
      }
    },
    // 处理默认数据并且请求之后的数据没有默认数据的内容则加入默认数据到数组
    handleDefaultData (data) {
      if (this.checkDefaultData()) {
        const map = data.map(res => res[this.valueKey])
        const newData = this.defaultData.filter(res => map.indexOf(res[this.valueKey]) === -1)
        if (newData.length > 0) {
          this.selectData.unshift(...newData)
        }
      }
    },
    // 首次获取焦点加载数据 || focusReload
    initDataFun () {
      if (this.init === null || this.focusReload) {
        this.init = true
        this.handleData()
      }
    },
    // 按搜索条件请求数据
    loadData (filters) {
      let parameter = {}
      parameter[this.parKey] = filters
      this.fetching = true
      this.selectData = []
      const result = this.data(Object.assign(parameter, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }))
      result.then(res => {
        if (!filters || filters === '') {
          this.handleDefaultData(res.data)
        }
        this.selectData.push(...res.data)
        this.fetching = false
      })
    },
    // 获取焦点加载数据
    handleData (fetching = false) {
      let parameter = {}
      // 如果是第一次加载并且没有传入默认值则参数带入传入的值
      if (fetching) {
        parameter[this.valueKey] = this.value
      }
      this.fetching = true
      this.selectData = []
      const result = this.data(Object.assign(parameter, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }))
      result.then(res => {
        // 如果是第一次加载并且没有传入默认值则把请求结果加入默认值数组
        if (fetching) {
          this.defaultData.push(res.data)
        }
        this.selectData.push(...res.data)
        this.handleDefaultData(res.data)
        this.fetching = false
      })
    },
    focusValue (e) {
      this.$emit('focus', e)
    },
    setData (e) {
      this.selectData.push(e)
    },
    refresh () {
      setTimeout(() => {
        this.value = undefined
        this.loadData()
      }, 10)
    },
    refreshData (filter = undefined) {
      setTimeout(() => {
        this.loadData(filter)
      }, 10)
    }
  },
  render (createElement) {
    // 改变内容传递change事件
    const changeValue = (e) => {
      const select = this.selectData.filter(res => res[this.valueKey] === e)[0]
      this.$emit('change', e, select)
      if (!e) {
        this.refreshData()
      }
    }
    // loding状态
    const spin = () => {
      if (this.fetching) {
        return (
          <a-spin slot="notFoundContent" size="small" />
        )
      } else {
        return ''
      }
    }
    // 循环下拉内容
    const selectData = () => {
      return (
        this.selectData.map((res, index) => (
          <a-select-option value={res[this.valueKey]} key={this.valueKey}>
            { this.$scopedSlots.html ? createElement(
                'span',
                {
                  attrs: {
                    title: this.$scopedSlots.html(res, index)[0].text
                  }
                },
                this.$scopedSlots.html(res, index)
              ) : createElement(
                'span',
                {
                  attrs: {
                    title: res[this.valueName]
                  }
                },
                res[this.valueName]
              )
            }
          </a-select-option>
        ))
      )
    }
    let selectMenu
    selectMenu = (
      <a-select
        show-search
        style={{ width: this.width }}
        value={this.value}
        decorator={this.decorator}
        onChange={changeValue}
        allowClear={this.allowClear}
        placeholder={this.placeholder}
        default-active-first-option={false}
        show-arrow={true}
        mode={this.mode}
        size={this.size}
        disabled={this.disabled}
        filter-option={this.filterOption}
        onSearch={this.loadData}
        onFocus={this.initDataFun}
        suffixIcon={<a-icon style="font-size: 12px;" type="search" />}
        class="search-class-name-components"
      >
        { spin() }
        { selectData() }
      </a-select>
    )
    return (
      selectMenu
    )
  }
}

export default SelectSearch
