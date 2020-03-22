<template>
<el-container>
    <!-- 头部区域 -->
  <el-header>
      <div>
          <img src="../assets/logo.png" alt="">
          <span>
            电商后台管理系统
          </span>
      </div>
    </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 30px;
    span{
        margin: 10px;
    }
    img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #eaedf1;
}
.el-container{
    height: 100%;
}
</style>
