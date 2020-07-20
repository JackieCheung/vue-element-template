<template>
  <div class="password-input">
    <el-tooltip
      v-model="capsLock"
      content="大写锁定已打开"
      :disabled="showPasswordStrength"
      manual
      placement="right"
      :tabindex="-1">
      <el-popover
        v-model="popoverVisible"
        :disabled="!showPasswordStrength"
        :popper-class="effect === 'dark' ? 'is-dark' : ''"
        placement="right"
        width="200"
        trigger="manual">
        <div class="py-5" style="font-size: 12px;">
          <P v-if="capsLock" class="mb-10" :style="{ color: effect === 'dark' ? '#5cadff' : '#409EFF' }">大写锁定已打开</P>
          <p :style="`color: ${passwordStrength.color || ''};`">
            强度：<span>{{ passwordStrength.label || '无' }}</span>
          </p>
          <el-progress
            class="my-10"
            :percentage="(passwordStrength.level || 0) * 25"
            :color="passwordStrength.color"
            :stroke-width="10"
            :show-text="false"></el-progress>
          <p>请至少输入 6 个字符。</p>
        </div>
        <el-input
          ref="passwordInput"
          slot="reference"
          v-model="password"
          v-bind="attrs"
          v-on="listeners"
          @keyup.native="checkCapslock">
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
      </el-popover>
    </el-tooltip>
  </div>
</template>

<script>
  import { verifyPasswordStrength } from '@/utils/tools'

  export default {
    name: 'PasswordInput',
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      value: {
        type: String,
        required: true
      },
      showPasswordStrength: {
        type: Boolean,
        default: true
      },
      effect: {
        type: String,
        default: 'light'
      }
    },
    data () {
      return {
        popoverVisible: false,
        capsLock: false,
        password: ''
      }
    },
    computed: {
      attrs () {
        return Object.assign(
          {},
          {
            clearable: true,
            'maxlength': 20,
            'show-password': true,
            placeholder: '请输入密码，长度为 6-20 个字符'
          },
          this.$attrs
        )
      },
      listeners () {
        return Object.assign(
          {},
          this.$listeners,
          {
            focus: event => {
              this.popoverVisible = true
            },
            blur: event => {
              this.capsLock = false
              this.popoverVisible = false
            },
            input: value => {
              this.$emit('input', value, this.passwordStrength)
            },
            change: value => {
              this.$emit('change', value, this.passwordStrength)
            }
          }
        )
      },
      passwordStrength () {
        return verifyPasswordStrength(this.password) || {}
      }
    },
    watch: {
      value: {
        handler (newValue) {
          this.password = newValue
        },
        immediate: true
      }
    },
    methods: {
      // 检查大写锁定是否打开
      checkCapslock (event) {
        const { key, shiftKey } = event
        this.capsLock = (key && key.length === 1) && (shiftKey && key >= 'a' && key <= 'z') || (!shiftKey && key >= 'A' && key <= 'Z')
        key === 'CapsLock' && this.capsLock && (this.capsLock = false)
      }
    }
  }
</script>

<style scoped>

</style>
