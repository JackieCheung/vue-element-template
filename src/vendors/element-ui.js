import Vue from 'vue'
import {
  Alert,
  Autocomplete,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Dialog,
  Divider,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Icon,
  Input,
  Image,
  InputNumber,
  Link,
  Loading,
  Notification,
  Menu,
  MenuItem,
  Message,
  MessageBox,
  Option,
  OptionGroup,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Row,
  Scrollbar,
  Select,
  Step,
  Steps,
  Submenu,
  Switch,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  TimePicker,
  Tooltip,
  Tree,
  Upload
} from 'element-ui'

Vue
  .use(Alert)
  .use(Autocomplete)
  .use(Avatar)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Button)
  .use(Card)
  .use(Carousel)
  .use(CarouselItem)
  .use(Checkbox)
  .use(Col)
  .use(DatePicker)
  .use(Dialog)
  .use(Divider)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Form)
  .use(FormItem)
  .use(Icon)
  .use(Input)
  .use(Image)
  .use(InputNumber)
  .use(Link)
  .use(Loading.directive)
  .use(Menu)
  .use(MenuItem)
  .use(Option)
  .use(OptionGroup)
  .use(Pagination)
  .use(Popconfirm)
  .use(Popover)
  .use(Progress)
  .use(Radio)
  .use(RadioGroup)
  .use(Row)
  .use(Scrollbar)
  .use(Select)
  .use(Step)
  .use(Steps)
  .use(Submenu)
  .use(Switch)
  .use(Table)
  .use(TableColumn)
  .use(Tabs)
  .use(TabPane)
  .use(TimePicker)
  .use(Tooltip)
  .use(Tree)
  .use(Upload)
  .use(Cascader)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification

Vue.prototype.$msg = {
  info: (message, options = {}) => {
    return Message.info({
      showClose: true,
      ...options,
      message: message || '提示'
    })
  },
  success: (message, options = {}) => {
    return Message.success({
      showClose: true,
      ...options,
      message: message || '成功'
    })
  },
  error: (message, options = {}) => {
    return Message.error({
      showClose: true,
      ...options,
      message: message || '错误'
    })
  },
  warning: (message, options = {}) => {
    return Message.warning({
      showClose: true,
      ...options,
      message: message || '警告'
    })
  }
}
