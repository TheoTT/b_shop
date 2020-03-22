<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <div>
        <el-form ref="LoginFormRef" label-width="0px" class="login_form" :model="LoginForm" :rules="rules">
          <!-- 用户名 -->
            <el-form-item prop="username">
              <!-- 使用elementui提供的图标 -->
              <el-input prefix-icon="el-icon-user-solid" placeholder="用户名" v-model="LoginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item  prop="password">
              <!-- 使用第三方导入的图标 -->
              <!-- <el-input prefix-icon="el-icon-lollipop" placeholder="请输入密码"></el-input> -->
              <el-input prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" v-model="LoginForm.password" show-password></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <!-- <el-button type="info" @click="restLoginForm(LoginFormRef)">重置</el-button> -->
              <el-button type="info" @click="restLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        // 表单验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    restLoginForm () {
      this.$refs.LoginFormRef.resetFields()
    },
    login () {
      this.$refs.LoginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // this.$http.post('login', {
        //   username: this.LoginForm.username,
        //   password: this.LoginForm.password
        // })
        // 可以直接将表单对象传入
        const ret = await this.$http.post('api/login/', this.LoginForm)
        // const ret = await this.$http.post('api/login/', {
        //   username: this.username,
        //   password: this.password
        // })
        // // console.log(ret.data)
        // 接收axios返回的data属性，并重命名为ret
        // const { data: ret } = await this.$http.post('login', this.LoginForm)
        // const { data: ret } = await this.$http.get('goods_list')
        console.log(ret)
        if (ret.status !== 201) return this.$message.error('登录失败' + ret.status)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', ret.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login_container{
  background-color: grey;
  height: 100%;
}
.login_box{
  background-color: aliceblue;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

}
.avater_box{
  width: 150px;
  height: 150px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

}
.btns{
  // 设置按钮居右尾部对齐
  display: flex;
  justify-content: flex-end;
}
.login_form{
  width: 100%;
  padding: 0 20px;
  position: absolute;
  bottom: 0;
  // 设置表单超出盒子
  box-sizing: border-box;
}
</style>
