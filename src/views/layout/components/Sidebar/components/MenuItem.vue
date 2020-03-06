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
        type: String,
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

      switch (iconType) {
        case 'font-awesome':
          vnodes.push(<font-awesome-icon icon={icon} />)
          break
        case 'svg':
          vnodes.push(<svg-icon icon-class={icon} />)
          break
        case 'element':
          vnodes.push(<i className={icon} />)
          break
        default:
          break
      }

      if (title) {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
      return vnodes
    }
  }
</script>
