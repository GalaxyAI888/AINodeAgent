import FetchClient from "../fetch-client";
import type { LoginApiParams, User } from "./model/user.type";


/** 用户登录 */
export const LoginApi: Api.IFetch<User, LoginApiParams> = (data) => FetchClient.post("/api/user/login", { data, apiType: 'authApi' });

