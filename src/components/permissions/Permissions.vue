<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card >
        <div >
      <el-table
        :data="permissionlist"
        border
        stripe
        highlight-current-row
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="auth_name"
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          prop="level"
          label="等级">
          <template slot-scope="scope">
            <div>
              <!-- {{scope.row.level}} -->
              <el-tag type="success" v-if="scope.row.level == 0">一级</el-tag>
              <el-tag type="info" v-else-if="scope.row.level == 1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="updated_at"
          label="修改时间">
        </el-table-column>
      </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryinfo.page_size"
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
      queryinfo: {
        page: 1,
        page_size: 10,
        order_by: ['created_at', 'id']
      },
      total: 0,
      permissionlist: []
    }
  },
  methods: {
    async getPermissionList () {
      // 获取权限列表
      const ret = await this.$http.get('api/menus/', { params: this.queryinfo })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.permissionlist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    handleSizeChange (size) {
      console.log(size)
      this.queryinfo.page_size = size
      this.getPermissionList()
    },
    handleCurrentChange (page) {
      console.log(page)
      this.queryinfo.page = page
      this.getPermissionList()
    }
  },
  created () {
    this.getPermissionList()
  }

}
</script>

<style lang="less" scoped>

</style>
