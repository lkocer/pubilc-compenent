<template>
  <div>
    <div class="checkbox" :id="domId" v-if="showFilter">
      <div class="list" :class="{ 'ant-table-row-cell-draggable': !item.fixed && !item.stickyLeft}" v-for="item in dataList" :key="item.dataIndex">
        <a-checkbox :checked="!item.hidden" @change="(e) => handleChange(e, item)"  v-if="item.dataIndex !== 'action'">
          {{ item.title }}
        </a-checkbox>
      </div>
    </div>
    <div class="btn">
       <a-button
        type="primary"
        size="small"
        :loading="saveLoading"
        style="margin-right:8px"
        @click="() => handleSave()"
      >
        {{ $i18n.t('btn.save') }}
      </a-button>
      <a-button
        size="small"
        :loading="resetLoading"
        @click="() => handleReset()"
      >
        {{ $i18n.t('btn.reset') }}
      </a-button>
    </div>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  const uuid = () => {
    return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0
        var v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  export default {
    name: 'FilterTable',
    props: {
      filterData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      saveSysColSet: {
        type: Function,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        saveLoading: false,
        resetLoading: false,
        showFilter: false,
        systemCode: 'WMS',
        modular: this.$route.name,
        domId: `ant-table-sortablejs-${uuid()}`,
        cloneDataList: [],
        dataList: this.filterData.columns
      }
    },
    watch: {
      filterData: {
        deep: true,
        handler (newV, oldV) {
           this.dataList = newV.columns
        }
      }
    },
    mounted () {
      let that = this
      this.cloneDataList = this.deepClone(this.dataList)
      this.showFilter = true
      this.$nextTick(() => {
        const el = document.getElementById(this.domId)
        const mySortable = new Sortable(el, {
          animation: 150,
          disabled: false,
          draggable: '.ant-table-row-cell-draggable',
          onEnd: (evt) => {
            // 转换真实索引
            const oldColumnIndex = evt.oldIndex
            const newColumnIndex = evt.newIndex
            // 移动到目标列
            const currRow = that.dataList.splice(oldColumnIndex, 1)[0]
            that.dataList.splice(newColumnIndex, 0, currRow)
          }
        })
      })
    },
    methods: {
      handleSaveAjax () {
        return new Promise((resolve, reject) => {
          const data = []
          this.dataList.forEach((res, index) => {
            data.push({
              systemCode: this.systemCode,
              modular: this.modular,
              code: res.dataIndex,
              name: res.title,
              width: res.width,
              hidden: res.hidden ? 1 : 0,
              index: index
            })
          })
          this.saveSysColSet(data).then(res => {
            if (res.code === 0) {
              this.$emit('ok', this.dataList)
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
            resolve(res)
          }).catch((err) => {
            reject(err)
          })
        })
      },
      handleSave () {
        this.saveLoading = true
        this.handleSaveAjax().then(res => {
           this.saveLoading = false
        })
      },
      handleChange (e, item) {
        this.dataList.some((g, i) => {
           if (g.dataIndex === item.dataIndex) {
             const newData = { ...g }
             newData['hidden'] = !e.target.checked
             this.$set(this.dataList, i, newData)
             return g
           }
        })
      },
      handleReset () {
        const deep = this.deepClone(this.cloneDataList)
        const newDataList = [ ...this.dataList ]
        newDataList.map(g => {
          const newData = deep.find(res => res.dataIndex === g.dataIndex)
          const list = this.dataList.findIndex(r => r.dataIndex === newData.dataIndex)
          this.$set(this.dataList[list], 'width', newData.oldWidth ? newData.oldWidth : newData.minWidth)
          this.$set(this.dataList[list], 'hidden', false)
          const currRow = this.dataList.splice(list, 1)[0]
          this.dataList.splice(newData.oldIndex, 0, currRow)
          // g.width = newData.oldWidth || newData.minWidth
          // g.hidden = false
        })
        this.resetLoading = true
        this.handleSaveAjax().then(res => {
           this.resetLoading = false
        })
      },
      deepClone (data) {
        return JSON.parse(JSON.stringify(data, (key, value) => {
          if (typeof value === 'function') {
            return value.toString()
          }
          return value
        }))
      }
    }
  }
</script>

<style lang="less" scoped>
.checkbox{
  overflow: auto;
  height: 200px;
  .list{
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    background: #c1c1c1;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #ededed;
    border-radius: 5px;
  }
}
.btn{
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }
  .handle-dom{
    cursor: grab;
  }
  /deep/ .ant-table-row-cell-draggable .ant-checkbox-wrapper{
    cursor: grab;
  }
</style>