<template>
  <h2>Sign up</h2>
  <el-form :model="formData" label-position="right" size="large" :rules="validationRules" ref="form" status-icon>
    <el-form-item prop="username">
      <el-input v-model="formData.username" placeholder="Username" :prefix-icon="User" autofocus></el-input>
    </el-form-item>

    <el-form-item prop="email">
      <el-input v-model="formData.email" placeholder="E-mail" :prefix-icon="Message"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input v-model="formData.password" type="password" placeholder="Password" :prefix-icon="Lock"></el-input>
    </el-form-item>

    <el-form-item prop="confirmPassword">
      <el-input v-model="formData.confirmPassword" type="password" placeholder="Confirm password"
        :prefix-icon="Lock"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="signup" :loading="loading">Sign up</el-button>
    </el-form-item>
  </el-form>
  <router-link to="login">Have an account?</router-link>
</template>
  
<script lang="ts">
import notExists from '@/services/CheckResourseItemExists'
import processAxios from '@/services/AxiosProcessor'
import { RouterLink } from 'vue-router';
import { Message, Lock, User } from '@element-plus/icons-vue'

export default {
  setup() {
    return {
      Message,
      Lock,
      User,
      RouterLink
    }
  },
  data() {
    return {
      formData: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      loading: false,
      validationRules: {
        username: [
          {
            validator: (rule: any, value: any, callback: Function) => {
              if (!value) {
                return callback(new Error('Username is required'))
              }
              
              notExists('users', 'username', value, callback)
            },
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: "Email is required",
            trigger: "blur"
          },
          {
            type: 'email',
            message: "Email is not in correct format",
            trigger: "blur"
          },
          {
            validator: (rule: any, value: any, callback: Function) => {
              notExists('users', 'email', value, callback)
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: "Password is required", trigger: "blur" },
          {
            min: 5,
            message: "Password length should be at least 5 characters",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            validator: (rule: any, value: any, callback: Function) => {
              if (!value) {
                return callback(new Error('Password confirmation is required'))
              }
              if (value.length < 5) {
                return callback(new Error('Password length should be at least 5 characters'))
              }
              if (value !== this.formData.password) {
                return callback(new Error('Passwords don`t match'))
              }
              return callback()
            },
          }
        ]
      },
    };
  },
  methods: {
    async signup() {
      this.loading = true;
      let valid = await this.$refs.form.validate();
      if (!valid) {
        this.loading = false;
        return;
      }

      await processAxios(async (axios) => {
        await axios.post(`/auth/signup`, this.formData)
      }, (msg) => {
        msg.success('Account created successfully!');
        this.$router.push({ name: 'login' });
      },
        (msg) => msg.error('Check the credentials and try again!')
      )
      this.loading = false;
    },
  },
};
</script>
