<template>
    <div>
      <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card >
        <div >
          <!-- 添加按钮 -->
          <el-row :gutter="20">
              <el-col :span="4">
                <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
              </el-col>
          </el-row>
          <!-- 表格展示区域 -->
          <!-- 分页导航区域 -->
        </div>
      </el-card>
      <!-- 新建分类对话框 -->
        <el-dialog title="新建分类" :visible.sync="addCategoryVisible" width="50%" @close="addCategoryDialogClose">
          <el-form ref="addCategoryFormRef" label-width="100px" class="add_form" :model="AddCategoryForm" :rules='rules'>
          <!-- 角色名 -->
            <el-form-item label="分类名：" prop="category_name">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="分类名" v-model="AddCategoryForm.category_name" :disabled="false"></el-input>
            </el-form-item>
            <!-- 角色描述 -->
            <el-form-item label="描述：" prop="category_desc">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-receiving" placeholder="分类描述" v-model="AddCategoryForm.category_desc"></el-input>
            </el-form-item>
            <el-form-item label="Level：" prop="category_level">
              <!-- 使用elementui提供的图标 -->
                <el-radio-group v-model="AddCategoryForm.category_level">
                <el-radio :label="0">一级分类</el-radio>
                <el-radio :label="1">二级分类</el-radio>
                <el-radio :label="2">三级分类</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCategoryVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCategory">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      categorylist: [],
      queryinfo: {
        page: 1,
        page_size: 10,
        order_by: ['created_at', 'id']
      },
      total: 0,
      AddCategoryForm: {},
      addCategoryVisible: false,
      rules: {
        // 表单验证规则
        category_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        category_desc: [
          { required: true, message: '请输入分类描述', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addCategoryDialogClose () {
      this.addCategoryVisible = false
    },
    showAddCategoryDialog () {
      this.addCategoryVisible = true
    },
    async addCategory () {
      const ret = await this.$http.post('api/categories/', this.AddCategoryForm)
      if (ret.status !== 201) return this.$message.error('新建失败')
      this.$message.success('新建分类成功')
      this.getRoleList()
      this.addCategoryVisible = false
    },
    async getCategoryList () {
      // 获取分类列表
      const ret = await this.$http.get('api/categories/', { params: this.queryinfo })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.categorylist = ret.data.items
      console.log(ret.data)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
