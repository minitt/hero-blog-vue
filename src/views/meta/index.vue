<template>
  <div class="app-container">
    <div class="filter-container calendar-list-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"  placeholder="名称" v-model="listQuery.name">
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
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center" sortable='custom'>
        <template slot-scope="scope">
          {{scope.row.orderby}}
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-model="temp.type" label="category">分类</el-radio>
          <el-radio v-model="temp.type" label="tag">标签</el-radio>
        </el-form-item>
        <el-form-item label="排序" prop="orderby">
          <el-slider v-model="temp.orderby"></el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">新增</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getMetaList, createMeta, updateMeta, delMeta, delBatchMeta } from '@/api/meta'
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
        name: undefined,
        sort: 'id,desc'
      },
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        name: '',
        type: 'category',
        orderby: 0
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
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
      getMetaList(this.listQuery).then(data => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: 'category',
        orderby: 0
      }
    },
    handleCreate() { // 新增按钮事件
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) { // 修改按钮事件
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDel(row) { // 删除按钮事件
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const index = this.list.indexOf(row)
        // this.list.splice(index, 1)
        // this.total--
        delMeta(row.id).then(() => {
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
        delBatchMeta(idArr).then(() => {
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
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMeta(this.temp, this.temp.password).then(() => {
            // this.list.unshift(this.temp)
            // this.total++
            this.fetchData()
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateMeta(this.temp, this.temp.password).then(() => {
            // for (const v of this.list) {
            //   if (v.id === this.temp.id) {
            //     const index = this.list.indexOf(v)
            //     this.list.splice(index, 1, this.temp)
            //     break
            //   }
            // }
            this.fetchData()
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
        }
      })
    }
  },
  filters: {
    timeFormatter(cellValue) {
      return cellValue != null ? parseTime(cellValue) : null
    }
  }
}
</script>
