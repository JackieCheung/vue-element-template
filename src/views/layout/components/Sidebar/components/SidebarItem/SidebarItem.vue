<script>
  import path from 'path'
  import { isExternal } from '@/utils/validate'
  import MenuItem from '../MenuItem'
  import AppLink from '../Link'
  import FixIOSBug from '../../mixins/fix-ios-bug'

  export default {
    name: 'SidebarItem',
    components: {
      MenuItem,
      AppLink
    },
    mixins: [FixIOSBug],
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    methods: {
      resolvePath (routePath) {
        if (isExternal(routePath)) {
          return routePath
        }
        if (isExternal(this.basePath)) {
          return this.basePath
        }
        return path.resolve(this.basePath, routePath)
      }
    },
    render (h) {
      let sideBarItem = null
      let appLink = null
      if (!this.item.hidden) {
        const showingChildren = (this.item.children || []).filter(item => !item.hidden)
        let onlyOneChild = null
        if (showingChildren.length === 1) {
          // When there is only one child router, the child router is displayed by default
          onlyOneChild = showingChildren[0]
        } else if (showingChildren.length === 0) {
          // Show parent if there are no child router to display
          onlyOneChild = {
            ...this.item,
            path: '',
            noShowingChildren: true
          }
        }
        if (onlyOneChild && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !this.item.alwaysShow) {
          // todo debug
          if (onlyOneChild.meta) {
            appLink = <app-link to={this.resolvePath(onlyOneChild.path)}>
              <el-menu-item index={this.resolvePath(onlyOneChild.path)}
                            class={{ 'submenu-title-noDropdown': !this.isNest }}>
                <menu-item icon-type={onlyOneChild.meta.iconType}
                           icon={onlyOneChild.meta.icon || (this.item.meta && this.item.meta.icon)}
                           title={onlyOneChild.meta.title}></menu-item>
              </el-menu-item>
            </app-link>
          }
        } else {
          sideBarItem = <el-submenu ref='subMenu' index={this.resolvePath(this.item.path)} popper-append-to-body>
            <template slot='title'>
              {this.item.meta ? <menu-item icon-type={this.item.meta.iconType} icon={this.item.meta.icon}
                                           title={this.item.meta.title}></menu-item> : ''}
            </template>
            {
              this.item.children.map(child => {
                return <sidebar-item
                  key={child.path}
                  is-nest={true}
                  item={child}
                  base-path={this.resolvePath(child.path)}
                  class='nest-menu'></sidebar-item>
              })
            }
          </el-submenu>
        }
      }
      return (
        <div>
          {appLink}
          {sideBarItem}
        </div>
      )
    }
  }
</script>

<style scoped>

</style>
