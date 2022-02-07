/* eslint-disable @typescript-eslint/no-explicit-any */
import { reactive, readonly, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RespData, RespPage } from '@/api/common'
import { utils } from '@/utils'

type PageBuilder = {
  pageIndex: number
  pageSize: number
}

interface PageInfo {
  loading: boolean
  filter: any
  pageBuilder: PageBuilder
  data: Array<any>
  total: number
  Render: () => Promise<void>
  Search: () => void
  Reset: () => void
  Delete: (param: {
    id: string | number | (string | number)[]
    label?: string
    key?: string
  }) => void
  DeleteBatch: (param: {
    ids: (string | number)[]
    label?: string
    key?: string
  }) => void
  DialogClose: (
    params: { update?: boolean; delay: number },
    Close: (update?: boolean) => void,
  ) => void
}

const UsePage = <Filter extends Record<string, unknown>>(params: {
  api: {
    Page: (params: Filter & PageBuilder) => Promise<RespPage<any>>
    Delete?: (params: any) => Promise<RespData<any>>
  }
  hook?: {
    beforeRender?: () => void | Promise<void>
    afterDelete?: () => void | Promise<void>
  }
  criteriaBuilder: {
    filter?: Filter
    pageBuilder?: PageBuilder
  }
  useCache?: boolean
  formatter?: (item: any) => void
  immediate?: boolean
}): {
  pageInfo: PageInfo
} => {
  const route = useRoute()

  const loading = ref(false)

  const criteriaBuilder = reactive({
    filter: JSON.parse(JSON.stringify(params.criteriaBuilder.filter || {})),
    pageBuilder: {
      pageIndex: 1,
      pageSize: params.criteriaBuilder?.pageBuilder?.pageSize || 20,
    },
  })

  const initialCriteriaBuilder = JSON.parse(JSON.stringify(criteriaBuilder))

  const pageInfo: PageInfo = reactive({
    filter: JSON.parse(JSON.stringify(criteriaBuilder.filter)),
    pageBuilder: JSON.parse(JSON.stringify(criteriaBuilder.pageBuilder)),
    loading: readonly(loading),
    total: 0,
    data: Array<any>(),
    Render: async () => {
      if (loading.value) return

      loading.value = true

      if (params.useCache) utils.cache.Set(cacheKey, criteriaBuilder)
      const { code, data } = await params.api.Page({
        ...criteriaBuilder.filter,
        ...criteriaBuilder.pageBuilder,
      })

      params.hook?.beforeRender && (await params.hook.beforeRender())

      switch (code) {
        case 0:
          Object.assign(pageInfo, {
            total: data.total || 0,
            data: data.list || [],
          })

          if (params.formatter) {
            for (const item of pageInfo.data) {
              params.formatter(item)
            }
          }
          break
        default:
          Object.assign(pageInfo, {
            total: 0,
            data: [],
          })
          break
      }

      loading.value = false
    },
    Search: () => {
      Object.keys(criteriaBuilder.filter).map((key) => {
        criteriaBuilder.filter[key] = JSON.parse(
          JSON.stringify(pageInfo.filter[key]),
        )
      })
      criteriaBuilder.pageBuilder.pageIndex = 1
    },
    Reset: () => {
      Object.assign(pageInfo, initialCriteriaBuilder)
      pageInfo.Search()
    },
    Delete: (param: {
      id: string | number | (string | number)[]
      label?: string
      key?: string
    }) => {
      utils.ui.Confirm({
        title: '提示',
        text: `确认删除${param.label || ''}？`,
        maskClose: true,
        ok: async () => {
          if (!params.api.Delete) {
            utils.ui.Msg({ msg: '没有配置删除接口！', type: 'warning' })
            return
          }
          const { code, msg } = await params.api.Delete({
            [param.key || 'id']: param.id,
          })
          if (code !== 0) {
            utils.ui.Msg({ msg, type: 'error' })
            return
          }
          utils.ui.Msg({ msg, type: 'success' })
          await pageInfo.Render()

          params.hook?.afterDelete && params.hook.afterDelete()
        },
      })
    },
    DeleteBatch: (param: {
      ids: (string | number)[]
      label?: string
      key?: string
    }) => {
      utils.ui.Confirm({
        title: '提示',
        text: param.label
          ? `确认批量删除${param.label || ''}？`
          : '此操作将删除已勾选内容，是否继续？',
        maskClose: true,
        ok: async () => {
          if (!params.api.Delete) {
            utils.ui.Msg({ msg: '没有配置批量删除接口！', type: 'warning' })
            return
          }

          const { code, msg } = await params.api.Delete({
            [param.key || 'ids']: param.ids,
          })
          if (code !== 0) {
            utils.ui.Msg({ msg, type: 'error' })
            return
          }
          utils.ui.Msg({ msg, type: 'success' })
          await pageInfo.Render()

          params.hook?.afterDelete && (await params.hook.afterDelete())
        },
      })
    },
    DialogClose: (
      params: { update?: boolean; delay: number },
      Close: (update?: boolean) => void,
    ) => {
      if (params.update) pageInfo.Render()
      setTimeout(() => {
        Close(params.update)
      }, params.delay)
    },
  })

  const cacheKey = `cache_${route.name as string}_condition`
  const cacheData = utils.cache.Get(cacheKey) as {
    filter: Filter
    pageBuilder: PageBuilder
  }
  params.useCache &&
    cacheData &&
    Object.keys(criteriaBuilder.filter).map((key) => {
      criteriaBuilder.filter[key] = JSON.parse(JSON.stringify(cacheData[key]))
    })

  watch(
    () => pageInfo.pageBuilder,
    (value) => {
      Object.assign(criteriaBuilder.pageBuilder, value)
    },
    {
      deep: true,
    },
  )

  watch(
    () => criteriaBuilder.pageBuilder.pageSize,
    () => {
      criteriaBuilder.pageBuilder.pageIndex = 1
    },
  )

  watch(
    () => criteriaBuilder,
    () => {
      pageInfo.Render()
    },
    {
      deep: true,
      immediate: params.immediate === true,
    },
  )

  return {
    pageInfo,
  }
}

export default UsePage
