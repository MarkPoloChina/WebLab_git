<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="用户名">
        <el-input v-model="uploadForm.Username" type="text" clearable />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="uploadForm.Password" type="password" clearable />
      </el-form-item>
      <el-form-item label="管理员权限">
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
  Password: "",
  IsAdmin: false,
});

const upload = () => {
  if (!uploadForm.Id) newUser();
  else updateUser();
};
const clearUserUploadForm = () => {
  uploadForm.Id = null;
  uploadForm.Username = "";
  uploadForm.Password = "";
  uploadForm.IsAdmin = false;
};
const newUser = async () => {
  if (
    await User.newUser({
      Username: uploadForm.Username,
      Password: uploadForm.Password,
      IsAdmin: uploadForm.IsAdmin,
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
const updateUser = () => {
  // let list = [];
  // Object.keys(uploadForm).forEach((key) => {
  //   if (uploadForm[key] != editComparor.value[key]) {
  //     list.push({
  //       op: "replace",
  //       path: `/${key}`,
  //       value: uploadForm[key],
  //     });
  //   }
  // });
  // Resource.updateResource(uploadForm.Id, list)
  //   .then((res) => {
  //     ElMessage({
  //       message: "上传成功",
  //       type: "success",
  //     });
  //     visble.value = false;
  //     emit("update");
  //   })
  //   .catch((err) => {
  //     ElMessage.error("网络错误");
  //   });
};
const handleUpload = (obj) => {
  clearUserUploadForm();
  if (obj) {
    editComparor.value = obj;
    Object.keys(uploadForm).forEach((key) => {
      uploadForm[key] = obj[key];
    });
  }
  visble.value = true;
};

defineExpose({ handleUpload });
</script>
<style scoped></style>
