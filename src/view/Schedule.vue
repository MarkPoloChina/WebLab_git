<template>
  <div class="container">
    <div class="title-block">
      <div class="title">Schedule</div>
      <el-button
        class="btn"
        @click="scheduleForm.handleUpload()"
        color="#24629c"
        plain
        >新增</el-button
      >
    </div>
    <div class="content">
      <div class="pub-list" id="pub-list">
        <div
          class="search-block"
          v-if="store.state.userObj && store.state.userObj.IsAdmin"
        >
          <el-select
            v-model="userSearch"
            filterable
            placeholder="选择学生"
            style="width: 100%"
          >
            <el-option
              v-for="item in users"
              :key="item.Id"
              :label="item.Username + ' ' + item.Fullname"
              :value="item.Id"
            />
          </el-select>
        </div>
        <el-table :data="tableData" stripe class="pub-item">
          <el-table-column
            v-if="store.state.userObj && store.state.userObj.IsAdmin"
            prop="Username"
            label="用户名"
            width="180"
          ></el-table-column>
          <el-table-column
            v-if="store.state.userObj && store.state.userObj.IsAdmin"
            prop="Fullname"
            label="姓名"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="Title"
            label="标题"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="Description"
            label="描述"
            width="200"
          ></el-table-column>
          <el-table-column prop="From" label="开始日期">
            <template #default="scope">
              {{ new Date(scope.row.From).toLocaleString().substring(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column prop="To" label="截止日期">
            <template #default="scope">
              {{ new Date(scope.row.To).toLocaleString().substring(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column prop="Finished" label="状态">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.Finished">已完成</el-tag>
              <el-tag type="info" v-else>未完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Operations"
            width="180"
            v-if="!(store.state.userObj && store.state.userObj.IsAdmin)"
          >
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
              <el-popconfirm
                title="Are you sure to change this?"
                @confirm="handleFin(scope.row.Id, scope.row.Finished)"
              >
                <template #reference>
                  <el-button
                    link
                    :type="scope.row.Finished ? 'info' : 'success'"
                    size="small"
                    >{{
                      scope.row.Finished ? "标记未完成" : "标记完成"
                    }}</el-button
                  >
                </template>
              </el-popconfirm>
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
          @current-change="getSchedule()"
        />
      </div>
    </div>
    <ScheduleForm ref="scheduleForm" @update="getSchedule"></ScheduleForm>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
import config from "../api/config";
import { Schedule, User } from "../api/api";
import ScheduleForm from "../components/schedule/ScheduleForm.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const tableData = reactive([]);
const totalPage = ref(1);
const currentPage = ref(1);
const store = useStore();
const router = useRouter();
const scheduleForm = ref(null);
const userSearch = ref("");
const users = reactive([]);
onMounted(() => {
  getSchedule();
  getUsersWithoutLimit();
});
watch(userSearch, (val) => {
  if (store.state.userObj && store.state.userObj.IsAdmin) {
    currentPage.value = 1;
    if (val == "" || !val) {
      getSchedule();
    } else {
      getSchedule(val);
    }
  }
});
const getSchedule = async (filterId) => {
  getSchedulePage(filterId);
  tableData.length = 0;
  let data = null;
  if (store.state.userObj && store.state.userObj.IsAdmin) {
    if (!filterId)
      data = await Schedule.getAllSchedules(
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
    else
      data = await Schedule.getSchedulesByFilter(
        currentPage.value,
        config.pageLimit,
        filterId,
        (err) => {
          if (err.response.status === 401) {
            ElMessage.error("请重新登录");
            store.commit("clearToken");
            router.push("/login");
          } else ElMessage.error("网络错误");
        }
      );
  } else if (store.state.token) {
    data = await Schedule.getSelfSchedules(
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
  }
  if (data)
    data.forEach((user) => {
      tableData.push(user);
    });
};
const getSchedulePage = async (filterId) => {
  let data = null;
  if (store.state.userObj && store.state.userObj.IsAdmin)
    if (!filterId) data = await Schedule.getAllSchedulesCount();
    else data = await Schedule.getSchedulesByFilterCount(filterId);
  else if (store.state.token) data = await Schedule.getSelfSchedulesCount();
  if (data) totalPage.value = data.Count;
};
const handleFin = async (id, ori) => {
  let list = [
    {
      op: "replace",
      path: "/Finished",
      value: !ori,
    },
  ];
  if (await Schedule.updateSchedule(id, list)) {
    ElMessage({
      message: "修改成功",
      type: "success",
    });
    currentPage.value = 1;
    getSchedule();
  }
};
const handleEdit = (obj) => {
  scheduleForm.value.handleUpload(obj);
};
const handleDelete = async (id) => {
  if (await Schedule.deleteSchedule(id)) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    currentPage.value = 1;
    getSchedule();
  }
};
const getUsersWithoutLimit = async () => {
  if (store.state.userObj && store.state.userObj.IsAdmin) {
    let data = await User.getAllUsers(1, 10000, (err) => {
      if (err.response.status === 401) {
        ElMessage.error("请重新登录");
        store.commit("clearToken");
        router.push("/login");
      } else ElMessage.error("网络错误");
    });
    if (data)
      data.forEach((user) => {
        users.push(user);
      });
  }
};
</script>
<style scoped>
.container {
  padding: 0 400px 20px 400px;
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
.pagination {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pub-list {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  min-height: 500px;
}
.pub-list .search-block {
  margin-bottom: 10px;
}
</style>
