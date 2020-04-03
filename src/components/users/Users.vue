<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
          <div class="text item">

            <el-row :gutter="20">
              <el-col :span="8">
                <el-input placeholder="请输入内容" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click='addVisible = true'>添加</el-button>
              </el-col>
            </el-row>
              <el-table
                :data="userlist"
                border
                stripe
                highlight-current-row
                style="width: 100%">
                <!-- <el-table-column
                  prop="id"
                  label="ID"
                  width="100">
                </el-table-column> -->
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  prop="username"
                  label="用户名">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱">
                </el-table-column>
                <el-table-column
                  prop="created_at"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  prop="updated_at"
                  label="修改时间">
                </el-table-column>
                <el-table-column
                  label="状态">
                  <template slot-scope="scope">
                    <div>
                      <!-- {{scope.row.status}} -->
                      <el-switch
                        v-model='scope.row.status'
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="statusMod(scope.row)">
                      </el-switch>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="角色">
                  <template slot-scope="scope">
                    <div>
                      <el-select v-model="roleId" :placeholder="scope.row.role.role_name" @change="modUserRole(scope.row)">
                        <el-option
                          v-for="item in rolelist"
                          :key="item.id"
                          :label="item.role_name"
                          :value="item.id"
                          >
                        </el-option>
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="180"
                  label="操作">
                  <!-- <template slot-scope="scope"> -->
                  <template slot-scope="scope">
                    <div>
                      <!-- {{scope.row.status}} -->
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModUserDialog(scope.row)"></el-button>
                      <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                      </el-tooltip>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row)"></el-button>

                    </div>
                  </template>
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
        <!-- 新建用户对话框 -->
        <el-dialog title="新建用户" :visible.sync="addVisible" width="50%" @close="addDialogClose">
          <el-form ref="AddFormRef" label-width="100px" class="add_form" :model="AddUserForm" :rules="rules">
          <!-- 用户名 -->
            <el-form-item label="用户名：" prop="username">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="用户名" v-model="AddUserForm.username"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱：" prop="email">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-receiving" placeholder="Email" v-model="AddUserForm.email"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码：" prop="password">
              <!-- 使用第三方导入的图标 -->
              <!-- <el-input prefix-icon="el-icon-lollipop" placeholder="请输入密码"></el-input> -->
              <el-input prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" v-model="AddUserForm.password" show-password></el-input>
            </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </div>
      </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="新建用户" :visible.sync="modVisible" width="50%" @close="modDialogClose">
          <el-form ref="ModFormRef" label-width="100px" class="mod_form" :model="ModUserForm" :rules="rules">
          <!-- 用户名 -->
            <el-form-item label="用户名：" prop="username">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="用户名" v-model="ModUserForm.username" :disabled="true"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱：" prop="email">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-receiving" placeholder="Email" v-model="ModUserForm.email"></el-input>
            </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="modVisible = false">取 消</el-button>
            <el-button type="primary" @click="modUser">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data: function () {
    // 邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      // 邮箱校验正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return callback()
      else {
        return callback(new Error('请输入合法的邮箱'))
      }
    }
    return {
      userlist: [],
      queryinfo: {
        page: 1,
        page_size: 5,
        order_by: ['created_at', 'id']
      },
      total: 0,
      addVisible: false, // 控制新建用户对话框的显示与隐藏
      rules: {
        // 表单验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在6 到 15 个字符', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      AddUserForm: {},
      ModUserForm: {},
      modVisible: false, // 控制修改用户对话框的显示与隐藏
      rolelist: [],
      roleId: ''

    }
  },
  methods: {
    async getUserList () {
      // 获取用户列表
      const ret = await this.$http.get('api/users/', { params: this.queryinfo })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.userlist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    handleSizeChange (size) {
      console.log(size)
      this.queryinfo.page_size = size
      this.getUserList()
    },
    handleCurrentChange (page) {
      console.log(page)
      this.queryinfo.page = page
      this.getUserList()
    },
    async statusMod (userInfo) {
      // 更新用户状态
      const ret = await this.$http.put(`api/users/${userInfo.id}/status/`, {
        status: userInfo.status
      })
      if (ret.status !== 200) {
        userInfo.status = !userInfo.status
        return this.$message.error('修改失败')
      }
      this.$message.success('更新状态成功')
    },
    addDialogClose () {
      this.$refs.AddFormRef.resetFields()
    },
    addUser () {
      this.$refs.AddFormRef.validate(
        async valid => {
          console.log(valid)
          if (!valid) return
          const ret = await this.$http.post('api/users/', this.AddUserForm)
          console.log(ret)
          if (ret.status !== 201) return this.$message.error('新建失败' + ret.status)
          this.$message.success('用户新建成功')
          this.addVisible = false
          this.getUserList()
        }
      )
    },
    async showModUserDialog (userInfor) {
      this.modVisible = true
      const ret = await this.$http.get(`api/users/${userInfor.id}/`)
      console.log(ret.data)
      this.ModUserForm = ret.data
    },
    modDialogClose () {
      this.$refs.ModFormRef.resetFields()
    },
    modUser () {
      this.$refs.ModFormRef.validate(
        async valid => {
          console.log(valid)
          if (!valid) return
          const ret = await this.$http.put(`api/users/${this.ModUserForm.id}/`, {
            email: this.ModUserForm.email,
            username: this.ModUserForm.username
          })
          console.log(ret)
          if (ret.status !== 200) return this.$message.error('修改失败' + ret.status)
          this.$message.success('用户修改成功')
          this.modVisible = false
          this.getUserList()
        }
      )
    },
    async delUser (userInfor) {
      const confirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => {
        return err
      })
      // 如果用户点击确认，返回confirm的值为"confirm",点击取消则返回"cancel"
      if (confirm !== 'confirm') return this.$message.info('已取消删除操作')
      const ret = await this.$http.delete(`api/users/${userInfor.id}/`)
      if (ret.status !== 204) return this.$message.error('删除用户失败')
      this.$message.info('删除用户成功')
      this.getUserList()
    },
    async getRoleList () {
      // 获取角色列表
      const ret = await this.$http.get('api/roles/', { params: this.queryinfo })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.rolelist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    async modUserRole (userInfor) {
      // console.log(userInfor)
      // TODO 修改为URL传参
      const ret = await this.$http.put(`api/users/${userInfor.id}/role/`, {
        role_id: this.roleId
      })
      if (ret.status !== 200) return this.$message.error('修改失败' + ret.status)
      this.$message.success('用户修改成功')
      this.getUserList()
    }
  },
  created () {
    this.getUserList()
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>

</style>
