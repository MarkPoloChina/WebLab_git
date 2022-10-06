/* 对于全部的API方法，遵循以下的原则：
 * 传入：对于parma，传递parma的解构；对于data，直接传递data/file对象。对于file，特别地，最后一个参数是progress的代理对象。否则，最后一个参数是callback。
 * 返回：get请求异步返回resp.data。当抛出异常时，返回null，并替换默认方法，执行callback。
 * 使用async/await异步形态。
 */
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
  static newPublication = async (form, callback) => {
    try {
      await ax.postForm("/papers", form, {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      });
      return true;
    } catch (err) {
      if (callback) callback(err);
      else ElMessage.error("网络错误");
      return false;
    }
  };

  static getPublicPublications = async (page, limit, callback) => {
    try {
      let resp = await ax.get("/papers/public", {
        params: { page: page, limit: limit },
      });
      return resp.data;
    } catch (err) {
      if (callback) callback(err);
      else ElMessage.error("网络错误");
      return null;
    }
  };

  static getPrivatePublications = async (page, limit, callback) => {
    try {
      let resp = await ax.get("/papers/private", {
        params: { page: page, limit: limit },
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      });
      return resp.data;
    } catch (err) {
      if (callback) callback(err);
      else ElMessage.error("网络错误");
      return null;
    }
  };

  static getAllPublications = async (page, limit, callback) => {
    try {
      let resp = await ax.get(`/papers`, {
        params: { page: page, limit: limit },
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      });
      return resp.data;
    } catch (err) {
      if (callback) callback(err);
      else ElMessage.error("网络错误");
      return null;
    }
  };

  static getAllPublicationsCount = async (callback) => {
    try {
      let resp = await ax.get(`/papers/count`);
      return resp.data;
    } catch {
      if (callback) callback(err);
      else ElMessage.error("网络错误");
      return null;
    }
  };

  static deletePublication = async (id, callback) => {
    try {
      await ax.delete(`/papers/${id}`, {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      });
      return true;
    } catch (err) {
      if (callback) callback(err);
      else ElMessage.error("网络错误");
      return false;
    }
  };

  static updatePublication = async (id, list, callback) => {
    try {
      await ax.patch(`/papers/${id}`, list, {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      });
      return true;
    } catch (err) {
      if (callback) callback(err);
      else ElMessage.error("网络错误");
      return false;
    }
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
        progress.value = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
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
