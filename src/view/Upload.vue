<template>
  <div class="container">
    <div class="title-block">
      <div class="title">Admin</div>
      <el-button
        class="btn"
        @click="handleSwitch"
        color="#24629c"
        plain
        v-if="activeName != 'config'"
        >新增</el-button
      >
    </div>
    <div class="content">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="Publications" name="publications">
          <PublicationsTable
            @edit="handleUploadPublications"
            ref="publicationsTable"
          ></PublicationsTable>
        </el-tab-pane>
        <el-tab-pane label="Resource" name="resource" lazy>
          <ResourcesTable
            @edit="handleUploadResources"
            ref="resourcesTable"
          ></ResourcesTable>
        </el-tab-pane>
        <el-tab-pane label="Config" name="config" lazy>
          <ConfigsForm></ConfigsForm>
        </el-tab-pane>
        <el-tab-pane label="Users" name="user" lazy>
          <UsersTable ref="usersTable"></UsersTable>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <PublicationsForm
    ref="publicationsForm"
    @update="publicationsTable.getPublications()"
  ></PublicationsForm>
  <ResourcesForm
    ref="resourcesForm"
    @update="resourcesTable.getResources()"
  ></ResourcesForm>
  <UsersForm ref="usersForm"></UsersForm>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";
import PublicationsTable from "../components/publications/PublicationsTable.vue";
import ResourcesForm from "../components/resources/ResourcesForm.vue";
import ResourcesTable from "../components/resources/ResourcesTable.vue";
import ConfigsForm from "../components/configs/ConfigsForm.vue";
import PublicationsForm from "../components/publications/PublicationsForm.vue";
import UsersTable from "../components/users/UsersTable.vue";
import UsersForm from "../components/users/UsersForm.vue";

// 获取路由实例
const router = useRouter();
const route = useRoute();
const store = useStore();
const activeName = ref("publications");
const resourcesForm = ref(null);
const resourcesTable = ref(null);
const publicationsForm = ref(null);
const publicationsTable = ref(null);
const usersForm = ref(null);
const usersTable = ref(null);

const handleUploadPublications = (obj = null) => {
  publicationsForm.value.handleUpload(obj);
};
const handleUploadResources = (obj = null) => {
  resourcesForm.value.handleUpload(obj);
};
const handleUploadUser = (obj = null) => {
  usersForm.value.handleUpload(obj);
};
const handleSwitch = () => {
  switch (activeName.value) {
    case "publications":
      handleUploadPublications();
      break;
    case "resource":
      handleUploadResources();
      break;
    case "user":
      handleUploadUser();
      break;
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto 20px auto;
  padding-right: 15px;
  padding-left: 15px;
}
.container .title-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container .title-block .title {
  padding: 20px 0 20px 0;
  color: #24629c;
  font-size: 35px;
  font-weight: bold;
}
:deep(.el-tabs__item.is-active) {
  color: #24629c;
}
:deep(.el-tabs__item:hover) {
  color: #24629c;
}
:deep(.el-tabs__active-bar) {
  background-color: #24629c;
}
.btn-top {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.btn-top div {
  margin: 10px 20px 40px 20px;
}

@media (min-width: 768px) {
  .container {
    width: 720px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 930px;
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1140px;
  }
}
</style>
