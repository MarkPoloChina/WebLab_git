<template>
  <div>
    <el-table :data="tableData" style="width: 100%; min-height: 400px">
      <el-table-column prop="Id" label="ID" width="60" />
      <el-table-column prop="Title" label="Title" width="180" />
      <el-table-column prop="PublishedIn" label="PublishedIn" />
      <el-table-column prop="Authors" label="Authors"> </el-table-column>
      <el-table-column prop="Link" label="Link">
        <template #default="scope">
          <el-link :href="scope.row.Link" v-if="scope.row.Link != ''"
            >Link</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="Code" label="Code">
        <template #default="scope">
          <el-link :href="scope.row.Code" v-if="scope.row.Code != ''"
            >Code</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="Pdf" label="PDF">
        <template #default="scope">
          <el-link :href="scope.row.Pdf" v-if="scope.row.Pdf != ''"
            >PDF</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="PublishedAt" label="PublishedAt">
        <template #default="scope">
          {{ new Date(scope.row.PublishedAt).toLocaleDateString() }}
        </template>
      </el-table-column>
      <el-table-column prop="State" label="State">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.State == 1">公开</el-tag>
          <el-tag type="info" v-if="scope.row.State == 0">不公开</el-tag>
          <el-tag type="primary" v-if="scope.row.State == 3">精选</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="110">
        <template #default="scope">
          <el-popconfirm
            title="Are you sure to delete this?"
            @confirm="handleDelete(scope.row.Id)"
          >
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="totalPage"
        :page-size="config.pageLimit"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import config from "../../api/config";
import { Publications } from "../../api/api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const emit = defineEmits(["edit"]);
const tableData = reactive([]);
const currentPage = ref(1);
const totalPage = ref(config.pageLimit);

watch(currentPage, () => {
  getPublications();
});
onMounted(() => {
  getPublications();
});
const handleEdit = (obj) => {
  emit("edit", obj);
};
const handleDelete = async (id) => {
  if (await Publications.deletePublication(id)) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    currentPage.value = 1;
    getPublications();
  }
};
const getPublications = async () => {
  getPage();
  tableData.length = 0;
  let data = await Publications.getAllPublications(
    currentPage.value,
    config.pageLimit,
    (err) => {
      if (err.response.status === 401) {
        ElMessage.error("请重新登录");
        store.commit("clearToken");
        router.push("/login");
      } else ElMessage.error("网络错误");
    }
  );
  if (data)
    data.forEach((publication) => {
      tableData.push(publication);
    });
};

const getPage = async () => {
  let data = await Publications.getAllPublicationsCount();
  if (data) totalPage.value = data.Count;
};
defineExpose({ getPublications });
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
