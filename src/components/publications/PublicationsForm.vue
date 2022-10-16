<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="标题">
        <el-input v-model="uploadForm.Title" type="text" clearable />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="uploadForm.Authors" type="text" clearable />
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="uploadForm.Link" type="text" clearable />
      </el-form-item>
      <el-form-item label="录用信息">
        <el-input v-model="uploadForm.Abstract" type="text" clearable />
      </el-form-item>
      <el-form-item label="是否公开">
        <el-switch v-model="isPublic" />
      </el-form-item>
      <el-form-item class="progress">
        <el-progress
          :percentage="progressImage"
          text-inside
          :stroke-width="24"
        />
      </el-form-item>
      <el-form-item label="图片上传">
        <el-upload
          v-model:file-list="ihs.imageFile"
          accept=".png,.jpg"
          drag
          :multiple="false"
          :limit="1"
          :auto-upload="false"
          :on-change="uploadImage"
          :on-remove="clearImage"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip v-if="uploadForm.Id">
            <div>如果不修改文件则不需要上传</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item class="progress">
        <el-progress :percentage="progressPdf" text-inside :stroke-width="24" />
      </el-form-item>
      <el-form-item label="PDF上传">
        <el-upload
          v-model:file-list="ihs.pdfFile"
          accept=".pdf"
          drag
          :multiple="false"
          :limit="1"
          :auto-upload="false"
          :on-change="uploadPdf"
          :on-remove="clearPdf"
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
import { computed, reactive, ref } from "vue";
import { IHS } from "../../api/api";
import { Publications } from "../../api/api";

const emit = defineEmits(["update"]);
const editComparor = reactive({ value: null });
const progressImage = ref(0);
const progressPdf = ref(0);
const isPublic = computed({
  get: () => uploadForm.State == 1,
  set: (val) => {
    if (val) uploadForm.State = 1;
    else uploadForm.State = 0;
  },
});
const visble = ref(false);
const uploadForm = reactive({
  Id: null,
  Title: "",
  Authors: "",
  Link: "",
  Abstract: "",
  State: 1,
  Thumbnail: "",
});
const ihs = reactive({
  imageFile: [],
  pdfFile: [],
});
const upload = () => {
  if (!uploadForm.Id) newPublication();
  else updatePublication();
};
const clearUploadForm = () => {
  progressImage.value = 0;
  progressPdf.value = 0;
  uploadForm.Id = null;
  uploadForm.Title = "";
  uploadForm.Authors = "";
  uploadForm.Link = "";
  uploadForm.Abstract = "";
  uploadForm.State = 1;
  uploadForm.Thumbnail = "";
  ihs.imageFile.length = 0;
  ihs.pdfFile.length = 0;
};
const uploadImage = (file) => {
  if (file.raw) {
    IHS.postFile(file.raw, progressImage)
      .then((res) => {
        if (res.status === 201) {
          ElMessage({
            message: "上传图片成功",
            type: "success",
          });
          uploadForm.Thumbnail = res.data.Url;
        }
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  }
};
const uploadPdf = (file) => {
  if (file.raw) {
    IHS.postFile(file.raw, progressPdf)
      .then((res) => {
        if (res.status === 201) {
          ElMessage({
            message: "上传PDF成功",
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
const clearImage = () => {
  uploadForm.Thumbnail = "";
  progressImage.value = 0;
};
const clearPdf = () => {
  ihs.pdf = "";
  progressPdf.value = 0;
};
const handleUpload = (obj) => {
  clearUploadForm();
  if (obj) {
    editComparor.value = obj;
    Object.keys(uploadForm).forEach((key) => {
      uploadForm[key] = obj[key];
    });
  }
  visble.value = true;
};
const newPublication = async () => {
  let data = {
    Title: uploadForm.Title,
    Abstract: uploadForm.Abstract,
    Authors: uploadForm.Authors,
    Thumbnail: uploadForm.Thumbnail,
    Link: uploadForm.Link,
    State: uploadForm.State,
  };
  if (await Publications.newPublication(data)) {
    ElMessage({
      message: "上传成功",
      type: "success",
    });
    visble.value = false;
    emit("update");
  }
};
const updatePublication = async () => {
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
  if (await Publications.updatePublication(uploadForm.Id, list)) {
    ElMessage({
      message: "修改成功",
      type: "success",
    });
    visble.value = false;
    emit("update");
  }
};
defineExpose({
  handleUpload,
});
</script>
<style scoped>
:deep(.progress .el-progress--line) {
  width: 100%;
}
</style>
