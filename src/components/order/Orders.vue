<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
          <div class="text item">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input
                 placeholder="请输入内容" class="input-with-select"
                 v-model="queryinfor.keyword" clearable @clear='getOrders'>
                  <el-button slot="append" icon="el-icon-search" @click="getOrders"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-table
              :data="orderslist"
              border
              stripe
              highlight-current-row
              style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column
                prop="order_number"
                label="订单编号">
              </el-table-column>
              <el-table-column
                prop="order_price" width="95px"
                label="订单价格">
              </el-table-column>
              <el-table-column
                width="95px"
                label="支付"
              >
                <template slot-scope="scope">
                  <div>
                    <el-tag type="success" v-if="scope.row.pay_status === '已支付'">{{scope.row.pay_status}}</el-tag>
                    <el-tag type="info" v-else-if="scope.row.pay_status === '已取消'">{{scope.row.pay_status}}</el-tag>
                    <el-tag type="warning" v-else>{{scope.row.pay_status}}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="is_send" width="95px"
                label="是否发货">
              </el-table-column>
              <el-table-column
                prop="created_at"
                width="180px"
                label="创建时间">
                <template slot-scope="scope">
                  <div>
                    {{scope.row.created_at | dataFormat}}
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="good_desc"
                label="商品描述">
              </el-table-column> -->
              <el-table-column
                label="操作" width="130px">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip class="item" effect="dark" content="修改收货地址" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModAddressDialog(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="查看物流信息" placement="top" :enterable="false">
                      <el-button type="success" icon="el-icon-place" size="mini" @click="queryLogistics(scope.row)"></el-button>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页导航区域 -->
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryinfor.page"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryinfor.page_size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
            </div>
        </el-card>
        <!-- 修改收货地址对话框 -->
        <el-dialog title="修改收货地址" :visible.sync="modVisible" width="50%" @close="modAddressDialogClose">
          <el-form ref="modAddressFormRef" label-width="100px" :model="ModAddressForm" :rules='rules'>
            <el-form-item label="省市区/县" prop="address">
            <el-cascader
              :options="cityData"
              size="mini"
              collapse-tags
              :props="{ expandTrigger: 'hover' }"
              v-model="ModAddressForm.address">
            </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address_detail">
              <el-input prefix-icon="el-icon-receiving" placeholder="详细地址" v-model="ModAddressForm.address_detail"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="modVisible = false">取 消</el-button>
            <el-button type="primary" @click="modAddress">确 定</el-button>
          </div>
      </el-dialog>
        <el-dialog title="物流信息" :visible.sync="showLogisticsVisible" width="50%" @close="showLogisticsVisible = false">
            <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(logistic, index) in logistics"
                :key="index"
                :timestamp="logistic.time">
                {{logistic.context}}
              </el-timeline-item>
            </el-timeline>
      </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data: function () {
    return {
      orderslist: [],
      queryinfor: {
        keyword: '',
        page: 1,
        page_size: 10,
        order_by: ['created_at', 'id'],
        type: 1,
        attribute_sel: ''
      },
      total: 0,
      modVisible: false,
      ModAddressForm: {},
      rules: {
        address: [{
          required: true, message: '请选择省市区/县', trigger: 'blur'
        }],
        address_detail: [{
          required: true, message: '请填写详细地址', trigger: 'blur'
        }]
      },
      cityData,
      showLogisticsVisible: false,
      logistics: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    }
  },
  methods: {
    async getOrders () {
      const ret = await this.$http.get('api/orders/', { params: this.queryinfor })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.orderslist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    handleSizeChange (size) {
      this.queryinfor.page_size = size
      this.getOrders()
    },
    handleCurrentChange (page) {
      this.queryinfor.page = page
      this.getOrders()
    },
    showModAddressDialog () {
      this.modVisible = true
    },
    queryLogistics () {
      this.showLogisticsVisible = true
    },
    modAddressDialogClose () {
      this.$refs.modAddressFormRef.resetFields()
      this.modVisible = false
    },
    modAddress () {}
  },
  created () {
    this.getOrders()
  }
}
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
