import request from "@/utils/request";

export function getHdfsCatalog(params) {
  return request({
    url: `hdfs/getHdfsCatalog`,
    method: "get",
    params,
  });
}
// 查看
export function getHdfsFilePlay(params) {
  return request({
    url: `hdfs/getHdfsFilePlay`,
    method: "get",
    params,
  });
}
// hdfs/uploadFilesToHdfs
export function uploadFilesToHdfs(params) {
  return request({
    url: `hdfs/uploadFilesToHdfs`,
    method: "get",
    params,
  });
}
