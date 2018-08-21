<template>
<div id="add">
<!-- 步骤条 -->
<el-steps :active="active" finish-status="success">
  <el-step title="步骤 1" description="基本信息"></el-step>
  <el-step title="步骤 2" description="商品图片"></el-step>
  <el-step title="步骤 3" description="商品内容"></el-step>
</el-steps>
<!-- 竖行tab栏 -->
<el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
  <el-tab-pane label="基本信息" name="message">
    <el-form
    :model="addForm"
    ref="addForm"
    label-width="80px"
    :rules="rules">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="goods_cat">
        <el-cascader
          clearable
          :options="options"
          :props="props"
          change-on-select
          v-model="addForm.goods_cat">
        </el-cascader>
      </el-form-item>
      <el-form-item label="是否促销">
        <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
        <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
  </el-tab-pane>
  <el-tab-pane label="商品图片" name="pic">
    <el-upload
      class="upload-demo"
      action="http://localhost:8888/api/private/v1/upload"
      :headers="headers"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
  </el-tab-pane>
  <el-tab-pane label="商品内容" name="content">
    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
    <el-button type="primary" @click="addGoods">确定</el-button>
  </el-tab-pane>
</el-tabs>
</div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'message',
      active: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: true,
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id'
      },
      headers: {
        Authorization: localStorage.getItem('shop_token')
      },
      rules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '请选择商品分类', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // tab栏切换
    handleClick (tab) {
      this.active = +tab.index
    },
    // 下一步
    next (active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 上传图片成功
    handleSuccess (res) {
      if (res.meta.status === 200) {
        this.addForm.pics.push({pic: res.data.tmp_path})
      }
    },
    // 删除图片
    handleRemove (file) {
      let tmpPath = file.response.data.tmp_path
      let index = this.addForm.pics.findIndex(item => item.tmp_path === tmpPath)
      this.addForm.pics.splice(index, 1)
    },
    // 添加商品
    addGoods () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('goods', {
            ...this.addForm,
            goods_cat: this.addForm.goods_cat.join()
          })
          const {meta} = res.data
          if (meta.status === 201) {
            this.$router.push('goods')
            this.$message.success('商品添加成功!')
          } else {
            this.$message.error('商品添加失败!')
          }
        } else {
          this.$message.error('请输入必要内容!!')
          return false
        }
      })
    }
  },
  // 钩子函数
  async created () {
    const res = await this.axios.get('categories?type=3')
    const {meta, data} = res.data
    if (meta.status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less">
.quill-editor {
  background-color: rgba(232, 243, 247, 0.932);
}
.ql-editor {
  min-height: 300px;
}
</style>
