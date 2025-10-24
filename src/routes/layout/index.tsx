import * as React from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Menu,
  Bell,
  Settings as SettingsIcon,
  LayoutDashboard,
  Server,
  Cloud,
  Activity,
  Cpu,
  Boxes,
  ListChecks,
  Link as LinkIcon,
  FileText,
  Zap,
  Image as ImageIcon,
  Type,
  User,
} from "lucide-react";

export const Route = createFileRoute("/layout/")({
  beforeLoad: () => {
    // 检查是否已认证
    if (!isAuthenticated()) {
      // 如果未认证，重定向到登录页面
      throw redirect({ to: "/auth/login" });
    }
  },
  component: RouteComponent,
});

type NavItem = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "仪表盘", href: "#", Icon: LayoutDashboard },
  { label: "集群管理", href: "#", Icon: Server },
  { label: "云端模型市场", href: "#", Icon: Cloud },
  { label: "资源监控", href: "#", Icon: Activity },
  { label: "GPU 管理", href: "#", Icon: Cpu },
  { label: "本地模型管理", href: "#", Icon: Boxes },
  { label: "任务管理", href: "#", Icon: ListChecks },
  { label: "链路负载", href: "#", Icon: LinkIcon },
  { label: "日志记录", href: "#", Icon: FileText },
  { label: "设置", href: "#", Icon: SettingsIcon },
];

function SidebarItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const { Icon } = item;
  return (
    <a
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "text-muted-foreground",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <Icon className="size-5" />
      <span className={cn(collapsed ? "sr-only" : "inline")}>{item.label}</span>
    </a>
  );
}

function RouteComponent() {
  const [collapsed, setCollapsed] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  return (
    <div className="min-h-svh w-full bg-background text-foreground">
      <div className="flex h-svh">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r bg-card/40 backdrop-blur supports-backdrop-filter:bg-card/40",
            "transition-[width] duration-200 ease-in-out",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex h-14 items-center gap-2 px-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle Sidebar"
            >
              <Menu className="size-5" />
            </Button>
            <div
              className={cn("text-sm font-semibold", collapsed && "sr-only")}
            >
              AI大模型客户端
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="relative">
              <Input
                placeholder="搜索..."
                className={cn(collapsed && "sr-only")}
              />
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <SidebarItem key={item.label} item={item} collapsed={collapsed} />
            ))}
          </nav>

          <div className="mt-auto p-3">
            <Card
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handleLogout}
            >
              <CardContent className="px-4 py-3">
                <div
                  className={cn(
                    "flex items-center gap-3",
                    collapsed && "justify-center"
                  )}
                >
                  <User className="size-6" />
                  <div className={cn("text-sm", collapsed && "sr-only")}>
                    <div className="font-medium">
                      {user?.username || "用户"}
                    </div>
                    <div className="text-muted-foreground">
                      {user?.display_name || "尊贵用户"} · {user?.quota || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <div className="flex flex-1 items-center gap-3">
              <div className="w-64 max-w-[50vw]">
                <Input placeholder="搜索模型、任务..." />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Settings">
                <SettingsIcon className="size-5" />
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 space-y-4 p-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="gap-1">
                  <CardTitle className="text-base">GPU 使用率</CardTitle>
                  <CardDescription>过去 24 小时</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">60%</div>
                  <div className="text-xs text-emerald-500">↑ 5%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="gap-1">
                  <CardTitle className="text-base">内存占用</CardTitle>
                  <CardDescription>当前</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5 GB</div>
                  <div className="text-xs text-red-500">↑ 10%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="gap-1">
                  <CardTitle className="text-base">算力积分</CardTitle>
                  <CardDescription>余额</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">500</div>
                  <div className="text-xs text-emerald-500">↑ 20</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="gap-1">
                  <CardTitle className="text-base">账户余额</CardTitle>
                  <CardDescription>人民币</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥100</div>
                  <div className="text-xs text-red-500">↓ 10</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>GPU 使用率趋势</CardTitle>
                  <CardDescription>小时级</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Bar chart placeholder */}
                  <div className="grid h-56 grid-cols-12 items-end gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded bg-primary/30"
                        style={{ height: `${30 + ((i * 13) % 60)}%` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>模型分布</CardTitle>
                  <CardDescription>占比</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    {/* Donut placeholder */}
                    <div className="relative size-40">
                      <div className="absolute inset-0 rounded-full border-8 border-primary/30" />
                      <div className="absolute inset-0 rounded-full border-8 border-secondary/40 rotate-45" />
                      <div className="absolute inset-0 rounded-full border-8 border-accent/40 -rotate-45" />
                      <div className="absolute inset-6 rounded-full bg-background" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-primary/60" />{" "}
                        LLM 模型 45%
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-secondary/60" />{" "}
                        图像模型 30%
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-accent/60" />{" "}
                        音频模型 15%
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-muted-foreground/40" />{" "}
                        其他 10%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <QuickAction icon={Zap} label="启动模型" />
                  <QuickAction icon={Server} label="加入集群" />
                  <QuickAction icon={ImageIcon} label="生成图像" />
                  <QuickAction icon={Type} label="文本生成" />
                </div>
              </CardContent>
            </Card>

            {/* Recent tasks */}
            <Card>
              <CardHeader>
                <CardTitle>最近任务</CardTitle>
                <CardDescription>最新 5 条任务记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">任务名称</th>
                        <th className="px-3 py-2 font-medium">类型</th>
                        <th className="px-3 py-2 font-medium">状态</th>
                        <th className="px-3 py-2 font-medium">进度</th>
                        <th className="px-3 py-2 font-medium">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">推理任务 #{i + 1}</td>
                          <td className="px-3 py-2">LLM</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
                              运行中
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="h-2 w-32 overflow-hidden rounded bg-primary/15">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${40 + ((i * 12) % 60)}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2">刚刚</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline" size="sm">
                  查看全部
                </Button>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className="group flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground">
      <div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20">
        <Icon className="size-5" />
      </div>
      <div>
        <div className="font-medium leading-none">{label}</div>
        <div className="text-muted-foreground text-xs">点击开始</div>
      </div>
    </button>
  );
}
