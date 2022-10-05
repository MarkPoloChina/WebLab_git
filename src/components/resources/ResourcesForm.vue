<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="标题">
        <el-input v-model="uploadForm.Title" type="text" clearable />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="uploadForm.Description"
          type="text"
          clearable
        />
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="uploadForm.Link" type="text" clearable />
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
import { Resource } from "../../api/api";

const visble = ref(false);
const editComparor = reactive({ value: null });
const emit = defineEmits(["update"]);
const uploadForm = reactive({
  Id: null,
  Title: "",
  Description: "",
  Link: "",
});

const upload = () => {
  if (!uploadForm.Id) newResource();
  else updateResource();
};
const clearResourceUploadForm = () => {
  uploadForm.Id = null;
  uploadForm.Link = "";
  uploadForm.Description = "";
  uploadForm.Title = "";
};
const newResource = () => {
  Resource.newResource({
    Title: uploadForm.Title,
    Description: uploadForm.Description,
    Link: uploadForm.Link,
  })
    .then((res) => {
      ElMessage({
        message: "上传成功",
        type: "success",
      });
      visble.value = false;
      emit("update");
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
const updateResource = () => {
  let list = [];
  Object.keys(uploadForm).forEach((key) => {
    if (uploadForm[key] != editComparor.value[key]) {
      list.push({
        op: "replace",
        path: `/${key}`,
        value: uploadForm[key],
      });
    }
  });
  Resource.updateResource(uploadForm.Id, list)
    .then((res) => {
      ElMessage({
        message: "上传成功",
        type: "success",
      });
      visble.value = false;
      emit("update");
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
const handleUpload = (obj) => {
  clearResourceUploadForm();
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
