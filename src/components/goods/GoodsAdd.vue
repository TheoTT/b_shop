<template>
  <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
          <div class="text item">
            <!-- 展示警告 -->
            <el-alert
              title="添加商品信息"
              show-icon
              center
              :closable='false'
              type="warning">
            </el-alert>
            <!-- 将数字字符串转换为数字 ,直接用该字符串减去0 -->
            <el-steps :active="activeIndex - 0 " finish-status="success">
              <el-step title="基本信息" description="添加商品的基本信息"></el-step>
              <el-step title="商品参数" description="添加商品的参数"></el-step>
              <el-step title="商品属性" description="添加商品的属性"></el-step>
              <el-step title="商品图片" description="添加商品的图片"></el-step>
              <el-step title="商品描述" description="添加商品的描述"></el-step>
              <el-step title="完成" description="完成商品添加"></el-step>
            </el-steps>
            <!-- 只能form嵌套tabs 不能tabs嵌套form-->
            <el-form ref="addGoodsFormRef" label-width="100px" class="add_form" :model="AddGoodsForm" :rules='rules' label-position="top">
              <el-tabs v-model="activeIndex" @tab-click="handleClick" tabPosition="left" :before-leave="beforeTabLeave">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称：" prop="good_name">
                      <el-input prefix-icon="el-icon-user-solid" placeholder="商品名称" v-model="AddGoodsForm.good_name" :disabled="false"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格：" prop="good_price">
                      <el-input prefix-icon="el-icon-user-solid" placeholder="商品价格" v-model="AddGoodsForm.good_price" :disabled="false" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量：" prop="good_weight">
                      <el-input prefix-icon="el-icon-user-solid" placeholder="商品重量" v-model="AddGoodsForm.good_weight" :disabled="false" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量：" prop="good_number">
                      <el-input prefix-icon="el-icon-user-solid" placeholder="商品数量" v-model="AddGoodsForm.good_number" :disabled="false" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="添加方式：" prop="attribute_write">
                      <el-radio-group v-model="AddGoodsForm.attribute_write">
                        <el-radio label="manual">手动</el-radio>
                        <el-radio label="list">列表选择</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="商品分类">
                      <el-cascader
                        v-model="AddGoodsForm.category_id"
                        clearable
                        :options="categorylist"
                        :props="cascaderProps"
                        @change="handleChange">
                        <!-- options 指定数据源 -->
                        <!-- props 指定配置对象 -->
                      </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                  <el-form-item :label="item.attribute_name" v-for="item in manyattributeslist" :key="item.id">
                      <el-checkbox-group v-model="item.attribute_values">
                        <el-checkbox  border :label="value" v-for="(value, index) in item.attribute_values" :key=index></el-checkbox>
                      </el-checkbox-group>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                  <el-form-item :label="item.attribute_name" v-for="item in onlyattributeslist" :key="item.id">
                      <el-input placeholder="" v-model="item.attribute_values" :disabled="false"></el-input>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                  <el-upload
                    drag
                    :headers="headers"
                    :action="uploadURL"
                    name="photo"
                    multiple
                    show-file-list
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    list-type="picture">
                    <!-- action 需要绝对url -->
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10MB</div>
                  </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品描述" name="4">
                  <quill-editor v-model="AddGoodsForm.good_desc"></quill-editor>
                  <el-button class="addBtn" type="primary" @click="addGood">添加商品</el-button>
                </el-tab-pane>
              </el-tabs>
            </el-form>
            <!-- <el-row :gutter="20">
              <el-col :span="8">
                <el-input placeholder="请输入内容" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click='goAddPage'>添加</el-button>
              </el-col>
            </el-row> -->
          </div>
        </el-card>
          <el-dialog title="预览图片" :visible.sync="previewVisible" width="50%" @close="previewVisible = false">
            <img :src="previewPath" alt="" class="previewImg">
      </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data: function () {
    return {
      activeIndex: 0,
      AddGoodsForm: {
        good_name: '',
        good_price: 0.0,
        good_weight: 0.0,
        good_number: 0,
        category_id: [],
        photos: [],
        good_desc: '',
        attributes: [],
        hot_number: 0,
        good_state: 'UnderReview',
        is_promote: false
      },
      rules: {
        good_name: [
          {
            required: true, message: '请输入商品名称', trigger: 'blur'
          }
        ],
        good_price: [
          {
            required: true, message: '请输入商品价格', trigger: 'blur'
          }
        ],
        good_weight: [
          {
            required: true, message: '请输入商品重量', trigger: 'blur'
          }
        ],
        good_number: [
          {
            required: true, message: '请输入商品数量', trigger: 'blur'
          }
        ]
      },
      queryinfor: {
        page: 1,
        page_size: 100,
        order_by: ['created_at', 'id'],
        type: 1,
        attribute_sel: 'many'
      },
      total: 0,
      categorylist: [],
      categoryids: [],
      cascaderProps: {
        value: 'id',
        label: 'category_name',
        children: 'children_p',
        expandTrigger: 'hover'
      },
      onlyattributeslist: [],
      manyattributeslist: [],
      uploadURL: 'http://10.10.10.105:5000/api/goods/upload/',
      headers: {
        Authorization: 'JWT ' + window.sessionStorage.getItem('token')
      },
      previewVisible: false,
      previewPath: ''
    }
  },
  methods: {
    async getCategoryList () {
      // 获取分类列表
      const ret = await this.$http.get('api/categories/', { params: this.queryinfor })
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.categorylist = ret.data.items
      this.total = ret.data.total
      console.log(ret.data)
    },
    async handleClick () {
      if (this.activeIndex === '1') {
        this.queryinfor.attribute_sel = 'many'
        const ret = await this.$http.get(`api/categories/${this.selectedCategoryId}/attributes/`, { params: this.queryinfor })
        if (ret.status !== 200) return this.$message.error('获取失败')
        ret.data.items.forEach(item => {
          item.attribute_values = item.attribute_values ? item.attribute_values.split(' ') : []
        })
        this.manyattributeslist = ret.data.items
        console.log(ret.data)
      }
      if (this.activeIndex === '2') {
        this.queryinfor.attribute_sel = 'only'
        const ret = await this.$http.get(`api/categories/${this.selectedCategoryId}/attributes/`, { params: this.queryinfor })
        if (ret.status !== 200) return this.$message.error('获取失败')
        this.onlyattributeslist = ret.data.items
        console.log(ret.data)
      }
    },
    handleChange () {
      // 确认选择的分类等级为3
      if (this.AddGoodsForm.category_id.length !== 3) {
        this.AddGoodsForm.category_id = []
        return
      }
      console.log(this.AddGoodsForm)
    },
    beforeTabLeave (activeName, oldActiveName) {
      // tab 跳转条件设定
      //  activeName: 即将进入的tab的name, oldActiveName:即将离开的tab的name
      console.log(activeName, oldActiveName)
      if (oldActiveName === '0' && this.AddGoodsForm.category_id.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
      return true
    },
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.photo_url
      this.previewVisible = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      const photoName = file.response.photo_name
      const index = this.AddGoodsForm.photos.findIndex(photo => photo.photo_name === photoName)
      this.AddGoodsForm.photos.splice(index, 1)
      console.log(this.AddGoodsForm.photos)
    },
    handleSuccess (rsp, file, fileList) {
      console.log(rsp, rsp.data, file, fileList)
      this.AddGoodsForm.photos.push(rsp)
    },
    handleError (rsp, file, fileList) {
      console.log(rsp, file, fileList)
    },
    addGood () {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 深拷贝表单数据
        const form = _.cloneDeep(this.AddGoodsForm)
        // 处理分类
        form.category_id = this.selectedCategoryId
        // 处理动态参数
        this.manyattributeslist.forEach(item => {
          item.attribute_values.forEach(i => {
            i = i.trim()
          })
          const attribute = {
            id: item.id,
            attribute_values: item.attribute_values.join(' ')
          }
          form.attributes.push(attribute)
        })
        // 处理静态属性
        this.onlyattributeslist.forEach(item => {
          item.attribute_values.trim()
          const attribute = {
            id: item.id,
            attribute_values: item.attribute_values
          }
          form.attributes.push(attribute)
        })
        console.log(form)
        const ret = await this.$http.post('api/goods/', form)
        if (ret.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    // categorylist_s: function () {
    //   // 过滤用于展示的一级菜单
    //   return this.categorylist.filter(function (category) {
    //     if (category.children.length === 0) {
    //       delete category.children
    //       return category
    //     }
    //     category.children.forEach(children2 => {
    //       if (children2.children.length === 0) {
    //         delete children2.children
    //         return children2
    //       }
    //       children2.children.forEach(children3 => {
    //         if (children3.children.length === 0) {
    //           delete children3.children
    //           return children3
    //         }
    //         return children3
    //       })
    //       return children2
    //     })
    //     return category
    //   })
    // }
    selectedCategoryId: function () {
      if (this.AddGoodsForm.category_id.length === 3) {
        return this.AddGoodsForm.category_id[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-tab-pane{
  margin: 15px 0px;
}
.el-checkbox{
  // 上 右 下 左
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin: 15px 0 0 0;
}
</style>
