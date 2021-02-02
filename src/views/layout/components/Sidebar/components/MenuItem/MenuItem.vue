<script>
  export default {
    name: 'MenuItem',
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
      title: {
        type: String,
        default: ''
      }
    },
    render (h, context) {
      const { iconType, icon, title } = context.props
      const vnodes = []

      if (icon) {
        switch (iconType) {
          case 'font-awesome':
            vnodes.push(<font-awesome-icon icon={icon} class='icon' />)
            break
          case 'svg':
            vnodes.push(<svg-icon icon-class={icon} class='icon' />)
            break
          case 'element-ui':
            vnodes.push(<i class={`icon ${icon}`} />)
            break
          case 'view-ui':
            vnodes.push(<Icon class='icon' type={icon} />)
            break
          default:
            break
        }
      }

      if (title) {
        vnodes.push(<span slot='title'>{(title)}</span>)
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
    vertical-align: middle;
  }
</style>
