<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
          <div class="text item">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input
                 placeholder="请输入内容" class="input-with-select"
                 v-model="queryinfor.keyword" clearable @clear='getGoods'>
                  <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click='goAddPage'>添加</el-button>
              </el-col>
            </el-row>
            <el-table
              :data="goodslist"
              border
              stripe
              highlight-current-row
              style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column
                prop="good_name"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="good_price" width="95px"
                label="商品价格">
              </el-table-column>
              <el-table-column
                prop="good_weight" width="95px"
                label="商品重量">
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
                    <!-- {{scope.row.id}} -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModGoodDialog(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGood(scope.row)"></el-button>
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
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      goodslist: [],
      queryinfor: {
        keyword: '',
        page: 1,
        page_size: 10,
        order_by: ['created_at', 'id'],
        type: 1,
        attribute_sel: ''
      },
      total: 0
    }
  },
  methods: {
    async getGoods () {
      const ret = await this.$http.get('api/goods/', { params: this.queryinfor })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.goodslist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    goAddPage () {
      this.$router.push('/goods/add')
    },
    showModGoodDialog () {},
    handleSizeChange (size) {
      this.queryinfor.page_size = size
      this.getGoods()
    },
    handleCurrentChange (page) {
      this.queryinfor.page = page
      this.getGoods()
    },
    async delGood (goodInfor) {
      const confirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => {
        return err
      })
      // 如果用户点击确认，返回confirm的值为"confirm",点击取消则返回"cancel"
      if (confirm !== 'confirm') return this.$message.info('已取消删除操作')
      const ret = await this.$http.delete(`api/goods/${goodInfor.id}/`)
      if (ret.status !== 204) return this.$message.error('删除分类失败')
      this.$message.info('删除分类成功')
      this.getGoods()
    }
  },
  created () {
    this.getGoods()
  }
}
</script>

<style lang="less" scoped>

</style>
