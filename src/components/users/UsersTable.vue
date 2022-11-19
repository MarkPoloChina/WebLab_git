<template>
  <el-table :data="tableData" style="width: 100%; min-height: 400px">
    <el-table-column prop="Id" label="Id" width="60" />
    <el-table-column prop="Username" label="用户名" width="180" />
    <el-table-column prop="Fullname" label="姓名" width="180" />
    <el-table-column prop="IsAdmin" label="用户组">
      <template #default="scope">
        <el-tag type="success" v-if="scope.row.IsAdmin">管理员</el-tag>
        <el-tag type="info" v-else>普通用户</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" width="180">
      <template #default="scope">
        <el-popconfirm
          title="Are you sure to delete this?"
          @confirm="handleDeleteUser(scope.row.Username)"
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
        <el-button
          link
          type="primary"
          size="small"
          @click="emit('edit', { ...scope.row, resetPw: true })"
          >重置密码</el-button
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
</template>
<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { User } from "../../api/api";
import config from "../../api/config";

const emit = defineEmits(["edit"]);
const tableData = reactive([]);
const currentPage = ref(1);
const totalPage = ref(config.pageLimit);
watch(currentPage, () => {
  getUsers();
});
onMounted(() => {
  getUsers();
});
const getUsersPage = async () => {
  let data = await User.getAllUsersCount();
  if (data) totalPage.value = data.Count;
};
const getUsers = async () => {
  getUsersPage();
  tableData.length = 0;

  let data = await User.getAllUsers(
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
    data.forEach((user) => {
      tableData.push(user);
    });
};
const handleDeleteUser = (username) => {
  User.deleteUser(username)
    .then((res) => {
      if (res.status === 204)
        ElMessage({
          message: "删除成功",
          type: "success",
        });
      currentResourcePage.value = 1;
      getUsers();
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
defineExpose({ getUsers });
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
