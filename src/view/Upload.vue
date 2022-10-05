<template>
  <div class="container">
    <div class="title">Upload</div>
    <div class="content">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="Publications" name="publications">
          <div class="btn-top">
            <div>
              <el-button @click="handleUploadPublications()">新增</el-button>
            </div>
            <div>
              <el-button @click="logout">退出</el-button>
            </div>
          </div>
          <PublicationsTable
            @edit="handleUploadPublications"
            ref="publicationsTable"
          ></PublicationsTable>
        </el-tab-pane>
        <el-tab-pane label="Resource" name="resource" lazy>
          <div class="btn-top">
            <div>
              <el-button @click="handleUploadResources()">新增</el-button>
            </div>
            <div>
              <el-button @click="logout">退出</el-button>
            </div>
          </div>
          <ResourcesTable
            @edit="handleUploadResources"
            ref="resourcesTable"
          ></ResourcesTable>
        </el-tab-pane>
        <el-tab-pane label="Config" name="config" lazy>
          <ConfigsForm></ConfigsForm>
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

// 获取路由实例
const router = useRouter();
const route = useRoute();
const store = useStore();
const activeName = ref("publications");
const resourcesForm = ref(null);
const resourcesTable = ref(null);
const publicationsForm = ref(null);
const publicationsTable = ref(null);

const logout = () => {
  store.commit("clearToken");
  router.push("/");
};
const handleUploadPublications = (obj = null) => {
  publicationsForm.value.handleUpload(obj);
};
const handleUploadResources = (obj = null) => {
  resourcesForm.value.handleUpload(obj);
};
</script>

<style scoped>
.container {
  margin: 0 auto 20px auto;
  padding-right: 15px;
  padding-left: 15px;
}
.container .title {
  padding: 30px 0 20px 0;
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
