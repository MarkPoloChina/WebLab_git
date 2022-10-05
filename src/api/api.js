import config from "./config";
import axios from "axios";
import store from "../store";

import { ElMessage } from "element-plus";

const ax = axios.create({ baseURL: config.base_url });
const axi = axios.create({ baseURL: config.base_ihs_url });

export class Token {
  static login = (username, password) => {
    return ax.postForm("/tokens", { Username: username, Password: password });
  };
}

export class Publications {
  static newPublication = (form) => {
    return ax.postForm("/papers", form, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  };

  static getPublications = (page, limit, isPublic) => {
    return ax.get(`/papers/${isPublic ? "public" : "private"}`, {
      params: { page: page, limit: limit },

      headers: isPublic
        ? {}
        : {
          Authorization: `Bearer ${store.state.token}`,
        },
    });
  };

  static getAllPublications = async (page, limit, callback) => {
    try {
      let resp = await ax.get(`/papers`, {
        params: { page: page, limit: limit },
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      });
      return resp.data
    }
    catch (err) {
      if (err.response.status === 401) {
        ElMessage.error("请重新登录");
        store.commit("clearToken");
        if (callback) callback()
      } else ElMessage.error("网络错误");
    }
  };

  static getAllPublicationsCount = async () => {
    try {
      let resp = await ax.get(`/papers/count`);
      return resp.data
    }
    catch {
      if (err.response.status === 401) {
        ElMessage.error("请重新登录");
        store.commit("clearToken");
        if (callback) callback()
      } else ElMessage.error("网络错误");
    }
  };

  static deletePublication = (id) => {
    return ax.delete(`/papers/${id}`, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  };

  static updatePublication = (id, list) => {
    return ax.patch(`/papers/${id}`, list, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  };
}

export class IHS {
  static getToken = () => {
    return axi.post("/tokens", {
      AccessKeyID: config.IHS.username,
      SecretAccessKey: config.IHS.password,
    });
  };
  static postFile = (file, progress) => {
    const form = new FormData();
    form.append("file", file);
    return axi.post("/buckets", form, {
      headers: {
        Authorization: `Bearer ${store.state.tokenIHS}`,
      },
      onUploadProgress: (progressEvent) => {
        progress.value = (progressEvent.loaded / progressEvent.total) * 100;
      },
    });
  };
}

export class Config {
  static getConfig(key) {
    return ax.get(`/configs/${key}`, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  }

  static setConfig(key, value) {
    return ax.put(
      `/configs/${key}`,
      { value: value },
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      }
    );
  }
}

export class Resource {
  static getResource = (page, limit) => {
    return ax.get("/resources", {
      params: { page: page, limit: limit },
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  };

  static newResource = (form) => {
    return ax.post("/resources", form, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  };

  static deleteResource = (id) => {
    return ax.delete(`/resources/${id}`, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  };

  static updateResource = (id, list) => {
    return ax.patch(`/resources/${id}`, list, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });
  };

  static getResourceCount = () => {
    return ax.get(`/resources/count`);
  };
}
