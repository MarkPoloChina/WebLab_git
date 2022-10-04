<template>
  <div class="container">
    <div class="title">Upload</div>
    <div class="content">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="Publications" name="publications">
          <div class="btn-top">
            <div>
              <el-button
                @click="
                  clearUploadForm();
                  uploadForm.visble = true;
                "
                >新增</el-button
              >
            </div>
            <div>
              <el-button @click="logout">退出</el-button>
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%; min-height: 400px"
            stripe
          >
            <el-table-column prop="Id" label="Id" width="60" />
            <el-table-column prop="Title" label="Title" width="180" />
            <el-table-column prop="Abstract" label="Info" />
            <el-table-column prop="Link" label="Link">
              <template #default="scope">
                <el-link :href="scope.row.Link" v-if="scope.row.Link != ''"
                  >Link</el-link
                >
              </template>
            </el-table-column>
            <el-table-column prop="Authors" label="Author"> </el-table-column>
            <el-table-column prop="State" label="是否公开">
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.State">公开</el-tag>
                <el-tag type="info" v-else>不公开</el-tag>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations">
              <template #default="scope">
                <el-popconfirm
                  title="Are you sure to delete this?"
                  @confirm="handleDelete(scope.row.Id)"
                >
                  <template #reference>
                    <el-button link type="primary" size="small">删除</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="Resource" name="resource">
          <div class="btn-top">
            <div>
              <el-button
                @click="
                  clearResourceUploadForm();
                  uploadResourceForm.visble = true;
                "
                >新增</el-button
              >
            </div>
            <div>
              <el-button @click="logout">退出</el-button>
            </div>
          </div>
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
                    <el-button link type="primary" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleEditResource(scope.row)"
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
        </el-tab-pane>
        <el-tab-pane label="Config" name="config">
          <el-form label-width="100px" style="width: 100%">
            <el-form-item label="实验室介绍">
              <el-input
                v-model="configForm.introduction"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                clearable
              />
              <el-button
                @click="
                  handleCommitConfig('introduction', configForm.introduction)
                "
                style="margin-top: 10px"
                >提交</el-button
              >
            </el-form-item>
            <el-form-item label="老师">
              <el-input
                v-model="configForm.teacher.name"
                type="text"
                placeholder="姓名"
                clearable
              />
              <el-input
                v-model="configForm.teacher.introduction"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                placeholder="简介"
                clearable
              />
              <el-input
                v-model="configForm.teacher.content"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                placeholder="正文"
                clearable
              />
              <el-button
                @click="handleCommitConfig('teacher', configForm.teacher)"
                style="margin-top: 10px"
                >提交</el-button
              >
            </el-form-item>
            <el-form-item label="项目介绍">
              <el-input
                v-model="configForm.projects[index]"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                clearable
                v-for="(item, index) in configForm.projects"
                :key="index"
              />
              <el-button @click="newItem('projects')">新增项目</el-button
              ><el-button
                @click="handleCommitConfig('projects', configForm.projects)"
                style="margin-top: 10px"
                >提交</el-button
              >
            </el-form-item>
            <el-form-item label="新闻">
              <el-input
                v-model="configForm.news[index].content"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                clearable
                v-for="(item, index) in configForm.news"
                :key="index"
              />
              <el-button @click="newItem('news')">新增新闻</el-button
              ><el-button
                @click="handleCommitConfig('news', configForm.news)"
                style="margin-top: 10px"
                >提交</el-button
              >
            </el-form-item>
            <el-form-item label="联系我们">
              <el-input
                v-model="configForm.contact.phone"
                type="text"
                placeholder="电话"
                clearable
              />
              <el-input
                v-model="configForm.contact.address"
                type="text"
                placeholder="地址"
                clearable
              />
              <el-input
                v-model="configForm.contact.postcode"
                type="text"
                placeholder="邮编"
                clearable
              />
              <el-input
                v-model="configForm.contact.email"
                type="text"
                placeholder="邮件"
                clearable
              />
              <el-input
                v-model="configForm.contact.hope"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                placeholder="期望"
                clearable
              />
              <el-input
                v-model="configForm.contact.people"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                placeholder="人员"
                clearable
              />
              <el-button
                @click="handleCommitConfig('contact', configForm.contact)"
                style="margin-top: 10px"
                >提交</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-dialog v-model="uploadForm.visble" title="Uploader Form" width="70%">
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="标题">
        <el-input v-model="uploadForm.title" type="text" clearable />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="uploadForm.author" type="text" clearable />
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="uploadForm.link" type="text" clearable />
      </el-form-item>
      <el-form-item label="录用信息">
        <el-input v-model="uploadForm.abstract" type="text" clearable />
      </el-form-item>
      <el-form-item label="是否公开">
        <el-switch v-model="uploadForm.isPublic" />
      </el-form-item>
      <el-form-item class="progress">
        <el-progress
          :percentage="progressImage"
          text-inside
          :stroke-width="24"
        />
      </el-form-item>
      <el-form-item label="图片上传">
        <el-upload
          v-model:file-list="ihs.imageFile"
          accept=".png,.jpg"
          drag
          :multiple="false"
          :limit="1"
          :auto-upload="false"
          :on-change="uploadImage"
          :on-remove="clearImage"
        >
          <el-button type="primary">Click to upload</el-button>
          <template #tip v-if="uploadForm.id">
            <div class="el-upload__tip">如果不修改文件则不需要上传</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item class="progress">
        <el-progress :percentage="progressPdf" text-inside :stroke-width="24" />
      </el-form-item>
      <el-form-item label="PDF上传">
        <el-upload
          v-model:file-list="ihs.pdfFile"
          accept=".pdf"
          drag
          :multiple="false"
          :limit="1"
          :auto-upload="false"
          :on-change="uploadPdf"
          :on-remove="clearPdf"
        >
          <el-button type="primary">Click to upload</el-button>
          <template #tip v-if="uploadForm.id">
            <div class="el-upload__tip">如果不修改文件则不需要上传</div>
          </template>
          <template #tip v-else>
            <div class="el-upload__tip">PDF上传将覆盖链接</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadForm.visble = false">取消</el-button>
        <el-button type="primary" @click="handleUpload">上传</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="uploadResourceForm.visble"
    title="Uploader Form"
    width="70%"
  >
    <el-form :model="uploadForm" label-width="100px" style="width: 100%">
      <el-form-item label="标题">
        <el-input v-model="uploadResourceForm.title" type="text" clearable />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="uploadResourceForm.description"
          type="text"
          clearable
        />
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="uploadResourceForm.link" type="text" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadResourceForm.visble = false">取消</el-button>
        <el-button type="primary" @click="handleUploadResource">上传</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { Config, IHS, Publications, Resource } from "../api/api";
