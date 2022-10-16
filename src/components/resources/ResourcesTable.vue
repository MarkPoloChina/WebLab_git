<template>
  <el-table
    :data="tableResourceData"
    style="width: 100%; min-height: 400px"
    stripe
  >
    <el-table-column prop="Id" label="Id" width="60" />
    <el-table-column prop="Title" label="Title" width="180" />
    <el-table-column prop="Description" label="Description" />
    <el-table-column prop="Link" label="Link">
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
    <el-table-column fixed="right" label="Operations">
      <template #default="scope">
        <el-popconfirm
          title="Are you sure to delete this?"
          @confirm="handleDeleteResource(scope.row.Id)"
        >
          <template #reference>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
        <el-button
          link
          type="primary"
          size="small"
          @click="emit('edit', scope.row)"
          >修改</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
      layout="prev, pager, next"
      :total="totalResourcePage"
      :page-size="config.pageLimit"
      v-model:current-page="currentResourcePage"
    />
  </div>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { Resource } from "../../api/api";
import config from "../../api/config";

const emit = defineEmits(["edit"]);
const tableResourceData = reactive([]);
const currentResourcePage = ref(1);
const totalResourcePage = ref(config.pageLimit);
watch(currentResourcePage, () => {
  getResources();
});
onMounted(() => {
  getResources();
});
const getResourcePage = () => {
  Resource.getResourceCount().then((resp) => {
    totalResourcePage.value = resp.data.Count;
  });
};
const getResources = () => {
  getResourcePage();
  tableResourceData.length = 0;

  Resource.getResource(currentResourcePage.value, config.pageLimit).then(
    (res) => {
      res.data.forEach((resource) => {
        tableResourceData.push(resource);
      });
    }
  );
};
const handleDeleteResource = (id) => {
  Resource.deleteResource(id)
    .then((res) => {
      if (res.status === 204)
        ElMessage({
          message: "删除成功",
          type: "success",
        });
      currentResourcePage.value = 1;
      getResources();
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
defineExpose({ getResources });
</script>
<style scoped>
.pagination {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
