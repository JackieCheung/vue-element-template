<script>
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
      const { iconType, icon, className } = context.props
      const style = context.data && context.data.staticStyle || {}

      const getClassName = () => {
        return `icon${className ? ' ' + className : ''}`
      }

      const vnodes = []

      if (icon) {
        switch (iconType) {
          case 'font-awesome':
            vnodes.push(<font-awesome-icon icon={icon} class={getClassName()} style={style} />)
            break
          case 'svg':
            vnodes.push(<svg-icon icon-class={icon} class={getClassName()} style={style} />)
            break
          case 'element-ui':
            vnodes.push(<i class={`${getClassName()}${icon ? ' ' + icon : ''}`} style={style} />)
            break
          case 'view-ui':
            vnodes.push(<Icon class={getClassName()} type={icon} style={style} />)
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
  .icon {
    width: 1em;
    height: 1em;
    font-size: 1em;
    color: inherit;
  }
</style>
