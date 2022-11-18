<template>
  <!-- 一个for循环的新闻接口 -->
  <div class="become-agile" style="background: #f1f1f1">
    <div class="container">
      <h3>近日要闻</h3>
      <div style="padding-top: 25px">
        <div v-for="(item, index) in configData.news" :key="index" class="news">
          <div class="hnews">
            <span>{{ item.content }}</span>
          </div>
          <div class="hdate">{{ item.date }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="become-agile">
    <div class="container">
      <div class="col-md-6 become-agile-left">
        <img src="../assets/img/sign.jpg" alt="" class="img-responsive" />
      </div>
      <div class="col-md-6 become-agile-right">
        <h3>实验室简介</h3>
        <p>
          {{ configData.introduction }}
        </p>
      </div>
    </div>
  </div>
  <!-- //become -->
  <div class="become-agile">
    <div class="container">
      <div class="col-md-6 become-agile-right">
        <h3>{{ configData.teacher.name }}</h3>
        <div class="bectxt">
          {{ configData.teacher.introduction }}
        </div>
        <div style="font-size: 16px; color: #777777; margin-top: 20px">
          {{ configData.teacher.content }}
        </div>
      </div>
      <div class="col-md-6 become-agile-left">
        <img src="../assets/img/teacher.jpg" alt="" class="img-responsive" />
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <!-- agile -->
  <div class="agile">
    <div class="container">
      <div class="agile_right">
        <div class="col-md-4 list-left text-center">
          <span class="glyphicon" aria-hidden="true">1</span>
          <h4>Graph neural networks</h4>
          <p></p>
        </div>
        <div class="col-md-4 list-left text-center">
          <span class="glyphicon" aria-hidden="true">2</span>
          <h4>Active learning & Multi-view learning</h4>
          <p></p>
        </div>
        <div class="col-md-4 list-left text-center">
          <span class="glyphicon" aria-hidden="true">3</span>
          <h4>Computer vision</h4>
          <p></p>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <!-- //agile -->
  <!-- features -->
  <div class="features">
    <div class="container">
      <h3>近期项目</h3>
      <div
        class="bs-example bs-example-tabs"
        role="tabpanel"
        data-example-id="togglable-tabs"
      >
        <div id="myTabContent" class="tab-content">
          <div
            role="tabpanel"
            class="tab-pane fade in active"
            id="home"
            aria-labelledby="home-tab"
          >
            <div class="w3agile_tabs">
              <div class="col-md-7 w3agile_tab_left">
                <ul>
                  <li
                    v-for="(project, index) in configData.projects"
                    :key="index"
                  >
                    {{ project == "" ? "" : index + 1 }}.{{ project }}
                  </li>
                </ul>
              </div>
              <div
                class="col-md-5 w3agile_tab_right w3agile_tab_right1"
                style="margin: 0"
              >
                <img
                  src="../assets/img/labroom.jpg"
                  alt=" "
                  class="img-responsive"
                />
              </div>
              <div class="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- //features -->
  <!-- footer -->

  <!-- //footer -->

  <router-view></router-view>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { Config } from "../api/api";
const newsData = reactive([]);
const configData = reactive({
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
      configData[item] = JSON.parse(resp.data.Value);
    });
  });
};
</script>
<style scoped>
@import url("../assets/css/Home.css");

.bectxt {
  font-size: 18px;
  font-style: italic;
  font-weight: bold;
  color: #212121;
}
.news {
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px 10px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}
.news:last-child {
  border-bottom: none;
}
.hnews {
  font-size: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;
}
.hnews span {
  font-size: 20px;
  font-weight: bold;
}
.hdate {
  color: rgba(0, 0, 0, 0.54);
}
</style>