import { ElMessage } from "element-plus";
import config from "../api/config";
import { useObjectUrl } from "@vueuse/core";

// 获取路由实例
const router = useRouter();
const route = useRoute();
const tableData = reactive([]);
const tableResourceData = reactive([]);
const uploadForm = reactive({
  id: null,
  visble: false,
  title: "",
  author: "",
  link: "",
  abstract: "",
  isPublic: true,
});
const uploadResourceForm = reactive({
  id: null,
  visble: false,
  title: "",
  description: "",
  link: "",
});
const ihs = reactive({
  image: "",
  pdf: "",
  imageFile: [],
  pdfFile: [],
});
onMounted(() => {
  getPublications();
  getResource();
  getConfig();
});
const currentPage = ref(1);
const totalPage = ref(1);
const currentResourcePage = ref(1);
const totalResourcePage = ref(1);
const store = useStore();
const activeName = ref("publications");
const getPublications = () => {
  getPage();
  tableData.length = 0;
  Publications.getAllPublications(currentPage.value, config.pageLimit).then(
    (res) => {
      res.data.forEach((publication) => {
        tableData.push(publication);
      });
    }
  );
};
watch(currentPage, () => {
  getPublications();
});
watch(currentResourcePage, () => {
  getResource();
});
const configForm = reactive({
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
const progressImage = ref(0);
const progressPdf = ref(0);
const handleUpload = () => {
  if (!uploadForm.id)
    Publications.newPublication({
      Title: uploadForm.title,
      Abstract: uploadForm.abstract,
      Authors: uploadForm.author,
      Thumbnail: ihs.image,
      Link: ihs.pdf == "" ? uploadForm.link : ihs.pdf,
      State: uploadForm.isPublic ? 1 : 0,
    })
      .then((res) => {
        ElMessage({
          message: "上传成功",
          type: "success",
        });
        uploadForm.visble = false;
        getPublications();
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  else {
    let list = [];
    tableData.forEach((item) => {
      if (item.Id == uploadForm.id) {
        if (uploadForm.title != item.Title)
          list.push({
            op: "replace",
            path: "/Title",
            value: uploadForm.title,
          });
        if (uploadForm.abstract != item.Abstract)
          list.push({
            op: "replace",
            path: "/Abstract",
            value: uploadForm.abstract,
          });
        if (uploadForm.author != item.Authors)
          list.push({
            op: "replace",
            path: "/Authors",
            value: uploadForm.author,
          });
        if (
          (uploadForm.isPublic && item.State == 0) ||
          (!uploadForm.isPublic && item.State == 1)
        )
          list.push({
            op: "replace",
            path: "/State",
            value: uploadForm.isPublic ? 1 : 0,
          });
        if (uploadForm.link != item.Link && ihs.pdf == "")
          list.push({
            op: "replace",
            path: "/Link",
            value: uploadForm.link,
          });
        else if (ihs.pdf != "")
          list.push({
            op: "replace",
            path: "/Link",
            value: ihs.pdf,
          });
        if (ihs.image != "")
          list.push({
            op: "replace",
            path: "/Thumbnail",
            value: ihs.image,
          });
      }
    });
    Publications.updatePublication(uploadForm.id, list)
      .then((res) => {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        uploadForm.visble = false;
        getPublications();
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  }
};
const clearUploadForm = () => {
  progressImage.value = 0;
  progressPdf.value = 0;
  uploadForm.id = null;
  uploadForm.title = "";
  uploadForm.author = "";
  uploadForm.link = "";
  uploadForm.abstract = "";
  uploadForm.isPublic = true;
  ihs.image = "";
  ihs.pdf = "";
  ihs.imageFile.length = 0;
  ihs.pdfFile.length = 0;
};
const uploadImage = (file) => {
  if (file.raw) {
    IHS.postFile(file.raw, progressImage)
      .then((res) => {
        if (res.status === 201) {
          ElMessage({
            message: "上传图片成功",
            type: "success",
          });
          ihs.image = res.data.Url;
        }
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  }
};
const uploadPdf = (file) => {
  if (file.raw) {
    IHS.postFile(file.raw, progressPdf)
      .then((res) => {
        if (res.status === 201) {
          ElMessage({
            message: "上传PDF成功",
            type: "success",
          });
          ihs.pdf = res.data.Url;
        }
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  }
};
const logout = () => {
  store.commit("clearToken");
  router.push("/");
};
const clearImage = () => {
  ihs.image = "";
  progressImage.value = 0;
};
const clearPdf = () => {
  ihs.pdf = "";
  progressPdf.value = 0;
};
const handleDelete = (id) => {
  Publications.deletePublication(id)
    .then((res) => {
      if (res.status === 204)
        ElMessage({
          message: "删除成功",
          type: "success",
        });
      getPublications();
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
const handleEdit = (obj) => {
  clearUploadForm();

  uploadForm.id = obj.Id;
  uploadForm.title = obj.Title;
  uploadForm.abstract = obj.Abstract;
  uploadForm.author = obj.Authors;
  uploadForm.link = obj.Link;
  uploadForm.isPublic = obj.State == 1;
  uploadForm.visble = true;
};
const getPage = () => {
  Publications.getAllPublicationsCount().then((resp) => {
    totalPage.value = resp.data.Count;
  });
};
const newItem = (key) => {
  if (key == "projects") {
    if (configForm[key].length >= 5) {
      if (configForm[key][configForm[key].length - 1] == "") {
        configForm[key].length--;
        configForm[key].unshift("");
      } else ElMessage.error("项目数不能超过5个!请先清空最后一个文本框");
    } else configForm[key].unshift("");
  } else {
    if (configForm[key].length >= 5) {
      if (configForm[key][configForm[key].length - 1].content == "") {
        configForm[key].length--;
        configForm[key].unshift({ date: null, content: "" });
      } else ElMessage.error("项目数不能超过5个!请先清空最后一个文本框");
    } else configForm[key].unshift({ date: null, content: "" });
  }
};
const handleCommitConfig = (key, value) => {
  if (key == "news") {
    let _value = [];
    value.forEach((item) => {
      if (item.content != "")
        _value.push({
          date: item.date ? item.date : new Date().toLocaleDateString(),
          content: item.content,
        });
    });
    value = _value;
  }
  Config.setConfig(key, JSON.stringify(value))
    .then((resp) => {
      ElMessage({
        message: "提交成功",
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
const getConfig = () => {
  let enums = ["introduction", "teacher", "projects", "contact", "news"];
  enums.forEach((item) => {
    Config.getConfig(item).then((resp) => {
      configForm[item] = JSON.parse(resp.data.Value);
    });
  });
};
const getResourcePage = () => {
  Resource.getResourceCount().then((resp) => {
    totalResourcePage.value = resp.data.Count;
  });
};
const getResource = () => {
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
const handleUploadResource = () => {
  if (!uploadResourceForm.id)
    Resource.newResource({
      Title: uploadResourceForm.title,
      Description: uploadResourceForm.description,
      Link: uploadResourceForm.link,
    })
      .then((res) => {
        ElMessage({
          message: "上传成功",
          type: "success",
        });
        uploadResourceForm.visble = false;
        getResource();
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  else {
    let list = [];
    tableResourceData.forEach((item) => {
      if (item.Id == uploadResourceForm.id) {
        if (item.Description != uploadResourceForm.description)
          list.push({
            op: "replace",
            path: "/Description",
            value: uploadResourceForm.description,
          });
        if (item.Title != uploadResourceForm.title)
          list.push({
            op: "replace",
            path: "/Title",
            value: uploadResourceForm.title,
          });
        if (item.Link != uploadResourceForm.link)
          list.push({
            op: "replace",
            path: "/Link",
            value: uploadResourceForm.link,
          });
      }
    });
    Resource.updateResource(uploadResourceForm.id, list)
      .then((res) => {
        ElMessage({
          message: "上传成功",
          type: "success",
        });
        uploadResourceForm.visble = false;
        getResource();
      })
      .catch((err) => {
        ElMessage.error("网络错误");
      });
  }
};
const handleDeleteResource = (id) => {
  Resource.deleteResource(id)
    .then((res) => {
      if (res.status === 204)
        ElMessage({
          message: "删除成功",
          type: "success",
        });
      getResource();
    })
    .catch((err) => {
      ElMessage.error("网络错误");
    });
};
const handleEditResource = (obj) => {
  clearResourceUploadForm();
  uploadResourceForm.id = obj.Id;
  uploadResourceForm.link = obj.Link;
  uploadResourceForm.description = obj.Description;
  uploadResourceForm.title = obj.Title;
  uploadResourceForm.visble = true;
};
const clearResourceUploadForm = () => {
  uploadResourceForm.id = null;
  uploadResourceForm.link = "";
  uploadResourceForm.description = "";
  uploadResourceForm.title = "";
};
</script>

<style scoped>
.container {
  margin: 0 auto 20px auto;
  padding-right: 15px;
  padding-left: 15px;
}
.container .title {
  padding: 30px 0 20px 0;
  color: #24629c;
  font-size: 35px;
  font-weight: bold;
}
.upload-demo {
  background-color: whitesmoke;
  width: 60%;
  margin: 0 auto;
}
:deep(.el-tabs__item.is-active) {
  color: #24629c;
}
:deep(.el-tabs__item:hover) {
  color: #24629c;
}
:deep(.el-tabs__active-bar) {
  background-color: #24629c;
}
.btn-top {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.btn-top div {
  margin: 10px 20px 40px 20px;
}
:deep(.progress .el-progress--line) {
  width: 100%;
}
.pagination {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (min-width: 768px) {
  .container {
    width: 720px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 930px;
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1140px;
  }
}
</style>
