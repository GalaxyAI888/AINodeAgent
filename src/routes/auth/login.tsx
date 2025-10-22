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
    <div className="min-h-svh flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>使用您的账号登录继续</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <Button type="submit" className="w-full">
              登录
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          <p className="text-sm text-muted-foreground">还没有账号？</p>
          <Button asChild variant="link" size="sm">
            <Link to="/auth/register">去注册</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
