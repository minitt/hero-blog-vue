<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <logo :isCollapse="isCollapse"></logo>
    <el-menu 
      :show-timeout="200"
      mode="vertical" 
      unique-opened 
      :default-active="$route.path" 
      :collapse="isCollapse" 
      background-color="#00142a" 
      text-color="hsla(0,0%,100%,.65)" 
      active-text-color="#409eff">
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import logo from './logo'

export default {
  components: { SidebarItem, ScrollBar, logo },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
