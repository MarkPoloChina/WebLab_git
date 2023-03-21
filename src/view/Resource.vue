<template>
  <div class="container">
    <div class="title">Resource</div>
    <div class="content">
      <div class="pub-list" id="pub-list">
        <el-table :data="tableData" stripe class="pub-item">
          <el-table-column
            prop="Title"
            label="标题"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="Description"
            label="描述"
            width="400"
          ></el-table-column>
          <el-table-column prop="Link" label="链接">
            <template #default="scope">
              <el-link :href="scope.row.Link" v-if="scope.row.Link != ''"
                >Link</el-link
              >
            </template>
          </el-table-column>
          <el-table-column prop="CreatedAt" label="上传日期">
            <template #default="scope">
              {{ new Date(scope.row.CreatedAt).toLocaleString() }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="totalPage"
          :page-size="config.pageLimit"
          v-model:current-page="currentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { Resource } from "../api/api";
import config from "../api/config";
const tableData = reactive([]);
const totalPage = ref(1);
const currentPage = ref(1);
onMounted(() => {
  getResource();
});
watch(currentPage, () => {
  getResource();
});
const getResource = () => {
  getResourcePage();
  tableData.length = 0;
  Resource.getResource(currentPage.value, config.pageLimit).then((resp) => {
    resp.data.forEach((item) => {
      tableData.push(item);
    });
  });
};
const getResourcePage = () => {
  Resource.getResourceCount().then((resp) => {
    totalPage.value = resp.data.Count;
  });
};
</script>

<style scoped>
.container {
  padding: 0 400px 20px 400px;
}
.container .title {
  padding: 30px 0 20px 0;
  color: #24629c;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}
.pub-list {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  min-height: 500px;
}
.pagination {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.el-table__body) {
  border-spacing: 0px 6px !important;
}
:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  color: #24629c;
  cursor: pointer;
}
:deep(.el-table__header-wrapper) {
  font-size: 19px;
}
</style>
