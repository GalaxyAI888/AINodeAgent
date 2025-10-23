import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "@/api/auth/login";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { mutate: loginMutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: LoginApi,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: integrate API
    loginMutate({
      username: "admin",
      password: "123456",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 主要内容区域 */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* 品牌标识 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              欢迎回来
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              请登录您的账户以继续使用
            </p>
          </div>

          {/* 登录卡片 */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6 pt-8 px-6 sm:px-8">
              <CardTitle className="text-2xl font-bold">登录</CardTitle>
              <CardDescription className="mt-2">
                使用您的账号登录继续
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <Button type="submit" className="w-full h-12">
                  登录
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pb-8 pt-4 px-6 sm:px-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">还没有账号？</span>
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <Link to="/auth/register">去注册</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
