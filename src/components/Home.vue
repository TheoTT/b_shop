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
      <el-button type='info' @click='logout'>Logout</el-button>

    </el-header>
  <el-container>
    <!-- <el-aside width="200px"> -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click='toggleCollapse'>
            <!-- 展开，收起菜单栏 -->
            <!-- <i class="el-icon-s-unfold"></i> -->
            |||
        </div>
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      :default-active="activePath"
      :router='true'
      :unique-opened="true"
      :collapse-transition="false"
      :collapse="isCollapse"
      active-text-color="#409EFF">
      <!-- <el-submenu :index='item.id' v-for="item in menulist" :key="item.id"> -->
      <el-submenu :index="item.path" v-for="item in menulist" :key="item.id">
        <template slot="title">
            <!-- 以及菜单图标 -->
          <i :class="iconlist[item.id]"></i>
          <!-- 一级菜单文字 -->
          <span>{{item.auth_name}}</span>
        </template>
        <!-- 二级菜单 -->
          <!-- <el-menu-item :index='subitem.id' v-for="subitem in item.children" :key='subitem.id'> -->
              <!-- 菜单栏实现路由导航 -->
          <el-menu-item
            @click="saveActivePath(subitem.path)"
            :index="subitem.path"
            v-for="subitem in item.children"
            :key='subitem.id'>
            <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subitem.auth_name}}</span>
            </template>
        </el-menu-item>

        <!-- <el-submenu index="1-1">
          <template slot="title">选项1</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu> -->
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
export default {
  data: function () {
    return {
      menulist: [],
      iconlist: {
        8: 'iconfont icon-users',
        9: 'iconfont icon-tijikongjian',
        10: 'iconfont icon-shangpin',
        11: 'iconfont icon-danju',
        12: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      // 获取菜单列表
      const ret = await this.$http.get('api/menus/')
      if (ret.status !== 200) return this.$message.error('获取失败')
      this.menulist = ret.data.items
      console.log(ret.data)
    },
    toggleCollapse () {
      // 侧边栏收起展开
      this.isCollapse = !this.isCollapse
    },
    saveActivePath (activePath) {
      window.sessionStorage.setItem('active_path', activePath)
      this.activePath = activePath
    }

  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('active_path')
  }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    // 竖直居中
    align-items: center;
    > div {
        display: flex;
        align-items: center;
    }
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
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.el-container{
    height: 100%;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #4A5064;
    // display: flex;
    // justify-content:flex-start
    // i{
    //     width: 24px;
    //     height: 24px;

    // }
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
