import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LoginApi } from "@/api/auth/login";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

const Form = FormProvider;

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

  // 1. Define your form.
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入用户名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入密码" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button loading={isPending} type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>
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
