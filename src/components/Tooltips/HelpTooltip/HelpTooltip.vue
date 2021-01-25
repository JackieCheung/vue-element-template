<template>
  <div class="help-tooltip position-absolute">
    <Tooltip v-bind="attrs" v-on="listeners">
      <slot>
        <e-icon icon-type="element-ui" icon="el-icon-question" style="color: #808695;"></e-icon>
      </slot>
      <template #content>
        <slot name="content"></slot>
      </template>
    </Tooltip>
  </div>
</template>

<script>
  export default {
    name: 'HelpTooltip',
    computed: {
      attrs () {
        return {
          ...{
            placement: 'right',
            transfer: true
          },
          ...this.$attrs
        }
      },
      listeners () {
        return {
          ...this.$listeners
        }
      }
    }
  }
</script>

<style scoped>

</style>
