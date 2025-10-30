namespace Api {
  type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  type IFetch<IData, IParams = null, IPage extends PageType = 'NO_PAGE'> = IParams extends null ? () => Promise<IData> : (params: BaseParams<IPage, IParams>) => Promise<BaseData<IPage, IData>>;

  type IResponse<T> = {
    code: number;
    msg: string;
    data?: T;
  };

  type PageType = "PAGE" | "NO_PAGE";

  type BaseParams<T extends PageType, IParams extends AnyObject> = T extends "PAGE" ? {
    limit?: number;
    skip?: number;
  } & IParams : IParams;

  type BaseData<T extends PageType, IList extends AnyObject> = T extends "PAGE" ? Partial<{
    results: IList[];
    current: number;
    size: number;
    total: number;
  }> : IList;
  interface PostOptions extends BaseOptions {
    method?: 'POST';
  }
  interface GetOptions extends BaseOptions {
    method?: 'GET';
  }

  interface BaseOptions extends Omit<RequestInit, 'method'> {
    method: RequestMethod;
    params?: AnyObject;
    apiType?: "authApi" | "parseApi" | "modelApi";
    data?: AnyObject;
  }
}