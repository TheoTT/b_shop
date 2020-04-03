<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card >
        <div >
          <el-row :gutter="20">
              <el-col :span="4">
                <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
              </el-col>
          </el-row>
      <el-table
        :data="rolelist"
        border
        stripe
        highlight-current-row
        style="width: 100%">
        <!-- 增加扩展列 -->
        <el-table-column type="expand">
          <template scope="scope">
            <div>
              <!-- <el-row class="bdbottom" v-for="(item_1, i_1) in scope.row.menus" :key="item_1.id"> -->
                <!-- 索引为0加顶边框 -->
              <el-row :class="['bdbottom', i_1===0 ? 'bdtop' : '', 'vcenter']" v-for="(item_1, i_1) in scope.row.role_menus" :key="item_1.id">
                <!-- 划分为24列 -->
                <el-col :span="5">
                  <!-- 渲染一级权限 -->
                  <el-tag>{{item_1.auth_name}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <!-- 渲染2，3级权限 -->
                  <el-row :class="[i_2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item_2, i_2) in item_1.children" :key="item_2.id">
                    <el-col :span="6">
                      <el-tag type="success">{{item_2.auth_name}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="item_3 in item_2.children" :key="item_3.id"  closable @close="removeSubmenu(scope.row, item_3.id)">{{item_3.auth_name}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="role_desc"
          label="角色描述">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div>
              <!-- {{scope.row.id}} -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModRoleDialog(scope.row)"></el-button>
              <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showModRoleMenuDialog(scope.row)"></el-button>
              </el-tooltip>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRole(scope.row.id)"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
        </div>
        </el-card>
      <!-- 新建角色对话框 -->
        <el-dialog title="新建角色" :visible.sync="addRoleVisible" width="50%" @close="addRoleDialogClose">
          <el-form ref="addRoleFormRef" label-width="100px" class="add_form" :model="AddRoleForm" :rules='rules'>
          <!-- 角色名 -->
            <el-form-item label="角色名：" prop="role_name">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="角色名" v-model="AddRoleForm.role_name" :disabled="false"></el-input>
            </el-form-item>
            <!-- 角色描述 -->
            <el-form-item label="描述：" prop="role_desc">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-receiving" placeholder="角色描述" v-model="AddRoleForm.role_desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 修改角色对话框 -->
        <el-dialog title="修改角色" :visible.sync="modRoleVisible" width="50%" @close="modRoleDialogClose">
          <el-form ref="ModRoleFormRef" label-width="100px" class="mod_form" :model="ModRoleForm" :rules='rules'>
          <!-- 角色名 -->
            <el-form-item label="角色名：" prop="role_name">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="角色名" v-model="ModRoleForm.role_name" :disabled="false"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="描述：" prop="role_desc">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-receiving" placeholder="角色描述" v-model="ModRoleForm.role_desc"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="modRoleVisible = false">取 消</el-button>
            <el-button type="primary" @click="modRole">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 分配角色权限对话框 -->
        <el-dialog title="分配角色权限" :visible.sync="modRoleMenuVisible" width="50%" @close="modRoleMenuDialogClose">
          <el-tree
            :data="menulist"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultKeys"
            ref="treeRef"
            :props="treeProps">
          </el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button @click="modRoleMenuDialogClose">取 消</el-button>
            <el-button type="primary" @click="modRoleMenus">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  created () {
    this.getRoleList()
  },
  data: function () {
    return {
      rolelist: [],
      queryinfo: {
        page: 1,
        page_size: 5,
        order_by: ['created_at', 'id']
      },
      total: 0,
      addRoleVisible: false,
      modRoleVisible: false,
      modRoleMenuVisible: false,
      ModRoleForm: {},
      AddRoleForm: {},
      menulist: [],
      // 树形控件的嵌套对象
      treeProps: {
        label: 'auth_name', // 展示的属性值
        children: 'children' // 进行嵌套的对象
      },
      defaultKeys: [], // 默认选中的数组节点
      currRole: {}, // 当前选中进行操作的角色
      rules: {
        // 表单验证规则
        role_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        role_desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoleList () {
      // 获取角色列表
      const ret = await this.$http.get('api/roles/', { params: this.queryinfo })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.rolelist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    async removeSubmenu (role, menuId) {
      // 删除子菜单
      const confirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => {
        return err
      })
      // 如果用户点击确认，返回confirm的值为"confirm",点击取消则返回"cancel"
      if (confirm !== 'confirm') return this.$message.info('已取消删除操作')
      const ret = await this.$http.delete(`api/roles/${role.id}/menus/`, {
        params: {
          menu_id: menuId
        }
      })
      if (ret.status !== 204) return this.$message.error('删除权限失败')
      this.$message.info('删除权限成功')
      // TODO 优化该项
      this.getRoleList() // 直接再次获取会将所有展开项关闭
      console.log(ret)
      // role.role_menus = ret.data.role_menus
    },
    async getMenuList () {
      // 获取菜单列表
      const ret = await this.$http.get('api/menus_aside/')
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.menulist = ret.data.items
      console.log(ret.data)
    },
    async getRole (roleId) {
      // 获取角色
      const ret = await this.$http.get(`api/roles/${roleId}/`)
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.ModRoleForm = ret.data
      console.log(ret.data)
    },
    async addRole () {
      // 获取角色
      const ret = await this.$http.post(`api/roles/`, this.AddRoleForm)
      if (ret.status !== 201) return this.$message.error('新建失败')
      this.$message.success('新建权限成功')
      this.addRoleVisible = false
      this.getRoleList()
    },
    addRoleDialogClose () {
      this.addRoleVisible = false
    },
    showAddRoleDialog () {
      this.addRoleVisible = true
    },
    modRoleDialogClose () {
      this.modRoleVisible = false
    },
    showModRoleDialog (roleInfor) {
      // 获取role信息
      this.getRole(roleInfor.id)
      this.modRoleVisible = true
    },
    modRoleMenuDialogClose () {
      // 处理角色切换时，defaltKey未清空的bug
      this.defaultKeys = []
      this.modRoleMenuVisible = false
    },
    showModRoleMenuDialog (roleInfor) {
      // 获取所有权限信息
      this.getMenuList()
      // this.getLeafKeys(roleInfor, this.defaultKeys)
      this.defaultKeys = roleInfor.menus
      this.currRole = roleInfor
      this.modRoleMenuVisible = true
    },
    getLeafKeys (node, arr) {
      // 函数写的还有问题
    // 获取3级菜单的ID,配置默认选中项
      // console.log(('aaaaaa' + node.auth_name + this.defaultKeys))
      // if (node.level === 2) {
      if (!node.children) {
        // console.log('ccccc' + node.auth_name + node.id)
        return arr.push(node.id)
      }
      // try {
      //   if (!node.children) {
      //     console.log('ccccc' + node.auth_name + node.id)
      //     return arr.push(node.id)
      //   }
      // } catch (err) {
      //   if (!node.role_menus) {
      //     console.log('ccccc-m' + node.auth_name + node.id)
      //     return arr.push(node.id)
      //   }
      // }

      try {
        node.children.forEach(element => {
          console.log(('aaaaaa' + element.auth_name + this.defaultKeys))
          this.getLeafKeys(element, arr)
        })
      } catch (err) {
        node.role_menus.forEach(element => {
          console.log(('bbbbb' + element.auth_name + this.defaultKeys))
          this.getLeafKeys(element, arr)
        })
      }
    },
    async modRoleMenus () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const ret = await this.$http.put(`api/roles/${this.currRole.id}/`, {
        role_name: this.currRole.role_name,
        role_desc: this.currRole.role_desc,
        menu_ids: keys
      })
      if (ret.status !== 200) return this.$message.error('修改权限失败')
      this.$message.success('修改权限成功')
      this.getRoleList()
      this.modRoleMenuVisible = false
    },
    async modRole () {
      const ret = await this.$http.put(`api/roles/${this.ModRoleForm.id}/`, {
        role_name: this.ModRoleForm.role_name,
        role_desc: this.ModRoleForm.role_desc,
        menu_ids: this.ModRoleForm.menus
      })
      if (ret.status !== 200) return this.$message.error('修改权限失败')
      this.$message.success('修改权限成功')
      this.modRoleVisible = false
      this.getRoleList()
    },
    async delRole (roleId) {
      const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => {
        return err
      })
      // 如果用户点击确认，返回confirm的值为"confirm",点击取消则返回"cancel"
      if (confirm !== 'confirm') return this.$message.info('已取消删除操作')
      const ret = await this.$http.delete(`api/roles/${roleId}/`)
      if (ret.status !== 204) return this.$message.error('删除角色失败')
      this.$message.info('删除角色成功')
      this.getRoleList()
    }
  }

}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  // 竖直居中
  display: flex;
  align-items: center;
}

</style>
