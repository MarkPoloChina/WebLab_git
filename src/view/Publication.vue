<template>
  <div class="container">
    <div class="title">Publications</div>
    <!-- <div style="width: 100%">
          <el-input
            v-model="input2"
            class="pinput"
            placeholder="Type something"
          >
            <template #suffix>
              <img
                class="searchbtn"
                src="\src\assets\picture\search.png"
                alt=""
              />
            </template>
          </el-input>
        </div> -->
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="Public" name="public">
        <div class="pub-list" v-infinite-scroll="load" v-if="ready">
          <div v-for="(item, index) in tableData" :key="index" class="tablediv">
            <img :src="item.Thumbnail" class="card-thumb" />
            <div class="card-words">
              <div>
                <div class="words-date">
                  {{ new Date(item.PublishedAt).toLocaleDateString() }}
                </div>
                <div class="words-title">
                  {{ item.Title }}
                </div>
                <div class="words-author">
                  {{ item.Authors }}
                </div>
                <div class="words-abs">
                  {{ item.Abstract }}
                </div>
              </div>
              <div class="words-bottom">
                <span v-if="item.Link && item.Link != ''"
                  >[<el-link class="words-lnk" :href="item.Link">LINK</el-link
                  >]</span
                >
                <span v-if="item.Pdf && item.Pdf != ''"
                  >[<el-link class="words-lnk" :href="item.Pdf">PDF</el-link
                  >]</span
                >
                <span v-if="item.Code && item.Code != ''"
                  >[<el-link class="words-lnk" :href="item.Code">Code</el-link
                  >]</span
                >
              </div>
            </div>
          </div>
        </div>
        <el-empty
          description="No Any Publication"
          v-if="tableData.length == 0"
        />
      </el-tab-pane>
      <el-tab-pane label="Private" name="private" v-if="store.state.token" lazy>
        <div class="pub-list" v-infinite-scroll="loadPrivate" v-if="ready">
          <div
            v-for="(item, index) in tableDataPrivate"
            :key="index"
            class="tablediv"
          >
            <img class="card-thumb" :src="item.Thumbnail" />
            <div class="card-words">
              <div>
                <div class="words-date">
                  {{ new Date(item.PublishedAt).toLocaleDateString() }}
                </div>
                <div class="words-title">
                  {{ item.Title }}
                </div>
                <div class="words-author">
                  {{ item.Authors }}
                </div>
                <div class="words-abs">
                  {{ item.Abstract }}
                </div>
              </div>
              <div class="words-bottom">
                <span class="words-lnk" v-if="item.Link && item.Link != ''"
                  >[<el-link :href="item.Link">LINK</el-link>]</span
                >
                <span class="words-lnk" v-if="item.Pdf && item.Pdf != ''"
                  >[<el-link :href="item.Pdf">PDF</el-link>]</span
                >
                <span class="words-lnk" v-if="item.Code && item.Code != ''"
                  >[<el-link :href="item.Code">Code</el-link>]</span
                >
              </div>
            </div>
          </div>
        </div>
        <el-empty
          description="No Any Publication"
          v-if="tableDataPrivate.length == 0"
      /></el-tab-pane>
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

const store = useStore();
const ready = ref(false);
const router = useRouter();

const tableData = reactive([]);
const tableDataPrivate = reactive([]);
const activeName = ref("public");

const page = ref(1);
const pagePrivate = ref(1);
const load = () => {
  page.value++;
  getData(page.value);
};
const loadPrivate = () => {
  pagePrivate.value++;
  getPrivateData(pagePrivate.value);
};
onMounted(() => {
  getData();
  getPrivateData();
  ready.value = true;
});
const getData = async (page = 1) => {
  let data = await Publications.getPublicPublications(page, config.pageLimit);
  if (data)
    data.forEach((item) => {
      tableData.push(item);
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
    if (data)
      data.forEach((item) => {
        tableDataPrivate.push(item);
      });
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
}
.tablediv {
  display: flex;
  margin-top: 25px;
  background-color: white;
  box-shadow: 0 1px 4px rgb(0 0 0 / 8%);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.09);
  padding: 10px 15px 10px 15px;
}
.card-thumb {
  flex-basis: 30%;
  flex-grow: 0;
  flex-shrink: 0;
  object-fit: cover;
}
.pub-list {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.card-words {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 0 0 30px;
}
.words-lnk {
  vertical-align: baseline;
}
.words-abs {
  font-style: oblique;
}
.words-title {
  font-size: 25px;
  font-weight: bold;
  margin: 5px 0 5px 0;
}
.words-author {
  font-size: 20px;
}
.words-date {
  color: rgba(0, 0, 0, 0.54);
}
.words-bottom {
  margin-top: 10px;
}
.words-bottom span {
  margin-right: 10px;
}
</style>
