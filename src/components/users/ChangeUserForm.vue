<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <div class="logout-btn">
      <el-button @click="logout" type="warning">注销</el-button>
    </div>
    <el-collapse>
      <el-collapse-item title="信息修改" name="1">
        <el-form :model="uploadForm" label-width="100px" style="width: 100%">
          <el-form-item label="姓名">
            <el-input v-model="uploadForm.Fullname" type="text" clearable />
          </el-form-item>
          <el-form-item label="">
            <el-button @click="handlePatch('Fullname', uploadForm.Fullname)"
              >更新</el-button
            >
          </el-form-item>
          <el-form-item label="旧密码">
            <el-input
              v-model="uploadForm.OldPassword"
              type="password"
              clearable
            />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
              v-model="uploadForm.NewPassword"
              type="password"
              clearable
            />
          </el-form-item>
          <el-form-item label="">
            <el-button
              @click="
                handlePatchPassword(
                  uploadForm.OldPassword,
                  uploadForm.NewPassword
                )
              "
              >更新</el-button
            >
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { User } from "../../api/api";

const store = useStore();
const router = useRouter();
const visble = ref(false);
const uploadForm = reactive({
  Id: null,
  Username: null,
  Fullname: "",
  OldPassword: "",
  NewPassword: "",
});
const handleUser = () => {
  if (store.state.userObj) {
    uploadForm.Id = store.state.userObj.Id;
    uploadForm.Username = store.state.userObj.Username;
    uploadForm.Fullname = store.state.userObj.Fullname;
  }
  visble.value = true;
};
const logout = () => {
  visble.value = false;
  store.commit("clearToken");
  router.push("/");
};
const handlePatch = async () => {
  let list = [
    {
      op: "replace",
      path: `/Fullname`,
      value: uploadForm.Fullname,
    },
  ];
  if (await User.updateUser(uploadForm.Username, list)) {
    ElMessage({
      message: "修改成功, 请重新登陆",
      type: "success",
    });
    visble.value = false;
    store.commit("clearToken");
    router.push("/login");
  }
};
const handlePatchPassword = async (oldpw, newpw) => {
  if (
    await User.changePassword(uploadForm.Username, oldpw, newpw, (err) => {
      if (err.response.status == 400) {
        ElMessage.error("原密码错误");
      }
    })
  ) {
    ElMessage({
      message: "改密成功, 请重新登录",
      type: "success",
    });
    visble.value = false;
    store.commit("clearToken");
    router.push("/login");
  }
};
defineExpose({ handleUser });
</script>
<style scoped>
.logout-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
:deep(.progress .el-progress--line) {
  width: 100%;
}
</style>
