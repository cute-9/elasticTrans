import request from "@/utils/request";
//获取数据统计
export function docStatic(data) {
  return request({
    url: `index/docStatic`,
    method: "POST",
    data,
  });
}
// 删除索引
export function deleteInfo(params) {
  return request({
    url: `index/delete`,
    method: "delete",
    params,
  });
}
// 清空索引
export function truncate(params) {
  return request({
    url: `index/truncate`,
    method: "POST",
    params,
  });
}
// 创建索引
export function createInfo(data) {
  return request({
    url: `index/create`,
    method: "POST",
    data,
  });
}
