<template>
  <div class="mixin-components-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>系统配置</span>
          </div>
          <div style="margin-bottom:50px;">
            <el-form-item label="BLOG地址">
              <el-input v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="BLOG标题">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="keywords">
              <el-input v-model="form.keywords"></el-input>
            </el-form-item>
            <el-form-item label="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存设置</el-button>
            </el-form-item>
          </div>
        </el-card>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        url: '',
        title: '',
        keywords: '',
        description: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    }
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
</style>

