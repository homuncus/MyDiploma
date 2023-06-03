<template>
  <h2>Login</h2>
  <el-form :model="formData" label-position="right" size="large" :rules="validationRules" ref="form" status-icon>
    <el-form-item prop="email">
      <el-input v-model="formData.email" placeholder="E-mail" :prefix-icon="Message" autofocus></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input v-model="formData.password" type="password" placeholder="Password" :prefix-icon="Lock"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="login" :loading="loading">Login</el-button>
    </el-form-item>
  </el-form>
  <router-link to="signup">Dont have an account?</router-link>
</template>

<script lang="ts">
import processAxios from '@/services/AxiosProcessor'
import setHeaders from '@/services/SetAxiosHeaders'
import { useUserStore } from '@/stores';
import { Message, Lock } from '@element-plus/icons-vue'

export default {
  setup() {
    console.log(useUserStore());

    return {
      Message,
      Lock,
      validationRules: {
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
          }
        ],
        password: [
          { required: true, message: "Password is required", trigger: "blur" },
          {
            min: 5,
            message: "Password length should be at least 5 characters",
            trigger: "blur"
          }
        ]
      },
    }
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      loading: false
    };
  },
  methods: {
    async login() {
      this.loading = true;
      let valid = await this.$refs.form.validate();
      if (!valid) {
        this.loading = false;
        return;
      }

      await processAxios(async (axios, apiUrl) => {
        const response = await axios.post(`${apiUrl}/auth/login`, this.formData)
        const userStore = useUserStore();
        const { data } = response
        const token = data.access_token
        userStore.$patch(data);

        setHeaders({
          Authorization: `${token.type} ${token.token}`
        })

        const redirect = { name: this.$router.currentRoute.value.query.redirect?.toString() }
        this.$router.push(redirect || { name: 'workshops' })
      }, undefined, (msg) => msg.error('Check the e-mail or password and try again!'))
      this.loading = false;
    },
  },
};
</script>

<style scoped></style>