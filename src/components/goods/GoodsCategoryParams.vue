<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
        <div >
          <!-- 展示警告 -->
            <el-alert
              title="注意：只能为3级分类添加分类参数"
              show-icon
              :closable='false'
              type="warning">
            </el-alert>
          <el-row :gutter="20">
              <el-col >
                <span class="">选择商品分类:</span>
                <el-cascader
                  v-model="category"
                  clearable
                  :show-all-levels='false'
                  :options="parentlist"
                  :props="cascaderProps"
                  @change="handleChange">
                  <!-- options 指定数据源 -->
                  <!-- props 指定配置对象 -->
                </el-cascader>
              </el-col>
          </el-row>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button type='primary' size="mini" :disabled="addBtnDisabled" @click="showAddDialog">添加参数</el-button>
              <el-table :data="manyattributeslist" border stripe highlight-current-row>
                <el-table-column type='expand'>
                  <template slot-scope="scope">
                    <div>
                      <!-- {{scope.row}} -->
                      <el-tag
                        :key="index"
                        v-for="(value, index) in scope.row.attribute_values"
                        closable
                        :disable-transitions="false"
                        @close="handleInputClose(index, scope.row)">
                        {{value}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="addValueInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ Add Value</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column type='index'></el-table-column>
                <el-table-column label="参数名称" prop="attribute_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <div>
                      <!-- {{scope.row}} -->
                      <el-button type="primary" icon="el-icon-setting" size="mini" @click="showModDialog(scope.row)"></el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttribute(scope.row)"></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <el-button type='primary' size="mini" :disabled="addBtnDisabled" @click="showAddDialog">添加属性</el-button>
              <el-table :data="onlyattributeslist" border stripe highlight-current-row>
                <el-table-column type='expand'>
                  <template slot-scope="scope">
                    <div>
                      <!-- {{scope.row}} -->
                      <el-tag
                        :key="index"
                        v-for="(value, index) in scope.row.attribute_values"
                        closable
                        :disable-transitions="false"
                        @close="handleInputClose(index, scope.row)">
                        {{value}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="addValueInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ Add Value</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column type='index'></el-table-column>
                <el-table-column label="属性名称" prop="attribute_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <div>
                      <!-- {{scope.row}} -->
                      <el-button type="primary" icon="el-icon-setting" size="mini"  @click="showModDialog(scope.row)"></el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="delAttribute(scope.row)"></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>

        </div>
    </el-card>
    <!-- 添加参数对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addAttributeVisible" width="50%" @close="addAttributeDialogClose">
          <el-form ref="addAttributeFormRef" label-width="100px" class="add_form" :model="AddAttributeForm" :rules='rules'>
          <!-- 属性/参数名称 -->
            <el-form-item label="参数名：" prop="attribute_name">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="分类名称" v-model="AddAttributeForm.attribute_name" :disabled="false"></el-input>
            </el-form-item>
            <!-- 添加方式 -->
            <el-form-item label="添加方式：" prop="attribute_write">
              <el-radio-group v-model="AddAttributeForm.attribute_write">
                <el-radio label="manual">手动</el-radio>
                <el-radio label="list">列表选择</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addAttributeVisible = false">取 消</el-button>
            <el-button type="primary" @click="addAttribute">确 定</el-button>
          </div>
      </el-dialog>
    <!-- 修改参数对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="modAttributeVisible" width="50%" @close="modAttributeVisible = false">
          <el-form ref="modAttributeFormRef" label-width="100px" class="add_form" :model="ModAttributeForm" :rules='rules'>
          <!-- 属性/参数名称 -->
            <el-form-item label="参数名：" prop="attribute_name">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="分类名称" v-model="ModAttributeForm.attribute_name" :disabled="false"></el-input>
            </el-form-item>
            <!-- 添加方式 -->
            <el-form-item label="添加方式：" prop="attribute_write">
              <el-radio-group v-model="ModAttributeForm.attribute_write">
                <el-radio label="manual">手动</el-radio>
                <el-radio label="list">列表选择</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="modAttributeVisible = false">取 消</el-button>
            <el-button type="primary" @click="modAttribute">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      addAttributeVisible: false,
      AddAttributeForm: {},
      modAttributeVisible: false,
      ModAttributeForm: {},
      // inputVisible: false,
      // inputValue: '',
      attributeValues: [],
      activeName: 'many',
      parentlist: [],
      onlyattributeslist: [],
      manyattributeslist: [],
      category: '',
      queryinfor: {
        page: 1,
        page_size: 10,
        order_by: ['created_at', 'id'],
        type: 1,
        attribute_sel: ''
      },
      total: 0,
      cascaderProps: {
        value: 'id',
        label: 'category_name',
        children: 'children_p',
        expandTrigger: 'hover'
      },
      rules: {
        // 表单验证规则
        attribute_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getParentList () {
      const ret = await this.$http.get('api/categories/', { params: this.queryinfor })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.parentlist = ret.data.items
      console.log(ret.data)
    },
    async getAttributes () {
      //  控制只能选择3级分类
      if (this.category.length !== 3) {
        this.category = []
        // fix 切换选中项为2级时, 表格中数据依旧保留
        this.onlyattributeslist = []
        this.manyattributeslist = []
        return
      }
      this.queryinfor.attribute_sel = this.activeName
      const ret = await this.$http.get(`api/categories/${this.category_id}/attributes/`, { params: this.queryinfor })
      if (ret.status !== 200) return this.$message.error('获取失败')

      ret.data.items.forEach(item => {
        item.attribute_values = item.attribute_values ? item.attribute_values.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'only') {
        this.onlyattributeslist = ret.data.items
      } else {
        this.manyattributeslist = ret.data.items
      }

      console.log(this.activeName)
      console.log(ret.data)
      console.log('only:', this.onlyattributeslist)
      console.log('many:', this.manyattributeslist)
    },
    addAttribute () {
      this.$refs.addAttributeFormRef.validate(async valid => {
        if (!valid) return
        this.AddAttributeForm.attribute_sel = this.activeName
        this.AddAttributeForm.attribute_write = 'list'
        this.AddAttributeForm.attribute_values = ''
        const ret = await this.$http.post(`api/categories/${this.category_id}/attributes/`, this.AddAttributeForm)
        if (ret.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getAttributes()
        this.addAttributeVisible = false
      })
    },
    addAttributeDialogClose () {
      this.$refs.addAttributeFormRef.resetFields()
      this.addAttributeVisible = false
    },
    showAddDialog () {
      this.addAttributeVisible = true
    },
    async showModDialog (attribute) {
      const ret = await this.$http.get(`api/categories/${this.category_id}/attributes/${attribute.id}/`)
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.ModAttributeForm = ret.data
      this.modAttributeVisible = true
      console.log(ret.data)
    },
    async modAttribute () {
      const ret = await this.$http.put(`api/attributes/${this.ModAttributeForm.id}/`, {
        attribute_name: this.ModAttributeForm.attribute_name,
        attribute_sel: this.ModAttributeForm.attribute_sel,
        attribute_write: this.ModAttributeForm.attribute_write,
        attribute_values: this.ModAttributeForm.attribute_values
      })
      if (ret.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      this.modAttributeVisible = false
      this.getAttributes()
      console.log(ret.data)
    },
    async delAttribute (attributeInfor) {
      const confirm = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => {
        return err
      })
      // 如果用户点击确认，返回confirm的值为"confirm",点击取消则返回"cancel"
      if (confirm !== 'confirm') return this.$message.info('已取消删除操作')
      const ret = await this.$http.delete(`api/attributes/${attributeInfor.id}/`)
      if (ret.status !== 204) return this.$message.error('删除属性失败')
      this.$message.info('删除属性成功')
      this.getAttributes()
    },
    handleChange () {
      this.getAttributes()
      console.log(this.category)
    },
    handleClick () {
      this.getAttributes()
      console.log(this.activeName)
    },
    showInput (attribute) {
      // fix 联动
      // this.inputVisible = true
      attribute.inputVisible = true
      // 自动获取焦点
      // this.$refs.addValueInput.focus()
      // $nextTick方法，当页面重新渲染后，才执行回调函数（防止获取的元素不存在）
      this.$nextTick(_ => {
        this.$refs.addValueInput.$refs.input.focus()
      })
    },
    handleInputConfirm (attribute) {
      //  判断是输入框中内容是否为空，为空则重置
      if (attribute.inputValue.trim().length === 0) {
        attribute.inputVisible = false
        attribute.inputValue = ''
        return
      }
      attribute.attribute_values.push(attribute.inputValue.trim())
      attribute.inputVisible = false
      attribute.inputValue = ''
      this.addValues(attribute)
    },
    handleInputClose (index, attribute) {
      console.log(index, attribute)
      attribute.attribute_values.splice(index, 1)
      this.addValues(attribute)
    },
    async addValues (attribute) {
      // 将修改保存至数据库中
      const ret = await this.$http.put(`api/attributes/${attribute.id}/`, {
        attribute_name: attribute.attribute_name,
        attribute_sel: attribute.attribute_sel,
        attribute_write: attribute.attribute_write,
        attribute_values: attribute.attribute_values.join(' ')
      })
      if (ret.status !== 200) return this.$message.error('操作失败')
      this.$message.info('操作成功')
      console.log(attribute.inputValue)
    }
  },
  created () {
    this.getParentList()
  },
  computed: {
    addBtnDisabled () {
      // 添加按钮是否可用
      if (this.category.length !== 3) {
        return true
      }
      return false
    },
    category_id () {
      // category id
      if (this.category.length === 3) {
        return this.category[this.category.length - 1]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  margin: 10px 0;
}
.el-cascader{
  margin-left: 15px;
}
.el-tag{
  margin: 0px 10px;
}

</style>
