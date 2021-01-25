<script>
  export default {
    name: 'RenderColumn',
    functional: true,
    props: {
      column: {
        type: Object,
        default: null
      },
      index: {
        type: [Number, String],
        default: 0
      },
      row: {
        type: Object,
        default: null
      },
      render: {
        type: Function,
        default: null
      },
      scope: {
        type: Object,
        default: null
      }
    },
    render: (h, ctx) => {
      const params = {
        index: ctx.props.index,
        row: ctx.props.row,
        scope: ctx.props.scope
      }
      if (ctx.props.column) params.column = ctx.props.column
      return ctx.props.render(h, params)
    }
  }
</script>

<style scoped>

</style>
