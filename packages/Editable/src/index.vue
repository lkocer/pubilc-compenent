<template>
    <div class="editable-cell">
      <div v-if="editable" class="editable-cell-input-wrapper">
        <template  v-if="type === 'input'">
          <a-input
            ref="checkinput"
            v-model="myValue"
            size="small"
            @change="handleChange"
            @blur="check"
            @pressEnter="check"
          />
          <!-- <a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          /> -->
        </template>
        <template v-if="type === 'number'">
          <a-input-number
            size="small"
            ref="checkinput"
            v-model="myValue"
            :max="maxNum"
            :min="minNum"
            @change="handleChangeNumber"
            @blur="check"
            @pressEnter="check"
          />
          <!-- <a-input-number
            v-else
            size="small"
            ref="checkinput"
            v-model="value"
            :max="99999999999"
            :min="0"
            @change="handleChangeNumber"
            @blur="check"
            @pressEnter="check"
          /> -->
          <!-- <a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          /> -->
        </template>
      </div>
      <div v-else class="editable-cell-text-wrapper">
        <slot>{{ value || ' ' }}</slot>
        <a-icon type="edit" class="editable-cell-icon" @click="edit" />
      </div>
    </div>
</template>

<script>
  import throttle from 'lodash/throttle'
  export default {
    props: {
      type: {
        type: String,
        default: 'input'
      },
      value: {
        type: String,
        default: ''
      },
      max: {
        type: Number,
        default: 99999999999
      },
      min: {
        type: Number,
        default: -99999999999
      }
    },
    data () {
      return {
        myValue: this.value,
        maxNum: 99999999999,
        minNum: -99999999999,
        editable: false
      }
    },
    watch: {
      value (newValue) {
        this.myValue = newValue
      },
      myValue (newValue) {
        this.$emit('input', newValue)
      }
    },
    created () {
      this.check = throttle(this.check, 1000, { 'trailing': false })
    },
    mounted () {
      this.maxNum = this.max
      this.minNum = this.min
      // if (this.max !== '' && this.min !== '') {
      //   this.showProps = true
      // }
    },
    methods: {
      handleChange (e) {
        const value = e.target.value
        this.myValue = value
      },
      handleChangeNumber (e) {
        const value = e
        this.myValue = value
      },
      check () {
        this.editable = false
        this.$emit('change', this.myValue)
      },
      edit () {
        this.editable = true
        this.$nextTick(() => {
          this.$refs.checkinput.focus()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
/deep/ .ant-input-number-sm{
 height: 22px;
 input{
   line-height: 22px;
 }
}
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 0 24px 0 0;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  // display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>