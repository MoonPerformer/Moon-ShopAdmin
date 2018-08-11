<template>
    <div id="login">
        <el-form :model="form" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm" status-icon>
            <img src="../../assets/luna.gif" alt="">
            <el-form-item label="用户名" prop="username">
                <el-input  v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password" @keyup.enter.native="submitForm" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'change'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.formData.validate(vaild => {
        if (vaild) {
          axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success('登陆成功,欢迎您的到来')
              console.log(res.data)
              localStorage.setItem('shop_token', res.data.data.token)
              this.$router.push('home')
            } else {
              this.$message.error('用户名或密码错误')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.formData.resetFields()
    }
  }
}
</script>
<style lang='less'>
#login {
    background-color: rgba(12, 12, 27, 0.863);
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-form {
        width: 400px;
        margin: 200px auto;
        padding: 75px 40px 15px 40px;
        border-radius: 12px;
        background-color: #fff;
        position: relative;
        .el-button:nth-of-type(2) {
            margin-left: 50px;
        }
        img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            position: absolute;
            border: 2px solid #fff;
            top: -24%;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>
