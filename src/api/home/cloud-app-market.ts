import FetchClient from "../fetch-client";
import type { CloudApp, ModelFile } from "./model/index.type";

// 获取云应用市场列表
export const getCloudAppMarketList: Api.IFetch<CloudApp, AnyObject, "PAGE"> = (params) =>
  FetchClient.get("/parse/classes/models", { params: params });


// 下载模型文件
export const downloadModelFile: Api.IFetch<void, ModelFile> = (data) =>
  FetchClient.post("/v1/model-files", { data, apiType: "modelApi", isProxy: false });