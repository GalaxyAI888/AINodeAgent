import FetchClient from "../fetch-client";
import type { CloudApp } from "./model/index.type";

// 获取云应用市场列表
export const getCloudAppMarketList: Api.IFetch<CloudApp[], { page: number, pageSize: number }> = (params) =>
  FetchClient.get("/parse/classes/models", { params: params });