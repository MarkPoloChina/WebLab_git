<template>
  <el-form label-width="100px" style="width: 100%">
    <el-form-item label="实验室介绍">
      <el-input
        v-model="configForm.introduction"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        clearable
      />
    </el-form-item>
    <el-form-item label="">
      <el-button
        @click="handleCommitConfig('introduction', configForm.introduction)"
        >提交</el-button
      >
    </el-form-item>
    <el-form-item label="老师-姓名">
      <el-input
        v-model="configForm.teacher.name"
        type="text"
        placeholder="姓名"
        clearable
      />
    </el-form-item>
    <el-form-item label="老师-简介">
      <el-input
        v-model="configForm.teacher.introduction"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        placeholder="简介"
        clearable
      />
    </el-form-item>
    <el-form-item label="老师-正文">
      <el-input
        v-model="configForm.teacher.content"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        placeholder="正文"
        clearable
      />
    </el-form-item>
    <el-form-item label="">
      <el-button @click="handleCommitConfig('teacher', configForm.teacher)"
        >提交</el-button
      >
    </el-form-item>
    <el-form-item label="项目介绍">
      <el-input
        v-model="configForm.projects[index]"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        clearable
        v-for="(item, index) in configForm.projects"
        :key="index"
      />
    </el-form-item>
    <el-form-item label="">
      <el-button @click="newItem('projects')">新增项目</el-button
      ><el-button @click="handleCommitConfig('projects', configForm.projects)"
        >提交</el-button
      >
    </el-form-item>
    <el-form-item label="新闻">
      <el-input
        v-model="configForm.news[index].content"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        clearable
        v-for="(item, index) in configForm.news"
        :key="index"
      />
    </el-form-item>
    <el-form-item label="">
      <el-button @click="newItem('news')">新增新闻</el-button
      ><el-button @click="handleCommitConfig('news', configForm.news)"
        >提交</el-button
      >
    </el-form-item>
    <el-form-item label="底栏-电话">
      <el-input
        v-model="configForm.contact.phone"
        type="text"
        placeholder="电话"
        clearable
      />
    </el-form-item>
    <el-form-item label="底栏-地址">
      <el-input
        v-model="configForm.contact.address"
        type="text"
        placeholder="地址"
        clearable
      />
    </el-form-item>
    <el-form-item label="底栏-邮编">
      <el-input
        v-model="configForm.contact.postcode"
        type="text"
        placeholder="邮编"
        clearable
      />
    </el-form-item>
    <el-form-item label="底栏-邮件">
      <el-input
        v-model="configForm.contact.email"
        type="text"
        placeholder="邮件"
        clearable
      />
    </el-form-item>
    <el-form-item label="底栏-期望">
      <el-input
        v-model="configForm.contact.hope"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        placeholder="期望"
        clearable
      />
    </el-form-item>
    <el-form-item label="底栏-成员">
      <el-input
        v-model="configForm.contact.people"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8 }"
        placeholder="人员"
        clearable
      />
    </el-form-item>
    <el-form-item label="">
      <el-button
        @click="handleCommitConfig('contact', configForm.contact)"
        style="margin-top: 10px"
        >提交</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive } from "vue";
import { Config } from "../../api/api";

const configForm = reactive({
  introduction: "",
  teacher: {
    name: "",
    introduction: "",
    content: "",
  },
  news: [],
  projects: [],
  contact: {
    phone: "",
    address: "",
    postcode: "",
    email: "",
    hope: "",
    people: "",
  },
});
onMounted(() => {
  getConfig();
});
const getConfig = () => {
  let enums = ["introduction", "teacher", "projects", "contact", "news"];
  enums.forEach((item) => {
    Config.getConfig(item).then((resp) => {
      configForm[item] = JSON.parse(resp.data.Value);
    });
  });
};
const newItem = (key) => {
  if (key == "projects") {
    if (configForm[key].length >= 5) {
      if (configForm[key][configForm[key].length - 1] == "") {
        configForm[key].length--;
        configForm[key].unshift("");
      } else ElMessage.error("项目数不能超过5个!请先清空最后一个文本框");
    } else configForm[key].unshift("");
  } else {
    if (configForm[key].length >= 5) {
      if (configForm[key][configForm[key].length - 1].content == "") {
        configForm[key].length--;
        configForm[key].unshift({ date: null, content: "" });
      } else ElMessage.error("项目数不能超过5个!请先清空最后一个文本框");
    } else configForm[key].unshift({ date: null, content: "" });
  }
};
const handleCommitConfig = (key, value) => {
  if (key == "news") {
    let _value = [];
    value.forEach((item) => {
      if (item.content != "")
        _value.push({
          date: item.date ? item.date : new Date().toLocaleDateString(),
          content: item.content,
        });
    });
    value = _value;
  }
  Config.setConfig(key, JSON.stringify(value))
    .then((resp) => {
      ElMessage({
        message: "提交成功",
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
</script>
<style scoped></style>
