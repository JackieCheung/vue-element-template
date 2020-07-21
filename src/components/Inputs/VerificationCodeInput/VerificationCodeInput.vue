<template>
  <div class="verification-code-input">
    <el-input
      v-model="code"
      class="mr-15"
      v-bind="attrs"
      v-on="listeners">
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
      <template #prepend>
        <slot name="prepend"></slot>
      </template>
      <template #append>
        <slot name="append"></slot>
      </template>
    </el-input>
    <el-button
      :disabled="btnDisabled || countdown > 0"
      :loading="btnLoading"
      :size="attrs.size || 'medium'"
      :style="{ minWidth: '112px', maxHeight: attrs.size === 'large' ? '40px' : '36px' }"
      @click="handleClick">
      <span v-if="btnLoading">发送中</span>
      <span v-else-if="countdown <= 0">获取验证码</span>
      <span v-else>{{ countdown }}秒后重试</span>
    </el-button>
  </div>
</template>

<script>
  export default {
    name: 'VerificationCodeInput',
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      value: {
        type: String,
        required: true
      },
      // 间隔秒数
      intervalSeconds: {
        type: Number,
        default: 60
      },
      // 按钮可用状态
      btnEnabled: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        code: '',
        countdown: 0,
        timer: null,
        btnDisabled: false,
        btnLoading: false
      }
    },
    computed: {
      attrs () {
        return Object.assign(
          {},
          {
            clearable: true,
            'maxlength': 6,
            placeholder: '请输入您收到的短信验证码',
            'show-word-limit': true,
            size: 'medium'
          },
          this.$attrs
        )
      },
      listeners () {
        return Object.assign(
          {},
          this.$listeners,
          {
            input: value => {
              this.$emit('input', value)
            },
            change: value => {
              this.$emit('change', value)
            }
          }
        )
      }
    },
    watch: {
      btnEnabled: {
        handler (newValue) {
          this.btnDisabled = !newValue
        },
        immediate: true
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      // 点击回调
      handleClick () {
        if (!this.btnDisabled && !this.btnLoading) {
          this.btnLoading = true
          this.$emit('click', () => {
            this.btnLoading = false
            this.btnDisabled = true
            this.countdown = this.intervalSeconds
            this.timer = setInterval(() => {
              this.countdown--
              if (this.countdown <= 0) {
                clearInterval(this.timer)
                this.timer = null
                this.btnDisabled = !this.btnEnabled
              }
            }, 1000)
          }, () => {
            this.clearTimer()
          })
        }
      },
      // 清除计时器
      clearTimer () {
        this.countdown = 0
        clearInterval(this.timer)
        this.timer = null
        this.btnLoading = false
        this.btnDisabled = !this.btnEnabled
      }
    }
  }
</script>

<style lang="scss" scoped>
  .verification-code-input {
    display: flex;
    justify-content: space-between;
  }
</style>
