import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Footer,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Message,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
// 面包屑导航
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
// 卡片
Vue.use(Card)
// 栅格布局
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

// 在调用 Vue.use 前，给 Message 添加 install 方法(这个东西导入有些不太清楚)
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
MessageBox.install = function (Vue, options) {
  Vue.prototype.$confirm = MessageBox.confirm
}
// Vue.proptotype.$message = Message
Vue.use(Message)
Vue.use(MessageBox)
