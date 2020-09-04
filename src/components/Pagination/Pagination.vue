<template>
  <div :class="{'hidden': hidden}" class="pagination">
    <el-pagination
      :total="total"
      :page-size.sync="currentPageSize"
      :current-page.sync="currentPageNum"
      v-bind="attrs"
      v-on="listeners"
    >
    </el-pagination>
  </div>
</template>

<script>
  import { scrollTo } from '@/utils/scroll-to'

  export default {
    name: 'Pagination',
    props: {
      total: {
        required: true,
        type: Number
      },
      pageSize: {
        type: Number,
        default: 20
      },
      pageNum: {
        type: Number,
        default: 1
      },
      autoScroll: {
        type: Boolean,
        default: true
      },
      hidden: {
        type: Boolean,
        default: false
      },
      scrollTop: {
        type: Number,
        default: 0
      }
    },
    computed: {
      attrs () {
        return Object.assign(
          {},
          {
            background: true,
            layout: '->, total, sizes, prev, pager, next, jumper',
            'hide-on-single-page': false
          },
          this.$attrs
        )
      },
      listeners () {
        return Object.assign(
          {},
          {
            'size-change': value => {
              this.$emit('update:pagination', {
                pageNum: this.currentPageNum,
                pageSize: value
              })
              if (this.autoScroll) {
                scrollTo(document.querySelector('.app-main .el-scrollbar__wrap'), this.scrollTop || 0, 800)
              }
            },
            'current-change': value => {
              this.$emit('update:pagination', {
                pageNum: value,
                pageSize: this.currentPageSize
              })
              if (this.autoScroll) {
                scrollTo(document.querySelector('.app-main .el-scrollbar__wrap'), this.scrollTop || 0, 800)
              }
            }
          },
          this.$listeners
        )
      },
      currentPageNum: {
        get () {
          return this.pageNum
        },
        set (value) {
          this.$emit('update:pageNum', value)
        }
      },
      currentPageSize: {
        get () {
          return this.pageSize
        },
        set (value) {
          this.$emit('update:pageSize', value)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pagination {
    background: #fff;
    padding: 32px 16px;

    &.hidden {
      display: none;
    }
  }
</style>
