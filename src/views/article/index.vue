<template>
  <div class="app-container">
    <div class="filter-container calendar-list-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"  placeholder="标题" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" v-waves type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves type="primary" @click="handleCreate" icon="el-icon-edit">新增</el-button>
      <el-button class="filter-item" v-waves type="primary" @click="handleBatchDel" icon="el-icon-edit">批量删除</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row 
      style="width: 100%" :default-sort = "{prop: 'id', order: 'descending'}" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column align="center" label='#' width="55">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="文章标题">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="createdTime" width="180" align="center" sortable='custom'>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createdTime|timeFormatter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.hits}}
        </template>
      </el-table-column>
      <el-table-column label="所属分类" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.categories}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>
	  <el-table-column align="center" label="相关操作" width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" v-if="scope.row.id!=-1" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getArticleList, delArticle, delBatchArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime, formatSort } from '@/utils'

export default {
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: null,
      listQuery: {
        page: 1,
        size: 20,
        title: undefined,
        sort: 'id,desc'
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() { // 拉取数据
      this.listLoading = true
      getArticleList(this.listQuery).then(data => {
        this.list = data.content
        this.total = data.totalElements
        this.listLoading = false
      })
    },
    handleFilter() { // 搜索按钮事件
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSizeChange(val) { // 分页大小改变事件
      if (this.listQuery.size === val) {
        return
      }
      this.listQuery.size = val
      this.fetchData()
    },
    handleCurrentChange(val) { // 页码改变事件
      this.fetchData()
    },
    handleSortChange(val) { // 列排序事件
      if (val.prop === null || val.prop === undefined) {
        this.listQuery.sort = 'id,desc'
      } else {
        this.listQuery.sort = formatSort(val)
      }
      this.fetchData()
    },
    handleCreate() { // 新增按钮事件
      this.$router.push({ path: '/article/form', params: null })
    },
    handleUpdate(row) { // 修改按钮事件
    },
    handleDel(row) { // 删除按钮事件
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticle(row.id).then(() => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }, () => {
      })
    },
    handleBatchDel() { // 批量删除按钮事件
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择记录!'
        })
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idArr = []
        for (const s of this.multipleSelection) {
          idArr.push(s.id)
        }
        delBatchArticle(idArr).then(() => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }, () => {
        })
      })
    },
    handleSelectionChange(val) { // 列表多选事件
      this.multipleSelection = val
    }
  },
  filters: {
    timeFormatter(cellValue) {
      return cellValue != null ? parseTime(cellValue) : null
    }
  }
}
</script>
