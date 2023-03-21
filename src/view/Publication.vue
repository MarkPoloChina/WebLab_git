<template>
  <div class="container">
    <div class="title">Publications</div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Selective" name="selected">
        <PublicationCell
          :table-data="tableDataSelected"
          @next-load="loadSelected"
        ></PublicationCell>
      </el-tab-pane>
      <el-tab-pane label="List" name="list">
        <el-tabs v-model="activeYear">
          <el-tab-pane
            :label="year"
            :name="year"
            v-for="year in yearList"
            :key="year"
            lazy
          >
            <PublicationCell
              :table-data="tableDataList.value[year]"
            ></PublicationCell>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="Private" name="private" v-if="store.state.token" lazy>
        <PublicationCell
          :table-data="tableDataPrivate"
          @next-load="loadPrivate"
        ></PublicationCell>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { onMounted, reactive, ref } from "vue";
import { Publications } from "../api/api";
import config from "../api/config";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import PublicationCell from "../components/publications/PublicationCell.vue";

const store = useStore();
const router = useRouter();

const tableDataSelected = reactive([]);
const tableDataPrivate = reactive([]);
const yearList = ref([]);
const tableDataList = reactive({ value: {} });
const activeName = ref("selected");
const activeYear = ref("2023");
const pageSelected = ref(1);
const pagePrivate = ref(1);
const loadSelected = () => {
  if (pageSelected.value != -1) {
    pageSelected.value++;
    getSelectedData(pageSelected.value);
  }
};
const loadPrivate = () => {
  if (pagePrivate.value != -1) {
    pagePrivate.value++;
    getPrivateData(pagePrivate.value);
  }
};
onMounted(() => {
  getListData();
  getSelectedData();
  getPrivateData();
});
const getSelectedData = async (page = 1) => {
  let data = await Publications.getSelectedPublications(page, config.pageLimit);
  if (data) {
    if (data.length != 0)
      data.forEach((item) => {
        tableDataSelected.push(item);
      });
    else pageSelected.value = -1;
  }
};
const getListData = async () => {
  let data = await Publications.getPublicPublicationsYear();
  activeYear.value = data[0];
  yearList.value = data;
  data.forEach((year) => {
    tableDataList.value[year] = [];
  });
  Object.keys(tableDataList.value).forEach((year) => {
    pullDataByYear(year).then((data) => {
      tableDataList.value[year] = data;
    });
  });
};
const getPrivateData = async (page = 1) => {
  if (store.state.token) {
    let data = await Publications.getPrivatePublications(
      page,
      config.pageLimit,
      (err) => {
        if (err.response.status === 401) {
          ElMessage.error("请重新登录");
          store.commit("clearToken");
          router.push("/login");
        } else ElMessage.error("网络错误");
      }
    );
    if (data) {
      if (data.length != 0)
        data.forEach((item) => {
          tableDataPrivate.push(item);
        });
      else pagePrivate.value = -1;
    }
  }
};
const pullDataByYear = async (year) => {
  let data = await Publications.getPublicPublicationsByYear(1, 1000, year);
  if (data) {
    return data;
  }
};
</script>

<style scoped>
.container {
  padding: 0 400px 50px 400px;
}
.container .title {
  padding: 30px 0 20px 0;
  color: #24629c;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}
</style>
