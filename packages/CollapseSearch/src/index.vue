<template>
  <div class="collapse-icon-wrapper-outer">
    <!-- <div class="collapse-icon-wrapper" :class="{'collapse-icon-wrapper-open':show}" @click="openClick">
      <div id="open-font-wrapper">{{ font }}</div>
      <a-icon class="icon" type="double-left" />
    </div> -->
    <div class="collapse-box-all">
      <div class="collapse-box-wrapper" :style="{'maxHeight': maxHeightFun}">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'collapseSearch',
    props: {
      height: {
        type: Number,
        default: 75
      }
    },
    data () {
      return {
        show: false,
        font: '展开',
        maxHeight: 32
      }
    },
    computed: {
      maxHeightFun () {
        return this.maxHeight + 'px'
      }
    },
    methods: {
      init () {
        this.show = false
        this.maxHeight = 32
        this.font = '展开'
      },
      reset () {
        this.show = false
        this.maxHeight = 32
        this.font = '展开'
        this.$emit('onChange', this.show)
      },
      openClick () {
        if (this.show) {
          this.show = false
          this.maxHeight = 32
          this.font = '展开'
        } else {
          this.show = true
          this.maxHeight = this.height
          this.font = '收起'
        }
        this.$emit('onChange', this.show)
      }
    }
  }
</script>

<style lang="less" scoped>
.collapse-box-wrapper{
 margin-bottom: 10px !important;
//  transition: all 0.1s;
 position: relative;
 overflow: hidden;
}

.collapse-icon-wrapper{
  position: absolute;
  bottom: -12px;
  right: -20px;
  z-index: 2;
  cursor: pointer;
  color: #1890ff;
  #open-font-wrapper{
    width: 10px;
    line-height: 16px;
  }
  .icon{
    transform:rotate(-90deg)
  }
  &.collapse-icon-wrapper-open{
    .icon{
      transform:rotate(90deg)
    }
  }
}
</style>