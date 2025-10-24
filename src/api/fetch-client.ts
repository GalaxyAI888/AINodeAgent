import { isBlanks } from "@/share/is/isBlank";
import { isObject } from "@/share/is/isTypings";
import Path from "@/share/path";

export default class FetchClient {
  private static baseUrl = import.meta.env.PROD ? import.meta.env.VITE_BASE_API_URL : '/api';


  private static async baseFetch<T>(url: string, options: Api.BaseOptions): Promise<T> {
    const { data, ...rest } = options;
    const fetchUrl = Path.join(this.baseUrl, url);

    return new Promise((resolve, reject) => {
      fetch(fetchUrl, {
        ...rest,
        headers: {
          ...options.headers,
        },
        ...(isBlanks(data) ? {} : { body: JSON.stringify(data) }),
      }).then(response => response.json()).then(resolve).catch(reject);
    });
  }



  static async get(url: string) {
    return this.baseFetch(url, { method: "GET" });
  }

  static async post<T>(url: string, options: Api.PostOptions): Promise<T> {
    const { params, ...rest } = options;
    let serialUrl = url;
    if ("params" in options && params) {
      url = this._getSerialUrl(url, params);
      serialUrl = this._getSerialUrl(url, params);
    }
    return this.baseFetch<T>(serialUrl, { ...rest, method: "POST" });
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
