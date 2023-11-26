/*
 * @desc:
 * @Author: Huang Qian
 * @Date: 2023-11-24 16:58:14
 */
import request from "@/utils/request";

export function csvDeepFoldToEs(data) {
  return request({
    url: "dataTrans/csvDeepFoldToEs",
    method: "post",
    data,
  });
}
export function RecycleBinExam(data) {
  return request({
    url: `posts`,
    method: "post",
    data,
  });
}
