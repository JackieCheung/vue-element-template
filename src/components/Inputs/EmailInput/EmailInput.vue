<template>
  <div class="email-input">
    <el-autocomplete
      v-model="selectedEmail"
      v-bind="attrs"
      style="width: 100%;"
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
      <template slot-scope="{ item }">
        <slot :item="item"></slot>
      </template>
    </el-autocomplete>
  </div>
</template>
<script>
  import emailSuffixes from './email-suffixes'

  export default {
    name: 'EmailInput',
    inheritAttrs: false,
    props: {
      value: {
        type: String,
        required: true,
        default: ''
      }
    },
    data () {
      return {
        selectedEmail: ''
      }
    },
    computed: {
      attrs () {
        return Object.assign(
          {},
          {
            'fetch-suggestions': this.querySearch,
            'select-when-unmatched': true,
            'trigger-on-focus': false,
            'highlight-first-item': true,
            clearable: true,
            debounce: 100,
            placeholder: '请输入邮箱地址'
          },
          this.$attrs
        )
      },
      listeners () {
        return Object.assign(
          {},
          this.$listeners,
          {
            select: item => {
              this.$emit('select', item)
              this.$emit('input', item.value)
              this.$emit('change', item.value)
            }
          }
        )
      }
    },
    watch: {
      value: {
        handler (newValue) {
          this.selectedEmail = newValue
        },
        immediate: true
      }
    },
    methods: {
      querySearch (queryString, cb) {
        let results = []
        if (queryString) {
          const index = queryString.indexOf('@')
          if (index > -1) {
            results = emailSuffixes.filter(({ value }) => {
              return value.indexOf(queryString.slice(index)) > -1
            }).map(suffix => ({
              value: queryString.slice(0, index) + suffix.value,
              label: queryString.slice(0, index) + suffix.label
            }))
          } else {
            results = emailSuffixes.map(suffix => ({
              value: queryString + suffix.value,
              label: queryString + suffix.label
            }))
          }
        } else {
          results = emailSuffixes
        }
        // 调用 callback 返回建议列表的数据
        cb(results)
      }
    }
  }
</script>

<style scoped>

</style>
