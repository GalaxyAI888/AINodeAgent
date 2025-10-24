import App from "@/App";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // 检查是否已认证
    if (isAuthenticated()) {
      // 如果已认证，重定向到 layout 页面
      throw redirect({ to: "/layout" });
    }
    // 如果未认证，重定向到登录页面
    throw redirect({ to: "/auth/login" });
  },
  component: App,
});
