import FetchClient from "../fetch-client";
import type { LoginApiParams, User } from "./model/user.type";


export const LoginApi: Api.IFetch<User, LoginApiParams> = (data) => FetchClient.post("/user/account/login", { data });

/** 获取微信openid */
// export const WechatOpenIdApi: Api.IFetch<WechatOpenIdResponse, WechatOpenIdParams> = (params) => ApiService.post("/realms/soxen-saas/protocol/openid-connect/token", {
//   data: params, baseUrl: BaseUrl.AUTH, requestOpt: {
//     header: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     }
//   }
// });