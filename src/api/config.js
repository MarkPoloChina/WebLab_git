export default {
  base_url: "http://lab.markpolo.cn:8669", // API地址
  base_ihs_url: "http://lab.markpolo.cn:9001", // MinIO客户机地址
  // base_url: "http://localhost:8080", // API地址
  // base_ihs_url: "http://localhost:9001", // MinIO客户机地址
  pageLimit: 10, // 切片器一页的项目数
  IHS:{
    username:'minioadmin', // MinIO文件服务器账号
    password:'minioadmin'  // MinIO文件服务器密码
  }
};
