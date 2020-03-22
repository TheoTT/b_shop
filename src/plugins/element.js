import Vue from 'vue'
import { Button, Form, FormItem, Input, Container, Header, Aside, Footer, Main, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Aside)
// 在调用 Vue.use 前，给 Message 添加 install 方法(这个东西导入有些不太清楚)
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
// Vue.proptotype.$message = Message
Vue.use(Message)
