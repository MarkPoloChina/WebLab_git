<template>
  <div class="container">
    <div class="syspage">
      <div class="title">Login</div>
      <el-form :model="loginForm" label-width="50px" style="width: 100%">
        <el-form-item label="账号">
          <el-input
            v-model="loginForm.username"
            type="text"
            placeholder="请输入账号"
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="passwsord"
            placeholder="请输入密码"
            clearable
            show-password
            size="large"
          />
        </el-form-item>
      </el-form>
      <div class="btns">
        <div>
          <el-button
            @click="login"
            type="success"
            circle
            size="large"
            :icon="Select"
          ></el-button>
        </div>
        <div>
          <el-button
            @click="tohome"
            type="danger"
            circle
            size="large"
            :icon="ArrowLeftBold"
          ></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Select, ArrowLeftBold } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { IHS, Token } from "../api/api";

// 获取路由实例
const router = useRouter();
const route = useRoute();
const loginForm = reactive({
  username: "",
  password: "",
});

onMounted(() => {});
const store = useStore();
function login() {
  Token.login(loginForm.username, loginForm.password)
    .then((res) => {
      if (res.status === 201) {
        //登录成功

        // 判断登录权限，成功登录则则更改为success，用于publication中是否能够查看未上传论文
        store.commit("updateToken", res.data.Token);
        IHS.getToken()
          .then((res) => {
            if (res.status == 201) {
              store.commit("updateIHS", res.data.AccessToken);
              ElMessage({
                message: "登录成功",
                type: "success",
              });
              //登录成功，存储完token后则跳转到upload页面
              router.push({
                path: "/",
              });
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              ElMessage.error("用户名或密码错误");
              loginForm.password = "";
            } else ElMessage.error("网络错误");
          });
      }
    })
    .catch((error) => {
      if (error.response.status === 400) {
        ElMessage.error("用户名或密码错误");
        loginForm.password = "";
      } else ElMessage.error("网络错误");
    });
}

function tohome() {
  router.push({
    path: "/",
  });
}
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #24629c;
}
.lginput {
  width: 70%;
  margin-left: 15px;
}

.syspage {
  width: 400px;
  height: 550px;
  background-color: rgb(255, 255, 255);
  border-radius: 15px;
  padding: 70px 50px 70px 50px;
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 50px;
  font-weight: bolder;
  margin: 0 0 70px 0;
}
.btns {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 50px;
}
.btns div {
  margin-bottom: 30px;
}
</style>
