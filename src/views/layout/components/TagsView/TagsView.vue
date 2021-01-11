<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-panel" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></span>
      </router-link>
    </scroll-pane>
    <ul
      v-show="contextMenu.visible"
      :style="{left: contextMenu.left + 'px', top: contextMenu.top + 'px'}"
      class="context-menu"
    >
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOtherTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script>
  import ScrollPane from './components/ScrollPane'
  import path from 'path'

  export default {
    name: 'TagsView',
    components: { ScrollPane },
    data () {
      return {
        contextMenu: {
          visible: false,
          top: 0,
          left: 0
        },
        selectedTag: {},
        affixTags: []
      }
    },
    computed: {
      visitedViews () {
        return this.$store.getters['routerView/visitedViews']
      },
      routes () {
        return this.$store.getters['permission/routes']
      }
    },
    watch: {
      $route () {
        this.addTags()
        this.moveToCurrentTag()
      },
      'contextMenu.visible' (value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted () {
      this.initTags()
      this.addTags()
    },
    methods: {
      isActive (route) {
        return route.path === this.$route.path
      },
      isAffix (tag) {
        return tag.meta && tag.meta.affix
      },
      filterAffixTags (routes, basePath = '/') {
        let tags = []
        routes.forEach(route => {
          const tagPath = path.resolve(basePath, route.path)
          if (route.meta && route.meta.affix) {
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta }
            })
          }
          if (route.children && route.children.length) {
            const tempTags = this.filterAffixTags(route.children, tagPath)
            if (tempTags.length) {
              tags = [...tags, ...tempTags]
            }
          }
        })
        return tags
      },
      initTags () {
        const affixTags = this.affixTags = this.filterAffixTags(this.routes)
        for (const tag of affixTags) {
          // must have tag name
          if (tag.name) {
            this.$store.dispatch('routerView/addVisitedView', tag)
          }
        }
      },
      addTags () {
        const { name } = this.$route
        if (name) {
          this.$store.dispatch('routerView/addView', this.$route)
        }
      },
      moveToCurrentTag () {
        const tags = this.$refs.tag || []
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag)
              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('routerView/updateVisitedView', this.$route)
              }
              break
            }
          }
        })
      },
      refreshSelectedTag (view) {
        this.$store.dispatch('routerView/delCachedView', view).then(() => {
          const { fullPath } = view
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      closeSelectedTag (view) {
        this.$store.dispatch('routerView/delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
      },
      closeOtherTags () {
        this.$router.push(this.selectedTag).catch(err => err)
        this.$store.dispatch('routerView/delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags (view) {
        this.$store.dispatch('routerView/delAllViews').then(({ visitedViews }) => {
          if (this.affixTags.some(tag => tag.path === view.path)) {
            this.$router.push(view)
            return
          }
          this.toLastView(visitedViews, view)
        })
      },
      toLastView (visitedViews, view) {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView.fullPath).catch(err => err)
        } else {
          // now the default is to redirect to the home page if there is no tags-view,
          // you can adjust it according to your needs.
          if (view.name === 'Dashboard') {
            // to reload home page
            this.$router.replace({ path: '/redirect' + view.fullPath })
          } else {
            this.$router.push('/').catch(err => err)
          }
        }
      },
      openMenu (tag, e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 15 // 15: margin right

        if (left > maxLeft) {
          this.contextMenu.left = maxLeft
        } else {
          this.contextMenu.left = left
        }

        this.contextMenu.top = e.clientY
        this.contextMenu.visible = true
        this.selectedTag = tag
      },
      closeMenu () {
        this.contextMenu.visible = false
      },
      handleScroll () {
        this.closeMenu()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tags-view-container {
    height: 40px;
    width: 100%;
    background: #fbfdff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .tags-view-panel {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        margin: 4px;
        padding: 0 12px;
        height: 32px;
        line-height: 30px;
        border: 1px solid #d8dce5;
        border-radius: 3px;
        font-size: 12px;
        color: #515a6e;
        background: #fff;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);

        &:first-of-type {
          margin-left: 15px;
        }

        &:last-of-type {
          margin-right: 15px;
        }

        &::before {
          content: "";
          background: #e8eaec;
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: relative;
          top: 1px;
          margin-right: 5px;
          transition: all .3s cubic-bezier(.645, .045, .355, 1);
        }

        &.active, &:hover {
          color: #2d8cf0;

          &::before {
            background: #2d8cf0;
          }

          ::v-deep .el-icon-close {
            &:hover {
              color: #fff;
              background-color: #409eff;
            }
          }
        }

        ::v-deep .el-icon-close {
          position: relative;
          top: -1px;
          right: -5px;
          width: 16px;
          height: 16px;
          line-height: 17px;
          vertical-align: middle;
          border-radius: 50%;
          text-align: center;
          transition: all .3s cubic-bezier(.645, .045, .355, 1);
          font-size: 12px;
          cursor: pointer;
        }
      }
    }

    .context-menu {
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>
