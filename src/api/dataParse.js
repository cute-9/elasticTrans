/*
 * @desc:
 * @Author: Huang Qian
 * @Date: 2023-11-24 16:58:14
 */
import request from "@/utils/request";

export function csvTransBulk(data) {
  return request({
    url: `dataTrans/csvTransBulk`,
    method: "POST",
    data,
  });
}
export function csvFoldToEs(data) {
  return request({
    url: `dataTrans/csvFoldToEs`,
    method: "POST",
    data,
  });
}export function csvDeepFoldToEs(data) {
  return request({
    url: `dataTrans/csvDeepFoldToEs`,
    method: "POST",
    data,
  });
}
export function listAllIndices() {
  return request({
    url: `/index/listAllIndices`,
    method: "get",
  });
}
export function csvLine(params) {
  return request({
    url: `dataTrans/csvLine`,
    method: "POST",
    params,
  });
}
