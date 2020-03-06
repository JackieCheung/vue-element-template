<template>
  <template>
    <!-- eslint-disable vue/require-component-is -->
    <component v-bind="linkProps(to)">
      <slot />
    </component>
  </template>
</template>

<script>
  import { isExternal } from '@/utils/validate'

  export default {
    name: 'Link',
    props: {
      to: {
        type: String,
        required: true
      }
    },
    methods: {
      linkProps (url) {
        if (isExternal(url)) {
          return {
            is: 'a',
            href: url,
            target: '_blank',
            rel: 'noopener'
          }
        }
        return {
          is: 'router-link',
          to: url
        }
      }
    }
  }
</script>
