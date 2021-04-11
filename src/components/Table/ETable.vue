<template>
  <el-table
    ref="elTable"
    v-loading="loading"
    :columns="columns"
    :data="data"
    style="width: 100%;"
    v-bind="attrs"
    v-on="listeners"
  >
    <template v-for="(column, index) in columns">
      <!-- 特殊类型的 column 不可引用 slot-scope ，不然会失去原有渲染 -->
      <el-table-column
        v-if="specialColumn(column)"
        :key="column.key || column.prop || `column_${index}`"
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
        :filtered-value="column.filteredValue"
      ></el-table-column>
      <nested-column
        v-else-if="column.children && column.children.length"
        :key="column.key || column.prop || column.label || `nested-column_${index}`"
        :attrs="attrs"
        :column="column"
        :index="index"
      >
        <!-- 传递外层父组件定义的 slot 到内层 el-column 子组件 -->
        <template v-for="slotName in Object.keys($scopedSlots)" #[slotName]="{ scope }">
          <slot :name="slotName" :scope="scope"></slot>
        </template>
      </nested-column>
      <el-table-column
        v-else
        :key="column.key || column.prop || `column_${index}`"
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
        :filtered-value="column.filteredValue"
      >
        <template v-if="column.headerSlot || column.headerRender" #header="scope">
          <render-column
            v-if="column.headerRender && typeof column.headerRender === 'function'"
            :column="column"
            :index="index"
            :render="column.headerRender"
            :row="scope.row"
            :scope="scope"
          ></render-column>
          <slot v-else :name="column.headerSlot" :scope="scope">
            {{ column.label }}
          </slot>
        </template>
        <template #default="scope">
          <render-column
            v-if="column.render && typeof column.render === 'function'"
            :column="column"
            :index="index"
            :render="column.render"
            :row="scope.row"
            :scope="scope"
          ></render-column>
          <slot v-else-if="column.slot" :name="column.slot" :scope="scope"></slot>
          <template v-else>
            <div>
              <span>{{ getCellValue(column, scope.row) }}</span>
              <copy-to-clipboard
                v-if="column.copyable && getCellValue(column, scope.row) !== colEmptyText"
                :value="getCellValue(column, scope.row)"
              />
            </div>
          </template>
        </template>
      </el-table-column>
    </template>
    <template #append>
      <slot name="append"></slot>
    </template>
  </el-table>
</template>

<script>
  import CopyToClipboard from '@/components/CopyToClipboard'
  import NestedColumn from './components/NestedColumn'
  import RenderColumn from './components/RenderColumn'

  export default {
    name: 'ETable',
    components: {
      CopyToClipboard,
      NestedColumn,
      RenderColumn
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      data: {
        type: Array,
        default () {
          return []
        }
      },
      colEmptyText: {
        type: String,
        default () {
          return '/'
        }
      }
    },
    computed: {
      attrs () {
        return {
          ...{
            border: true,
            size: 'medium'
          },
          ...this.$attrs
        }
      },
      listeners () {
        return {
          ...this.$listeners
        }
      }
    },
    methods: {
      specialColumn (column) {
        return ['selection', 'index'].includes(column.type)
      },
      getCellValue (column, row) {
        return (column.formatter && column.formatter(row)) || row[column.key || column.prop] || (row[column.key || column.prop] === 0 ? row[column.key || column.prop] : this.colEmptyText)
      }
    }
  }
</script>

<style scoped>

</style>
