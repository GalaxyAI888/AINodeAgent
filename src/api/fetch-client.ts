import { isBlanks } from "@/share/is/isBlank";
import { isObject } from "@/share/is/isTypings";
import Path from "@/share/path";


export default class FetchClient {
  static API_MAP: Record<NonNullable<Api.BaseOptions['apiType']>, string> = {
    authApi: import.meta.env.VITE_API_AUTH_URL,
    parseApi: import.meta.env.VITE_API_PASE_URL,
  }

  static baseUrl(type: keyof typeof this.API_MAP) {
    console.log("import.meta.env", import.meta.env);
    console.log("this.API_MAP", this.API_MAP);
    return this.API_MAP[type];
  }


  private static async baseFetch<T>(url: string, options: Api.BaseOptions): Promise<T> {
    const { data, params, apiType = 'parseApi', ...rest } = options;
    if ('params' in options && params) {
      url = this._getSerialUrl(url, params);
    }
    const fetchUrl = Path.join(this.baseUrl(apiType), url);

    return new Promise((resolve, reject) => {
      fetch(fetchUrl, {
        ...rest,
        headers: {
          ...options.headers,
          'X-Parse-Application-Id': "BTGAPPID",
          'X-Parse-REST-API-Key': "BTGAPPKEY",
        },
        ...(isBlanks(data) ? {} : { body: JSON.stringify(data) }),
      }).then(response => response.json()).then(resolve).catch(reject);
    });
  }



  static async get<T>(url: string, options: Api.GetOptions): Promise<T> {
    return this.baseFetch<T>(url, { ...options, method: "GET" });
  }

  static async post<T>(url: string, options: Api.PostOptions): Promise<T> {

    return this.baseFetch<T>(url, { ...options, method: "POST" });
  }

  static async put(url: string, data: Record<string, unknown>) {
    return this.baseFetch(url, { method: "PUT", body: JSON.stringify(data) });
  }

  static async delete(url: string) {
    return this.baseFetch(url, { method: "DELETE" });
  }

  static async patch(url: string, data: Record<string, unknown>) {
    return this.baseFetch(url, { method: "PATCH", body: JSON.stringify(data) });
  }

  private static _getSerialUrl(url: string, params: AnyObject) {
    if (isBlanks(params)) return url;
    else if (isObject(params)) {
      if (Object.keys(params || {}).length === 0) return url;
      // 将参数对象转换为查询字符串
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join("&");

      // 拼接基础 URL 和查询字符串
      return `${url}?${queryString}`;
    }
    return url;
  }
}
