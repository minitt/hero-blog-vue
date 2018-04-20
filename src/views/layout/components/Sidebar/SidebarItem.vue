<template>
  <div class="menu-wrapper">
    <div class="logo-con">
      <div v-show="sidebar.opened" class="text-center p-t-10" style="margin: 0 auto;">
        <div class="pull-left" style="padding-left: 10px;">
            <router-link to="/">
              <img :src="logoImg" key="max-logo" width="50" height="50" />
            </router-link>
        </div>
        <div class="pull-left" style="padding-left: 10px;">
            <span style="font-size: 28px; color: #ffffff; line-height: 50px;">HEIROU</span>
        </div>
      </div>
    </div>
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <router-link v-if="item.children.length===1 && !item.children[0].children && !item.alwaysShow" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import logoImg from '@/assets/images/logo.png'
import logoMinImg from '@/assets/images/logo-min.png'

export default {
  name: 'SidebarItem',
  data() {
    return {
      logoImg,
      logoMinImg
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  }
}
</script>
