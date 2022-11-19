<template>
  <div>
    <!-- banner -->
    <div
      class="banner"
      :style="route.name != 'Home' ? { background: '#24629c' } : {}"
    >
      <div class="container">
        <div class="header">
          <div class="w3_agile_logo">
            <div class="bantitle">
              Lab of Vision and Machine Learning
              <br />机器学习研究室
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="ban-top">
          <div class="top_nav_left">
            <div class="navbar-collapse menu--shylock collapse">
              <ul
                class="menu__list"
                style="display: flex; justify-content: space-between"
              >
                <div style="display: flex">
                  <li
                    class="menu-li"
                    :class="menu.class"
                    v-for="(menu, index) in menus"
                    :key="index"
                  >
                    <a class="menu__link" @click="to(menu.url)">{{
                      menu.name
                    }}</a>
                  </li>
                </div>
                <div style="display: flex">
                  <li
                    class="menu-li"
                    :class="menu.class"
                    v-for="(menu, index) in menusRight"
                    :key="index"
                  >
                    <a class="menu__link" @click="to(menu.url)">{{
                      menu.name
                    }}</a>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>

        <div class="flexslider">
          <!-- <div class="banimg"></div> -->
          <img src="../assets/img/team.jpg" />
        </div>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer">
      <div class="container">
        <div class="col-md-4 agileinfo_footer_gridl">
          <h3>联系我们</h3>
          <p>Phone: {{ contact.value.phone }}</p>
          <p>Address: {{ contact.value.address }}</p>
          <p>Postcode: {{ contact.value.postcode }}</p>
          <p>Email: {{ contact.value.email }}</p>
        </div>
        <div class="col-md-4 agileinfo_footer_gridl">
          <h3>期望</h3>
          <p>{{ contact.value.hope }}</p>
        </div>
        <div class="col-md-4 agileinfo_footer_gridr">
          <h3>成员</h3>
          {{ contact.value.people }}
        </div>
      </div>
      <div class="visit-cnt">
        网站累计访问量/Hits <span>{{ hits }}</span>
      </div>
      <div class="cpr">
        © 2022 Lab of Vision and Machine Learning, College of Computer and Data
        Science, Fuzhou University.
      </div>
      <div class="cpr">© 2022 SOSD, Fuzhou University.</div>
    </div>
    <ChangeUserForm ref="changeUserForm"></ChangeUserForm>
  </div>
</template>
<script setup>
import { computed, reactive, onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { Config } from "../api/api";
import ChangeUserForm from "../components/users/ChangeUserForm.vue";
const store = useStore();
const route = useRoute();
const router = useRouter();
const changeUserForm = ref();
const menus = computed(() => {
  let currentTab = route.name;
  let token = store.state.token;
  let isAdmin = store.state.userObj && store.state.userObj.IsAdmin;
  let defaults = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Publications",
      url: "/publications",
    },
    {
      name: "Resource",
      url: "/resource",
    },
  ];

  if (token)
    defaults.push({
      name: "Schedule",
      url: "/schedule",
    });
  if (isAdmin)
    defaults.push({
      name: "Admin",
      url: "/admin",
    });

  defaults.forEach((item) => {
    if (item.name == currentTab)
      item.class = "menu__item active menu__item--current";
    else item.class = "menu__item";
  });
  return defaults;
});
const menusRight = computed(() => {
  let currentTab = route.name;
  let token = store.state.token;
  let defaults = [];
  if (token)
    defaults.push({
      name: `User: ${store.state.userObj.Username}`,
      url: "/user",
    });
  else
    defaults.push({
      name: "Login",
      url: "/login",
    });
  defaults.forEach((item) => {
    if (item.name == currentTab)
      item.class = "menu__item active menu__item--current";
    else item.class = "menu__item";
  });
  return defaults;
});
const to = (url) => {
  if (url != "/user") router.push(url);
  else {
    changeUserForm.value.handleUser();
  }
};
const contact = reactive({
  value: {
    phone: "",
    address: "",
    postcode: "",
    email: "",
    hope: "",
    people: "",
  },
});
onBeforeMount(() => {
  store.commit("initToken");
});
onMounted(() => {
  getConfig();
});
const hits = ref(0);
const getConfig = () => {
  Config.getConfig("contact").then((resp) => {
    contact.value = JSON.parse(resp.data.Value);
  });
  Config.getConfig("hits").then((resp) => {
    hits.value = parseInt(resp.data.Value);
    Config.setConfig("hits", (hits.value + 1).toString());
  });
};
</script>
<style scoped>
@import url("../assets/css/Home.css");
.banner {
  max-height: v-bind("route.name!='Home'?'212px':'724px'");
  overflow: hidden;
  background: url(../assets/img/fzuback.jpg) no-repeat;
  background-size: cover;
  position: relative;
  transition: max-height 0.5s ease;
}
.flexslider {
  margin: 40px 0 30px 0;
}
.flexslider img {
  width: calc(45vw);
  max-width: 800px;
  max-height: 450px;
}
.bantitle {
  font-size: 35px;
  /* 渐变文字颜色的关键*/
  -webkit-text-stroke: 1px black 0.8;
  color: white;
  cursor: default;
}
.menu-li {
  margin: 0 30px 0 0;
}
.main {
  min-height: calc(100vh - 225px);
}
.visit-cnt {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  color: white;
  opacity: 0.8;
}
.visit-cnt span {
  font-weight: bold;
  font-size: large;
}
.cpr {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}
</style>
