<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <div class="logout-btn">
      <el-button @click="logout">注销</el-button>
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

const visble = ref(false);
const uploadForm = reactive({
  Username: null,
  Fullname: "",
  OldPassword: "",
  NewPassword: "",
});
const handleUser = () => {
  visble.value = true;
};
const logout = () => {
  store.commit("clearToken");
  router.push("/");
};
const handlePatch = () => {};
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
