<script>
  import { isArray, isObject } from '@/utils/validate'

  export default {
    name: 'EIcon',
    functional: true,
    props: {
      iconType: {
        type: String,
        default: 'font-awesome'
      },
      icon: {
        type: [String, Array],
        default: ''
      },
      className: {
        type: String,
        default: ''
      }
    },
    render (h, context) {
      const { listeners } = context
      const { iconType, icon, className: clsName } = context.props
      const { attrs, style: dynamicStyle, staticStyle, class: dynamicClass, staticClass } = context.data

      const style = {
        ...staticStyle,
        ...(isArray(dynamicStyle) ? dynamicStyle.reduce((obj, stl) => ({ ...obj, ...stl }), {}) : isObject(dynamicStyle) ? dynamicStyle : {}) // object syntax
      }

      const className = [
        ...new Set([
          'e-icon',
          ...(staticClass ? staticClass.split(' ') : []),
          ...(isArray(dynamicClass) ? dynamicClass.flatMap(cls => {
            return isObject(cls) ? Object.keys(cls).filter(key => cls[key]) : cls
          }) : Object.keys(dynamicClass || {}).filter(cls => dynamicClass[cls])),
          ...(clsName ? [clsName] : [])
        ])
      ].join(' ')

      const vnodes = []

      if (icon) {
        switch (iconType) {
          case 'font-awesome':
            vnodes.push(<font-awesome-icon icon={icon} class={className} style={style} on={ listeners } />)
            break
          case 'svg':
            vnodes.push(<svg-icon icon-class={icon} class={className} style={style} on={ listeners } />)
            break
          case 'element-ui':
            vnodes.push(<i class={`${className}${icon ? ' ' + icon : ''}`} style={style} on={ listeners } />)
            break
          case 'view-ui':
            vnodes.push(<Icon class={className} color={attrs.color} type={icon} size={attrs.size} style={style} on={ listeners } />)
            break
          default:
            break
        }
      }
      return vnodes
    }
  }
</script>

<style lang="scss" scoped>
  .e-icon {
    width: 1em;
    height: 1em;
    font-size: 1em;
    color: inherit;
  }
</style>
