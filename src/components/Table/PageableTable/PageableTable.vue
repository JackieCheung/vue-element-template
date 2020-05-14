<template>
  <div class="pageable-table">
    <div class="table-container position-relative">
      <Spin v-if="table.loading" fix></Spin>
      <e-table
        ref="eTable"
        v-drag-table
        :columns="table.columns"
        :data="table.data"
        v-bind="attrs"
        v-on="listeners">
        <template v-for="slotName in Object.keys(scopedSlots)" v-slot:[slotName]="{ scope }">
          <slot :name="slotName" :scope="scope"></slot>
        </template>
      </e-table>
    </div>
    <div v-if="pageable" class="pagination-container">
      <pagination
        :total="pageInfo.total"
        :page-num.sync="criteriaBuilder.pageBuilder.pageNum"
        :page-size.sync="criteriaBuilder.pageBuilder.pageSize"
        :auto-scroll="false"></pagination>
    </div>
  </div>
</template>

<script>
  import ETable from '../ETable'
  import Pagination from '_c/Pagination'
  import { scrollTo } from '@/utils/scroll-to'
  import debounce from 'lodash/debounce'

  export default {
    name: 'PageableTable',
    components: {
      ETable,
      Pagination
    },
    props: {
      data: {
        type: Array,
        default: () => ([])
      },
      columns: {
        type: Array,
        default: () => ([])
      },
      filter: {
        type: Object,
        default: undefined
      },
      getTableData: {
        type: Function,
        default: () => new Promise((resolve, reject) => {})
      },
      autoLoad: {
        type: Boolean,
        default: true
      },
      tableDataGetter: {
        type: Function,
        default: res => res.data && res.data.content || []
      },
      pageInfoGetter: {
        type: Function,
        default: res => ({ total: res.data && res.data.totalSize || 0 })
      },
      resMsgGetter: {
        type: Function,
        default: res => res.msg ? res.msg + '，' : ''
      },
      pageable: {
        type: Boolean,
        default: true
      },
      pageSize: {
        type: Number,
        default: 10
      },
      pageNum: {
        type: Number,
        default: 1
      },
      activateScroll: {
        type: Boolean,
        default: true
      },
      scrollTop: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        table: {
          loading: false,
          data: [],
          columns: []
        },
        criteriaBuilder: {
          filter: '',
          pageBuilder: {
            pageNum: 1,
            pageSize: 10,
            order: []
          }
        },
        pageInfo: {
          total: 0
        }
      }
    },
    computed: {
      attrs () {
        return {
          ...{
            border: true,
            size: 'medium',
            rowKey: row => row.id
          },
          ...this.$attrs
        }
      },
      listeners () {
        const _this = this
        return {
          ...{
            'filter-change': filter => {
              this.$emit('update:filter', { ..._this.criteriaBuilder.filter, ...filter })
            },
            'sort-change': ({ column, prop, order }) => {
              const classNameMap = {
                'descending': 'column-descending',
                'DESC': 'column-descending',
                'ascending': 'column-ascending',
                'ASC': 'column-ascending'
              }
              const { pageBuilder } = this.criteriaBuilder
              const index = pageBuilder.order.findIndex(o => o[prop])
              const dir = order === 'descending' ? 'DESC' : 'ASC'
              if (index > -1) {
                if (order) {
                  pageBuilder.order[index][prop] = pageBuilder.order[index][prop] === dir ? dir === 'DESC' ? 'ASC' : 'DESC' : dir
                  column.className = column.className.split(' ').filter(cls => !['column-ascending', 'column-descending'].includes(cls)).concat([classNameMap[pageBuilder.order[index][prop]]]).join(' ')
                } else {
                  pageBuilder.order.splice(index, 1)
                  column.className = column.className.split(' ').filter(cls => !['column-ascending', 'column-descending'].includes(cls)).join(' ')
                }
              } else {
                pageBuilder.order.push({ [prop]: dir })
                column.className = column.className ? column.className + ' ' + classNameMap[order] : classNameMap[order]
              }
            }
          },
          ...this.$listeners
        }
      },
      scopedSlots () {
        return this.$scopedSlots
      }
    },
    watch: {
      data: {
        handler (newValue) {
          this.table.data = this.$lodash.cloneDeep(newValue)
        },
        immediate: true
      },
      columns: {
        handler (newValue) {
          this.table.columns = this.$lodash.cloneDeep(newValue)
        },
        immediate: true
      },
      pageNum: {
        handler (newValue) {
          this.criteriaBuilder.pageBuilder.pageNum = newValue || 1
        },
        immediate: true
      },
      pageSize: {
        handler (newValue) {
          this.criteriaBuilder.pageBuilder.pageSize = newValue || 10
        },
        immediate: true
      },
      criteriaBuilder: {
        handler: debounce(function (newValue) {
          this.autoLoad && (typeof newValue.filter === 'undefined' || newValue.filter && JSON.stringify(newValue.filter) !== '{}') ? this.renderTable(newValue) : ''
        }, 100),
        deep: true
      },
      filter: {
        handler (newValue) {
          if (typeof newValue === 'undefined') {
            this.criteriaBuilder.filter = undefined
          } else if (newValue === null) {
            this.criteriaBuilder.filter = null
          } else {
            this.criteriaBuilder.filter = {
              ...this.criteriaBuilder.filter,
              ...newValue
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      // 加载表格
      renderTable (criteriaBuilder) {
        this.$emit('before-load')
        this.table.loading = true
        this.getTableData(!this.pageable ? criteriaBuilder.filter : criteriaBuilder).then(res => {
          if (res.code === 0) {
            this.table.data = this.tableDataGetter(res)
            this.pageInfo = this.pageInfoGetter(res)
            this.$emit('load-success', res)
          } else {
            this.$message({
              showClose: true,
              message: '获取列表数据失败！' + this.resMsgGetter(res) + '请重试！',
              type: 'error'
            })
            this.table.data = []
            this.pageInfo.total = 0
            this.$emit('load-fail')
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            showClose: true,
            message: '获取列表数据失败！请重试！',
            type: 'error'
          })
          this.table.data = []
          this.pageInfo.total = 0
          this.$emit('load-fail')
        }).finally(() => {
          this.table.loading = false
          this.$nextTick(() => {
            this.activateScroll ? scrollTo(document.querySelector('.app-main .el-scrollbar__wrap'), this.scrollTop || 0, 800) : ''
          })
          this.$emit('load-complete')
        })
      },
      // 重载表格
      reload () {
        this.renderTable(this.criteriaBuilder)
      },
      // 清空排序条件
      clearSort () {
        const { elTable: $table } = this.$refs.eTable.$refs
        $table.columns.filter(column => column.sortable).forEach(column => {
          let classNames = column.className.split(' ')
          classNames = classNames.filter(className => !['column-descending', 'column-ascending'].includes(className))
          column.className = classNames.join(' ')
        })
        $table.clearSort()
        this.criteriaBuilder.pageBuilder = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          order: []
        }
      },
      // 清空选择
      clearSelection () {
        this.$refs.eTable.$refs.elTable.clearSelection()
      },
      // 设置行展开与否
      toggleRowExpansion (row, expanded) {
        this.$refs.eTable.$refs.elTable.toggleRowExpansion(row, expanded)
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ {
    .el-table {
      .column-descending {
        .sort-caret.descending {
          border-top-color: #409EFF !important;
        }

        .sort-caret.ascending {
          border-bottom-color: #C0C4CC !important;
        }
      }

      .column-ascending {
        .sort-caret.descending {
          border-top-color: #C0C4CC !important;
        }

        .sort-caret.ascending {
          border-bottom-color: #409EFF !important;
        }
      }
    }
  }
</style>
