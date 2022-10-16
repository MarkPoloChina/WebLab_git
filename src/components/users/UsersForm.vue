<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="用户名">
        <el-input
          v-model="uploadForm.Username"
          type="text"
          clearable
          :disabled="uploadForm.Id != null"
        />
      </el-form-item>
      <el-form-item label="姓名" v-if="!uploadForm.resetPw || !uploadForm.Id">
        <el-input v-model="uploadForm.Fullname" type="text" clearable />
      </el-form-item>
      <el-form-item label="密码" v-if="uploadForm.resetPw || !uploadForm.Id">
        <el-input v-model="uploadForm.Password" type="password" clearable />
      </el-form-item>
      <el-form-item
        label="管理员权限"
        v-if="!uploadForm.resetPw || !uploadForm.Id"
      >
        <el-switch v-model="uploadForm.IsAdmin" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visble = false">取消</el-button>
        <el-button type="primary" @click="upload">上传</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { User } from "../../api/api";

const visble = ref(false);
const editComparor = reactive({ value: null });
const emit = defineEmits(["update"]);
const uploadForm = reactive({
  Id: null,
  Username: "",
  Fullname: "",
  Password: "",
  IsAdmin: false,
  resetPw: false,
});

const upload = () => {
  if (!uploadForm.Id) newUser();
  else updateUser();
};
const clearUserUploadForm = () => {
  uploadForm.Id = null;
  uploadForm.Username = "";
  uploadForm.Password = "";
  uploadForm.Fullname = "";
  uploadForm.IsAdmin = false;
};
const newUser = async () => {
  if (
    await User.newUser({
      Username: uploadForm.Username,
      Password: uploadForm.Password,
      IsAdmin: uploadForm.IsAdmin,
      Fullname: uploadForm.Fullname,
    })
  ) {
    ElMessage({
      message: "上传成功",
      type: "success",
    });
    visble.value = false;
    emit("update");
  }
};
const updateUser = async () => {
  let list = [];
  if (uploadForm.resetPw)
    list = [{ op: "replace", path: `/Password`, value: uploadForm.Password }];
  else
    Object.keys(uploadForm).forEach((key) => {
      if (
        uploadForm[key] != editComparor.value[key] &&
        key != "resetPw" &&
        key != "Password"
      ) {
        list.push({
          op: "replace",
          path: `/${key}`,
          value: uploadForm[key],
        });
      }
    });
  if (await User.updateUser(uploadForm.Username, list)) {
    ElMessage({
      message: "上传成功",
      type: "success",
    });
    visble.value = false;
    emit("update");
  }
};
const handleUpload = (obj) => {
  clearUserUploadForm();
  if (obj) {
    if (obj.resetPw) {
      uploadForm.resetPw = true;
    } else {
      uploadForm.resetPw = false;
      editComparor.value = obj;
    }
    Object.keys(uploadForm).forEach((key) => {
      uploadForm[key] = obj[key];
    });
  }
  visble.value = true;
};

defineExpose({ handleUpload });
</script>
<style scoped></style>
