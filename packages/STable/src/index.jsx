import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import Sortable from 'sortablejs'
import { Table as T } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import get from 'lodash.get'
import './style.less'
Vue.component('vue-draggable-resizable', VueDraggableResizable)
let hasSticky = (function () {
  let vendorList = ['', '-webkit-', '-ms-', '-moz-', '-o-']
  let vendorListLength = vendorList.length
  let stickyElement = document.createElement('div')
  for (var i = 0; i < vendorListLength; i++) {
      stickyElement.style.position = vendorList[i] + 'sticky'
      if (stickyElement.style.position !== '') {
          return true
      }
  }
  return false
})()
const uuid = () => {
  return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0
      var v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const STable = {
  name: 'STable',
  data () {
    this.componentsSetting = {
      header: {
        cell: (h, props, children) => {
          let resizableDom = null
          let thDom = null
          const { key, ...restProps } = props
          const col = this.columns.find(col => key === col.dataIndex)
          if (!col || !col.dataIndex || col.dataIndex === 'action') {
            return (
              <th {...restProps}>
                {children}
              </th>
            )
          }
          let className = `table-draggable-handle`
          return (
            <th {...restProps} v-ant-ref={r => (thDom = r)} class="ant-resize-table-th" key={col.dataIndex || col.key}>
              {children}
              <div onClick={(event) => { event.stopPropagation() }}>
                <vue-draggable-resizable
                  v-ant-ref={r => (resizableDom = r)}
                  key={col.dataIndex || col.key}
                  class={className}
                  w={10}
                  x={col.width || 0}
                  z={1}
                  axis="x"
                  grid={[10, 10]}
                  maxWidth={400}
                  minWidth={100}
                  draggable={true}
                  resizable={false}
                  // {...{
                  //   attrs: {
                  //     onDragStart: (x, y) => {
                  //       resizableDom.left = thDom.clientWidth
                  //     }
                  //   }
                  // }}
                  onDragging={(x, y) => {
                    let xWidth = x
                    const minWidth = col.minWidth || 120
                    if (xWidth < minWidth) {
                      xWidth = minWidth
                    }
                    if (xWidth > 1500) {
                      xWidth = 1500
                    }
                    col.width = Math.max(xWidth, 1)
                  }}
                  onDragstop={(e) => {
                    resizableDom.left = col.width
                    resizableDom.$el.style.transform = `translate(${col.width}px, 0)`
                  }}
                ></vue-draggable-resizable>
              </div>
            </th>
          )
        }
      }
    }
    return {
      needTotalList: [],
      selectedRows: [],
      selectedRowKeys: [],
      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({
        pageSizeOptions: ['5', '10', '20', '30', '50'],
        size: 'default',
        showTotal: (total) => this.$t('components.pageNumber', [total])
      }, this.pagination),
      sortableUuid: `ant-table-tr-sortable-${uuid()}`
    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    paginationHide: {
      type: Boolean,
      default: false
    },
    checkhideOnSinglePage: {
      type: Boolean,
      default: false
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    bordered: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    // /**
    //  * alert: {
    //  *   show: true,
    //  *   clear: Function
    //  * }
    //  */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    },
    rangPicker: {
      type: Array,
      default: null
    },
    rangePickerObject: {
      type: Object,
      default: () => {
        return {}
      }
    },
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    },
    defaultSort: {
      type: String,
      default: null
    },
    defaultOrder: {
      type: String,
      default: 'desc'
    },
    sticky: {
      type: Boolean,
      default: false
    },
    draggableTable: {
      type: Boolean,
      default: true
    },
    sortableCell: {
      type: Boolean,
      default: true
    }
  }),
  computed: {
    ...mapGetters(['tableRefresh']),
    getLang () {
      return this.$store.getters.lang
    }
  },
  watch: {
    'tableRefresh' () {
      this.refresh()
    },
    // ?????????
    getLang () {
      setTimeout(() => {
        this.$props.columns = this.initI18nList(this.columns)
      }, 10)
    },
    'localPagination.current' (val) {
      this.pageURI && this.$router.push({
        ...this.$route,
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageNo: val
        })
      })
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns)
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize (val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  created () {
    const { pageNo } = this.$route.params
    const localPageNum = this.pageURI && (pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger
    }) || false
    this.needTotalList = this.initTotalList(this.columns)
    this.$props.columns = this.initI18nList(this.columns)
    // ??????????????????
    this.$store.commit('SET_SYSCOLLIST', {
      key: this.$route.name,
      data: [...this.columns]
    })
    this.loadData()
  },
  mounted () {
    const that = this
    const el = document.getElementById(this.sortableUuid)
    setTimeout(() => {
      const mySortable = new Sortable(el, {
        group: this.sortableUuid,
        animation: 150,
        dataIdAttr: 'data-id',
        draggable: '.ant-table-row-cell-draggable',
        handle: '.ant-table-header-column',
        disabled: false,
        onEnd: (evt) => {
          // ???????????????
          const filter = that.columns.filter(res => !res.hidden || res.hidden === false)
          // ??????????????????
          let num = 0
          if (this.rowSelection) {
            num = 1
          }
          // ?????????????????????index
          const oldColumnIndex = that.columns.findIndex(res => res.dataIndex === filter[evt.oldIndex - num].dataIndex)
          const newColumnIndex = that.columns.findIndex(res => res.dataIndex === filter[evt.newIndex - num].dataIndex)
          // ??????????????????
          const currRow = that.columns.splice(oldColumnIndex, 1)[0]
          that.columns.splice(newColumnIndex, 0, currRow)
        }
      })
    }, 1000)
  },
  methods: {
    /**
     * ????????????????????????
     * ??????????????? true, ???????????????????????????
     * @param Boolean bool
     */
    refresh (bool = false) {
      bool && (this.localPagination = Object.assign({}, {
        current: 1, pageSize: this.pageSize
      }))
      setTimeout(() => {
        this.loadData()
      }, 10)
    },
    /**
     * ??????????????????
     * @param {Object} pagination ???????????????
     * @param {Object} filters ????????????
     * @param {Object} sorter ????????????
     */
    loadData (pagination, filters, sorter) {
      // ??????????????????
      if (this.localLoading) {
        return false
      }
      this.localLoading = true
      // console.log('rangPicker', this.rangPicker)
      const parameter = Object.assign({
        pageNum: (pagination && pagination.current) ||
          this.showPagination && this.localPagination.current || this.pageNum,
        pageSize: (pagination && pagination.pageSize) ||
          this.showPagination && this.localPagination.pageSize || this.pageSize
      },
      (this.rangPicker && this.rangPicker.length === 2 && {
        beginTime: this.rangPicker[0].format('YYYY-MM-DD'),
        endTime: this.rangPicker[1].format('YYYY-MM-DD')
      }) || {},
      (sorter && sorter.field && {
        sortField: sorter.field
      }) || (this.defaultSort && this.defaultSort.length > 0 && { sortField: this.defaultSort }) || {},
      (sorter && sorter.order && {
        sortOrder: sorter.order.replace('end', '')
      }) || (this.defaultSort && this.defaultSort.length > 0 && { sortOrder: this.defaultOrder }) || {},
      {
        ...filters
      }
      )
      Object.keys(this.rangePickerObject).forEach((x) => {
        if (typeof this.rangePickerObject[x] === 'string') {
          parameter[x] = this.rangePickerObject[x]
        }
      })
      const result = this.data(parameter)
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then((r) => {
          if (r.code === 0) {
            this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
              current: r.pageNum, // ?????????????????????????????????
              total: r.total, // ??????????????????????????????
              showSizeChanger: this.showSizeChanger,
              pageSize: (pagination && pagination.pageSize) ||
                this.localPagination.pageSize
            }) || false
            // ??????????????????????????????????????????????????????????????? 0 ,????????????????????????
            if (r.data.length === 0 && this.showPagination && this.localPagination.current > 1) {
              this.localPagination.current--
              this.loadData()
              return
            }
            // console.log('localPagination', this.localPagination)
            // ??????????????????????????????????????? r.totalCount ??? this.showPagination = true ??? pageNo ??? pageSize ?????? ??? totalCount ???????????? pageNo * pageSize ?????????
            // ??????????????????????????????????????????????????????????????? table ????????????
            if (this.checkhideOnSinglePage) {
              try {
                if ((['auto', true].includes(this.showPagination) && r.total <= (r.pageNum * this.localPagination.pageSize))) {
                  this.localPagination.hideOnSinglePage = true
                }
              } catch (e) {
                this.localPagination = false
              }
            }
            if (this.paginationHide) {
              this.localPagination = false
            }
            this.localDataSource = r.data // ??????????????????????????????
          } else {
            this.$message.error(r.msg)
            this.localDataSource = []
          }
          this.localLoading = false
        }).catch(err => {
          console.log(err)
          this.localLoading = false
        }).finally(() => {
          this.localLoading = false
        })
      }
    },
    initTotalList (columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    // ?????????
    initI18nList (columns) {
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.i18n) {
          column.title = this.$i18n.t(column.i18n)
        }
      })
      return columns
    },
    /**
     * ???????????????????????????????????? total ??????
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * ?????? table ????????????
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * ???????????? table ?????????????????? clear ??????????????????????????????????????????
     * @param callback
     * @returns {*}
     */
    renderClear (callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          this.clearSelected()
        }}>??????</a>
      )
    },
    renderAlert () {
      // ?????????????????????
      const needTotalItems = this.needTotalList.map((item) => {
        return (<span style="margin-right: 12px">
          {item.title}?????? <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
        </span>)
      })

      // ?????? ?????? ??????
      const clearItem = (typeof this.alert.clear === 'boolean' && this.alert.clear) ? (
        this.renderClear(this.clearSelected)
      ) : (this.alert !== null && typeof this.alert.clear === 'function') ? (
        this.renderClear(this.alert.clear)
      ) : null

      // ?????? alert ??????
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">?????????: <a style="font-weight: 600">{this.selectedRows.length}</a></span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    },
    edithandleChange (value, record, col) {
      const newData = [...this.localDataSource]
      const target = newData.filter(item => record.id === item.id)[0]
      if (target) {
        target[col] = value
        this.localDataSource = newData
      }
    },
    // ???????????????CLASS
    getRowClassName (columns) {
      return (record, index) => {
        let className = ''
        className = index % 2 === 0 ? 'ant-table-tr-oddRow' : 'ant-table-tr-evenRow'
        return className
      }
    },
    // ?????????????????????CLASS
    getCustomHeaderRow () {
      return (record, index) => {
        return {
          attrs: {
            id: this.sortableUuid
          }
        }
      }
    },
    // ?????????????????????class
    getCustomCell (type) {
      return (record, index) => {
        const par = {
          left: {
            'ant-table-td-sticky-left': true
          },
          right: {
            'ant-table-td-sticky-right': true
          }
        }
        return {
          class: par[type]
        }
      }
    },
    // ????????????????????????class
    getCustomHeaderCell (type) {
      return (record) => {
        return {
          className: `ant-table-th-sticky-${type} ant-table-th-action`
        }
      }
    },
    // ????????????class
    handleTableWapClass (data) {
      const classFilter = data.filter(res => res.stickyLeft)
      let className = ''
      if (this.localDataSource.length === 0) {
        className = 'table-wrapper flex-none'
      } else {
        className = 'table-wrapper'
      }
      if (classFilter.length > 0 && this.sticky && hasSticky) {
        className += ' ant-table-selection-sticky'
      }
      return className
    },
    setComponents () {
       return this.draggableTable ? this.componentsSetting : '-'
    }
  },
  render (h) {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert
    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      // ??????????????????
      if (k === 'columns') {
        const filter = this[k].filter(res => !res.hidden || res.hidden === false)
        filter.map((g, index) => {
          // ????????????draggableTable????????????????????????
          if (this.draggableTable) {
            if (!g.width || typeof g.width !== 'number') {
              Vue.set(g, 'width', 120)
              g.minWidth = 120
            } else if (!g.minWidth) {
              g.minWidth = g.width * 1
            }
          }
          if (!g.oldIndex && g.oldIndex !== 0) {
            Vue.set(g, 'oldIndex', index)
          }
          // ?????????sticky??????????????????????????????class
          if (this.sticky && hasSticky) {
            if (g.fixed) {
              g.customCell = this.getCustomCell(g.fixed)
              g.customHeaderCell = this.getCustomHeaderCell(g.fixed)
              g.fixedTag = g.fixed
              if (g.fixed === 'left') {
                g['stickyLeft'] = true
              }
              delete g.fixed
            }
          }

          // ?????????sortable?????????????????????????????????????????????class
          if (this.sortableCell && !g.fixedTag && !g.fixed) {
            g.customHeaderCell = (record, index) => {
              return {
                class: {
                  'ant-table-row-cell-draggable': true
                }
              }
            }
          }
        })
        props[k] = filter
        return props[k]
      }
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (this[k] && !this[k]['columnWidth']) {
          this[k]['columnWidth'] = 35
        }
        if (showAlert && this.rowSelection) {
          // ??????????????????alert?????????????????? rowSelection ??????
          // console.log('this.rowSelection', this.rowSelection)
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // ????????????????????? rowSelection ???????????????????????????
          props[k] = null
          return props[k]
        }
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    // slot??????
    let tooltipEllipsis = {
      tooltipEllipsis: (text, record, index, params) => {
        return (
          <a-tooltip
            overlayClassName="tooltip-Ellipsis"
            placement="topLeft"
            title={text}
            mouseEnterDelay={0.6}
          >
            {text}
          </a-tooltip>
        )
      },
      slotRender: (text, record, index, params) => {
        return (
          params.customRenderHtml ? params.customRenderHtml(record, h) : text
        )
      },
      tooltipsRender: (text, record, index, params) => {
        return (
          <a-tooltip
            overlayClassName="tooltip-Ellipsis"
            placement="topLeft"
            title={params.customRenderHtml ? params.customRenderHtml(record, h) : text}
            mouseEnterDelay={0.6}
          >
            {params.customRenderHtml ? params.customRenderHtml(record, h) : text}
          </a-tooltip>
        )
      }
    }
    // ??????scopedSlots
    this.$scopedSlots = Object.assign(this.$scopedSlots, tooltipEllipsis)
    const table = (
      <a-table
        ref="antTable"
        class="height-warp-table"
        {...{ props, scopedSlots: { ...this.$scopedSlots } }}
        onChange={this.loadData}
        components={this.setComponents()}
        rowClassName={this.getRowClassName(props['columns'])}
        customHeaderRow={this.getCustomHeaderRow()}
        onExpand={ (expanded, record) => { this.$emit('expand', expanded, record) }}
      >
        { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
      </a-table>
    )

    return (
      <div class={this.handleTableWapClass(props['columns'])}>
        { table }
      </div>
    )
  }
}

export default STable