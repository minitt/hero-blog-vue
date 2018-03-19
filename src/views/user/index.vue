<template>
  <div class="app-container">
    <div class="filter-container calendar-list-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"  placeholder="姓名" v-model="listQuery.screenName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="el-icon-edit">添加</el-button>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row 
      style="width: 100%" :default-sort = "{prop: 'id', order: 'descending'}" @sort-change="handleSortChange">
      <el-table-column align="center" label='序号' width="85">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{scope.row.screenName}}
        </template>
      </el-table-column>
      <el-table-column label="帐号" prop="username" width="110" align="center" sortable='custom'>
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="210" align="center">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createdTime" label="创建时间" width="200" sortable='custom'>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createdTime|timeFormatter}}</span>
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
import { getList } from '@/api/user'
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
        screenName: undefined,
        sort: 'id,asc'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(data => {
        this.list = data.content
        this.total = data.totalElements
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      if (this.listQuery.size === val) {
        return
      }
      this.listQuery.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.fetchData()
    },
    handleSortChange(val) {
      if (val.prop === null || val.prop === undefined) {
        this.listQuery.sort = 'id,asc'
      } else {
        this.listQuery.sort = formatSort(val)
      }
      this.fetchData()
    }
  },
  filters: {
    timeFormatter(cellValue) {
      return parseTime(cellValue)
    }
  }
}
</script>
