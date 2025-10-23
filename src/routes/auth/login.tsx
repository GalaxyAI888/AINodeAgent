import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
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
import { LoginApi } from "@/api/auth/login";

import { MyForm } from "@/components/pages/auth/my-form";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(2, {
      message: "密码至少2位",
    })
    .max(16, {
      message: "密码最多16位",
    }),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   {
  //     message:
  //       "密码至少包含一个大写字母,一个小写字母,一个数字,一个特殊字符,至少8位",
  //   }
  // ),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutate: loginMutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: LoginApi,
    onSuccess: (data) => {
      // 跳转到首页
      navigate({ to: "/layout" });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "jincm1",
      password: "jincm123",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutate({
      username: values.username,
      password: values.password,
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
              <MyForm
                form={form}
                onSubmit={onSubmit}
                loading={isPending}
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
                ]}
              />
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
