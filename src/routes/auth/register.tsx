import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MyForm } from "@/components/pages/auth/my-form";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  confirmPassword: z.string().min(2, {
    message: "Confirm password must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  verification_code: z.string().min(2, {
    message: "Verification code must be at least 2 characters.",
  }),
  // 邀请码
  aff_code: z.string().min(2, {
    message: "Aff code must be at least 2 characters.",
  }),
});

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "jincm1",
      password: "jincm123",
      confirmPassword: "jincm123",
      email: "jincm1@example.com",
      verification_code: "123456",
      aff_code: "123456",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

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
              <MyForm
                form={form}
                onSubmit={onSubmit}
                loading={false}
                formItems={[
                  {
                    name: "username",
                    label: "用户名",
                    placeholder: "请输入用户名",
                  },
                  {
                    name: "password",
                    label: "密码",
                    placeholder: "请输入密码",
                  },
                  {
                    name: "confirmPassword",
                    label: "确认密码",
                    placeholder: "请输入确认密码",
                  },
                  {
                    name: "email",
                    label: "邮箱",
                    placeholder: "请输入邮箱",
                  },
                  {
                    name: "verification_code",
                    label: "验证码",
                    placeholder: "请输入验证码",
                    suffix: (
                      <Button variant="outline" size="sm">
                        获取验证码
                      </Button>
                    ),
                  },
                  {
                    name: "aff_code",
                    label: "邀请码",
                    placeholder: "请输入邀请码",
                  },
                ]}
              />
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
