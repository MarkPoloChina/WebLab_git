<template>
  <div>
    <div
      class="pub-list"
      v-infinite-scroll="() => emit('next-load')"
      v-if="ready"
    >
      <div v-for="(item, index) in tableData" :key="index" class="tablediv">
        <div class="card-thumb">
          <img :src="item.Thumbnail" />
        </div>
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
              {{ item.PublishedIn }}
            </div>
          </div>
          <div class="words-bottom">
            <span v-if="item.Link && item.Link != ''"
              >[<el-link class="words-lnk" :href="item.Link">LINK</el-link
              >]</span
            >
            <span v-if="item.Pdf && item.Pdf != ''"
              >[<el-link class="words-lnk" :href="item.Pdf">PDF</el-link>]</span
            >
            <span v-if="item.Code && item.Code != ''"
              >[<el-link class="words-lnk" :href="item.Code">Code</el-link
              >]</span
            >
          </div>
        </div>
      </div>
    </div>
    <el-empty description="No Any Publication" v-if="tableData.length == 0" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const emit = defineEmits(["next-load"]);
defineProps({
  tableData: Array,
});
const ready = ref(false);
onMounted(() => {
  ready.value = true;
});
</script>

<style scoped>
.tablediv {
  display: flex;
  margin-top: 25px;
  background-color: rgba(158, 208, 255, 0.1);
  border: 1px solid rgba(36, 98, 156, 0);
  border-radius: 3px;
  padding: 20px 30px 20px 30px;
  position: relative;
  transition: 0.2s all linear;
}
.tablediv:hover {
  border: 1px solid rgba(36, 98, 156, 0.578);
  transition: 0.2s all linear;
}
.card-thumb {
  position: relative;
  flex-basis: 30%;
  flex-grow: 0;
  flex-shrink: 0;
}
.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pub-list {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.card-words {
  flex-basis: 70%;
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
