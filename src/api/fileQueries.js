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
// 上传
export function uploadFilesToHdfs(params) {
  return request({
    url: `hdfs/uploadFilesToHdfs`,
    method: "get",
    params,
  });
}
//创建文件名
export function createHdfsDirectory(params) {
  return request({
    url: `hdfs/createHdfsDirectory`,
    method: "get",
    params,
  });
}
//删除
export function deleteHdfsPath(params) {
  return request({
    url: `hdfs/deleteHdfsPath`,
    method: "get",
    params,
  });
}
