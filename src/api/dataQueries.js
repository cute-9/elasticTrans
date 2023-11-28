import request from "@/utils/request";

export function listMapping(params) {
  return request({
    url: `index/listMapping`,
    method: "POST",
    params,
  });
}
export function search(data) {
  return request({
    url: `query/search`,
    method: "POST",
    data,
  });
}
export function highSearch(data) {
  return request({
    url: `query/highSearch`,
    method: "POST",
    data,
  });
}
