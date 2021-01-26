<template>
  <div class="copy-to-clipboard">
    <Tooltip
      v-bind="attrs"
      v-on="listeners"
    >
      <span
        v-clipboard:copy="clipboard.value"
        v-clipboard:success="handleCopySuccess"
        v-clipboard:error="handleCopyError"
        class="cursor-pointer"
      >
        <e-icon icon-type="element-ui" icon="el-icon-copy-document"></e-icon>
        <slot></slot>
      </span>
    </Tooltip>
  </div>
</template>

<script>
  export default {
    name: 'CopyToClipboard',
    props: {
      value: {
        type: String,
        required: true,
        default: ''
      },
      tooltip: {
        type: String,
        default: '点击复制'
      },
      successHandler: {
        type: Function,
        default: null
      },
      errorHandler: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        clipboard: {
          value: '',
          tooltip: '点击复制',
          msg: {
            success: '复制成功',
            error: '复制失败，请手动复制'
          }
        }
      }
    },
    computed: {
      attrs () {
        return Object.assign(
          {},
          {
            content: this.clipboard.tooltip,
            placement: 'right'
          },
          this.$attrs
        )
      },
      listeners () {
        return Object.assign(
          {},
          this.$listeners,
          {
            'on-popper-show': _ => {
              this.clipboard.tooltip = this.tooltip
            }
          }
        )
      }
    },
    watch: {
      value: {
        handler (newValue) {
          this.clipboard.value = newValue
        },
        immediate: true
      },
      tooltip (newValue) {
        this.clipboard.tooltip = newValue
      }
    },
    methods: {
      handleCopySuccess () {
        this.successHandler && this.successHandler()
        this.clipboard.tooltip = this.clipboard.msg.success
        this.$emit('copy-success')
        this.$emit('copySuccess')
      },
      handleCopyError () {
        this.errorHandler && this.errorHandler()
        this.clipboard.tooltip = this.clipboard.msg.error
        this.$emit('copy-error')
        this.$emit('copyError')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .copy-to-clipboard {
    display: inline-block;
    margin-left: 5px;
  }
</style>
