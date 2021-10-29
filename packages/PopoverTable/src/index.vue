<template>
  <div>
    <a-popover v-model="visible" trigger="click" placement="bottomRight">
        <div class="btn-list" slot="content" @click="hidden">
          <slot name="content"></slot>
        </div>
        <a>
          {{ $i18n.t('btn.action') }}
        </a>
    </a-popover>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false
      }
    },
    mounted () {
    },
    methods: {
      hidden () {
        this.visible = false
      }
    }
  }
</script>