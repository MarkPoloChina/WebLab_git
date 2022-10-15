<template>
  <el-dialog v-model="visble" title="Uploader Form" width="70%">
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="标题">
        <el-input v-model="uploadForm.Title" type="text" clearable />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="uploadForm.Description" type="text" clearable />
      </el-form-item>
      <el-form-item label="起止日期">
        <el-date-picker
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          v-model="DateRange"
          placeholder="Pick a day"
        />
      </el-form-item>
      <el-form-item label="是否完成">
        <el-switch v-model="uploadForm.Finished" />
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
import { reactive, ref, computed } from "vue";
import { Schedule, User } from "../../api/api";

const visble = ref(false);
const editComparor = reactive({ value: null });
const emit = defineEmits(["update"]);
const uploadForm = reactive({
  Id: null,
  Title: "",
  Description: "",
  From: "",
  To: "",
  Finished: false,
});
const DateRange = computed({
  get: () => [
    uploadForm.From == "" ? "" : new Date(uploadForm.From),
    uploadForm.To == "" ? "" : new Date(uploadForm.To),
  ],
  set: (val) => {
    if (val[0]) uploadForm.From = new Date(val[0]).toISOString();
    if (val[1]) uploadForm.To = new Date(val[1]).toISOString();
  },
});
const upload = () => {
  if (!uploadForm.Id) newSchedule();
  else updateUser();
};
const clearScheduleUploadForm = () => {
  uploadForm.Id = null;
  uploadForm.Title = "";
  uploadForm.Description = "";
  uploadForm.From = "";
  uploadForm.To = "";
  uploadForm.Finished = false;
};
const newSchedule = async () => {
  if (
    await Schedule.newSchedule({
      ...uploadForm,
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
  Object.keys(uploadForm).forEach((key) => {
    if (uploadForm[key] != editComparor.value[key]) {
      list.push({
        op: "replace",
        path: `/${key}`,
        value: uploadForm[key],
      });
    }
  });
  if (await Schedule.updateSchedule(uploadForm.Id, list)) {
    ElMessage({
      message: "修改成功",
      type: "success",
    });
    visble.value = false;
    emit("update");
  }
};
const handleUpload = (obj) => {
  clearScheduleUploadForm();
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
