export interface LoginApiParams {
  username: string;
  password: string;
}

export interface User {
  DeletedAt: string | null;
  access_token: string;
  aff_code: string;
  aff_count: number;
  aff_history_quota: number;
  aff_quota: number;
  display_name: string;
  email: string;
  github_id: string;
  group: string;
  id: number;
  inviter_id: number;
  password: string;
  quota: number;
  request_count: number;
  role: number;
  status: number;
  telegram_id: string;
  used_quota: number;
  username: string;
  verification_code: string;
  wechat_id: string;
}