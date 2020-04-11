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
          <tree-table
           :data="categorylist_s"
           :columns="columns"
           :selection-type="false"
           :expand-type='false'
           show-index
           index-text="#"
           border
           show-row-hover>
           <template slot="categoryLevel" slot-scope="scope">
              <div>
              <el-tag type="success" v-if="scope.row.category_level == 0">一级</el-tag>
              <el-tag type="info" v-else-if="scope.row.category_level == 1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </div>
           </template>
           <template slot="categoryOption" slot-scope="scope">
             <div>
              <el-button type="primary" icon="el-icon-setting" size="mini" @click="showModCategoryDialog(scope.row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCategory(scope.row)">删除</el-button>
             </div>
           </template>
          </tree-table>
          <!-- 分页导航区域 -->
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
            <el-form-item label="父级分类">
              <el-cascader
                v-model="parentids"
                clearable
                :options="parentlist"
                :props="cascaderProps"
                @change="handleChange">
                <!-- options 指定数据源 -->
                <!-- props 指定配置对象 -->
              </el-cascader>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCategoryVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCategory">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 修改分类对话框 -->
        <el-dialog title="修改分类" :visible.sync="modCategoryVisible" width="50%" @close="modCategoryDialogClose">
          <el-form ref="modCategoryFormRef" label-width="100px" class="mod_form" :model="ModCategoryForm" :rules='rules'>
          <!-- 角色名 -->
            <el-form-item label="分类名：" prop="category_name">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="分类名" v-model="ModCategoryForm.category_name" :disabled="false"></el-input>
            </el-form-item>
            <!-- 角色描述 -->
            <el-form-item label="描述：" prop="category_desc">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-receiving" placeholder="分类描述" v-model="ModCategoryForm.category_desc"></el-input>
            </el-form-item>
            <el-form-item label="Level：" prop="category_level">
              <!-- 使用elementui提供的图标 -->
                <el-radio-group v-model="ModCategoryForm.category_level">
                <el-radio :label="0">一级分类</el-radio>
                <el-radio :label="1">二级分类</el-radio>
                <el-radio :label="2">三级分类</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="modCategoryVisible = false">取 消</el-button>
            <el-button type="primary" @click="modCategory">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      categorylist: [],
      parentlist: [],
      parentids: '',
      queryinfo: {
        page: 1,
        page_size: 10,
        order_by: ['created_at', 'id'],
        type: 1
      },
      queryinfo_p: {
        page: 1,
        page_size: 100,
        order_by: ['created_at', 'id'],
        type: 1
      },
      total: 0,
      AddCategoryForm: {},
      ModCategoryForm: {},
      addCategoryVisible: false,
      modCategoryVisible: false,
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
      },
      columns: [
        {
          label: '分类名称',
          prop: 'category_name'
        },
        {
          label: '分类描述',
          prop: 'category_desc'
        },
        {
          label: '分类等级',
          prop: 'category_level',
          type: 'template',
          template: 'categoryLevel'
        },
        {
          label: '操作',
          type: 'template',
          template: 'categoryOption'
        }
      ],
      cascaderProps: {
        value: 'id',
        label: 'category_name',
        children: 'children_f',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    addCategoryDialogClose () {
      this.addCategoryVisible = false
    },
    modCategoryDialogClose () {
      this.modCategoryVisible = false
    },
    showAddCategoryDialog () {
      this.getParentList()
      this.addCategoryVisible = true
    },
    async getParentList () {
      const ret = await this.$http.get('api/categories/', { params: this.queryinfo_p })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.parentlist = ret.data.items
      console.log(ret.data)
    },
    async showModCategoryDialog (categoryInfor) {
      const ret = await this.$http.get(`api/categories/${categoryInfor.id}/`)
      if (ret.status !== 200) return this.$message.error('获取分类失败')
      this.ModCategoryForm = ret.data
      this.modCategoryVisible = true
    },
    async addCategory () {
      const ret = await this.$http.post('api/categories/', this.AddCategoryForm)
      if (ret.status !== 201) return this.$message.error('新建失败')
      this.$message.success('新建分类成功')
      this.getCategoryList()
      this.addCategoryVisible = false
    },
    async getCategoryList () {
      // 获取分类列表
      const ret = await this.$http.get('api/categories/', { params: this.queryinfo })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.categorylist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    async modCategory () {
      const ret = await this.$http.put(`api/categories/${this.ModCategoryForm.id}/`, this.ModCategoryForm)
      if (ret.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改分类成功')
      this.getCategoryList()
      this.modCategoryVisible = false
    },
    async delCategory (categoryInfor) {
      const confirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => {
        return err
      })
      // 如果用户点击确认，返回confirm的值为"confirm",点击取消则返回"cancel"
      if (confirm !== 'confirm') return this.$message.info('已取消删除操作')
      const ret = await this.$http.delete(`api/categories/${categoryInfor.id}/`)
      if (ret.status !== 204) return this.$message.error('删除分类失败')
      this.$message.info('删除分类成功')
      this.getCategoryList()
    },
    handleChange () {
      console.log(this.parentids)
      this.AddCategoryForm.parent_id = this.parentids[this.parentids.length - 1]
    },
    handleSizeChange (size) {
      console.log(size)
      this.queryinfo.page_size = size
      this.getCategoryList()
    },
    handleCurrentChange (page) {
      console.log(page)
      this.queryinfo.page = page
      this.getCategoryList()
    }
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    categorylist_s: function () {
      // 过滤用于展示的一级菜单
      return this.categorylist.filter(function (category) {
        if (category.category_level === 0) return category
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
