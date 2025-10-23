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

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: integrate API
    // console.log({ name, email, password, confirmPassword })
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
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              创建账户
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              注册新账户开始您的旅程
            </p>
          </div>

          {/* 注册卡片 */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6 pt-8 px-6 sm:px-8">
              <CardTitle className="text-2xl font-bold">注册</CardTitle>
              <CardDescription className="mt-2">
                创建一个新账号开始使用
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="请输入您的姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

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
                    placeholder="至少 6 位"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12"
                  />
                </div>

                <Button type="submit" className="w-full h-12">
                  注册
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pb-8 pt-4 px-6 sm:px-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">已经有账号？</span>
                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                  <Link to="/auth/login">去登录</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
