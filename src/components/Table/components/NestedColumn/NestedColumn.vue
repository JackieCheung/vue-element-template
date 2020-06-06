<template>
  <el-table-column
    :type="column.type || ''"
    :index="column.index"
    :column-key="column.columnKey || column.key || column.prop || ''"
    :label="column.title || column.label || ''"
    :prop="column.key || column.prop || ''"
    :width="column.width || ''"
    :min-width="column.minWidth || ''"
    :fixed="column.fixed"
    :render-header="column.renderHeader"
    :sortable="column.sortable"
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="attrs.border ? column.resizable || false : false"
    :formatter="column.formatter"
    :show-overflow-tooltip="column.showOverflowTooltip || false"
    :align="column.align || 'center'"
    :header-align="column.headerAlign || 'center'"
    :class-name="column.className || ''"
    :label-class-name="column.labelClassName || ''"
    :selectable="column.selectable"
    :reserve-selection="column.type === 'selection' ? column.reserveSelection || false : false"
    :filters="column.filters"
    :filter-placement="column.filterPlacement || 'bottom-start'"
    :filter-multiple="column.filterMultiple || true"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue">
    <template v-if="column.children && column.children.length">
      <nested-column
        v-for="(col, i) in column.children"
        :key="col.key || col.prop || 'nested_column_' + getUniqueString()"
        :attrs="attrs"
        :column="col"
        :index="i">
      </nested-column>
    </template>
    <template slot-scope="scope">
      <render-column
        v-if="column.render && typeof column.render === 'function'"
        :column="column"
        :index="index"
        :render="column.render"
        :row="scope.row"
        :scope="scope">
      </render-column>
      <slot v-else-if="column.slot" :name="column.slot" :scope="scope"></slot>
      <span v-else>{{ (column.formatter && column.formatter(scope.row)) || scope.row[column.key || column.prop] || (scope.row[column.key || column.prop] === 0 ? scope.row[column.key || column.prop] : colEmptyText) }}</span>
    </template>
  </el-table-column>
</template>

<script>
  import RenderColumn from '../RenderColumn'
  import { createUniqueString } from '@/utils/tools'

  export default {
    name: 'NestedColumn',
    components: {
      RenderColumn
    },
    props: {
      column: {
        type: Object,
        default: null
      },
      index: {
        type: Number,
        default: 0
      },
      colEmptyText: {
        type: String,
        default () {
          return '/'
        }
      },
      attrs: {
        type: Object,
        default: null
      }
    },
    methods: {
      getUniqueString () {
        return createUniqueString()
      }
    }
  }
</script>

<style scoped>

</style>
