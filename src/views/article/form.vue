<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky className="sub-navbar" :zIndex="3">
          <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'create-form'}">
            <el-button type="info">创建form</el-button>
          </router-link>

          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
          </el-button>
          <el-button v-loading="loading" type="warning" @click="draftForm">存草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类:" class="postInfo-container-item">
              <el-select style="width:80%;" v-model="typeids" multiple filterable remote reserve-keyword placeholder="请选择分类" :remote-method="getRemoteTypeList" :loading="loading">
                <el-option v-for="item in typeListOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签:" class="postInfo-container-item">
              <el-tag :key="tag" v-for="tag in tagnames" closable :disable-transitions="false" @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="editor-container">
            <mavon-editor style="min-height:500px;z-index:1;" v-model="postForm.content" :external_link="false"></mavon-editor>
        </div>
      </div>
    </el-form>

  </div>
</template>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

<script>
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import MDinput from '@/components/MDinput' // 标题input组件
import Sticky from '@/components/Sticky' // 粘性header组件
import mavonEditor from 'mavon-editor' // Markdown编辑器
import 'mavon-editor/dist/css/index.css' // Markdown编辑器
import { fetchArticle, createArticle, draftArticle, updateArticle } from '@/api/article'
import { searchMeta } from '@/api/meta'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  id: undefined,
  allowComment: false // 是否可以评论
}

export default {
  name: 'articleDetail',
  components: { MDinput, Multiselect, Sticky, 'mavon-editor': mavonEditor.mavonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入标题'))
      } else {
        callback()
      }
    }
    return {
      inputVisible: false,
      typeids: [],
      tagnames: [],
      inputValue: '',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      typeListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.getRemoteTypeList()
    const articleid = this.$route.query.id
    if (typeof (articleid) === 'undefined') {
      this.postForm = Object.assign({}, defaultForm)
    } else {
      this.fetchData(articleid)
    }
  },
  methods: {
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.tagnames.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(tag) {
      this.tagnames.splice(this.tagnames.indexOf(tag), 1)
    },
    fetchData(id) {
      fetchArticle(id).then(data => {
        if (data) {
          data.typeSet.forEach(element => {
            this.typeids.push(element.id)
          })
          data.tagSet.forEach(element => {
            this.tagnames.push(element.name)
          })
          this.postForm = data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (typeof (this.postForm.id) === 'undefined') {
            createArticle(this.postForm, this.typeids, this.tagnames).then(() => {
              this.$message({
                type: 'success',
                message: '发布成功!',
                showClose: true,
                duration: 1000
              })
              this.loading = false
            })
          } else {
            updateArticle(this.postForm, this.typeids, this.tagnames).then(() => {
              this.$message({
                type: 'success',
                message: '发布成功!',
                showClose: true,
                duration: 1000
              })
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.loading = true
      draftArticle(this.postForm, this.typeids, this.tagnames).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功!',
          showClose: true,
          duration: 1000
        })
        this.loading = false
      })
    },
    getRemoteTypeList(query) {
      searchMeta(query).then(data => {
        if (!data) return
        this.typeListOptions = data.map(v => ({
          id: v.id,
          name: v.name
        }))
      })
    //   userSearch(query).then(response => {
    //     if (!response.data.items) return
    //     console.log(response)
    //     this.userLIstOptions = response.data.items.map(v => ({
    //       key: v.name
    //     }))
    //   })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
  }
  .multiselect {
    z-index: 2;
  }
</style>
