<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="标题">
        <el-input v-model="uploadForm.Title" type="text" clearable />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="uploadForm.Description" type="text" clearable />
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="uploadForm.Link" type="text" clearable />
      </el-form-item>
      <el-form-item :label="uploadForm.Id ? '指向新文件' : '指向文件'">
        <el-switch v-model="uploadFormController.isFile" />
      </el-form-item>
      <el-form-item class="progress" v-if="uploadFormController.isFile">
        <el-progress
          :percentage="progressFile"
          text-inside
          :stroke-width="24"
        />
      </el-form-item>
      <el-form-item label="文件上传" v-if="uploadFormController.isFile">
        <el-upload
          v-model:file-list="uploadFormController.ihs"
          drag
          :multiple="false"
          :limit="1"
          :auto-upload="false"
          :on-change="uploadFile"
          :on-remove="clearFile"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip v-if="uploadForm.Id">
            <div>如果不修改文件则不需要上传</div>
          </template>
        </el-upload>
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
import { IHS, Resource } from "../../api/api";

const visble = ref(false);
const editComparor = reactive({ value: null });
const emit = defineEmits(["update"]);
const progressFile = ref(0);
const uploadForm = reactive({
  Id: null,
  Title: "",
  Description: "",
  Link: "",
});
const uploadFormController = reactive({
  isFile: false,
  ihs: [],
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
  uploadFormController.ihs = [];
  uploadFormController.isFile = false;
};
const uploadFile = (file) => {
  if (file.raw) {
    IHS.postFile(file.raw, progressFile)
      .then((res) => {
        if (res.status === 201) {
          ElMessage({
            message: "上传文件成功",
            type: "success",
          });
          uploadForm.Link = res.data.Url;
        }
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  }
};
const clearFile = () => {
  uploadForm.Link = "";
  progressFile.value = 0;
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
<style scoped>
:deep(.progress .el-progress--line) {
  width: 100%;
}
</style>
