import { AppSidebar } from "@/components/pages/layout/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { isAuthenticated } from "@/lib/auth";
import type { FileRoutesByTo } from "@/routeTree.gen";
import { Separator } from "@radix-ui/react-separator";
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Bell,
  Bot,
  Boxes,
  CreditCard,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  ListChecks,
  Lock,
  Package,
  Server,
  Settings,
  User,
} from "lucide-react";
import { useMemo } from "react";
export const Route = createFileRoute("/home")({
  beforeLoad: () => {
    // 检查是否已认证
    if (!isAuthenticated()) {
      // 如果未认证，重定向到登录页面
      throw redirect({ to: "/auth/login" });
    }
  },
  component: RouteComponent,
});

export interface NavItem {
  title: string;
  url: keyof FileRoutesByTo;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  collapsible?: boolean;
}
const NAV_ITEMS = [
  { title: "仪表盘", url: "/", icon: LayoutDashboard, isActive: true },
  {
    title: "资源管理",
    url: "/",
    icon: Server,
    isActive: false,
  },
  {
    title: "集群管理",
    url: "/",
    icon: Bot,
    isActive: false,
  },
  {
    title: "云端模型市场",
    url: "/home/cloud-model-market",
    icon: Package,
    isActive: false,
  },
  {
    title: "云端AI应用市场",
    url: "/home/cloud-app-market",
    icon: AppWindow,
    isActive: false,
  },
  {
    title: "本地AI应用市场",
    url: "/",
    icon: Boxes,
    isActive: false,
  },
  {
    title: "本地AI应用镜像",
    url: "/",
    icon: ImageIcon,
    isActive: false,
  },
  {
    title: "本地AI模型管理",
    url: "/",
    icon: Boxes,
    isActive: false,
  },
  {
    title: "任务管理",
    url: "/",
    icon: ListChecks,
    isActive: false,
  },
  {
    title: "钱包充值",
    url: "/",
    icon: CreditCard,
    isActive: false,
  },
  {
    title: "日志记录",
    url: "/",
    icon: FileText,
    isActive: false,
  },
  {
    title: "设置",
    url: "/",
    icon: Settings,
    isActive: false,
    collapsible: true,
    items: [
      {
        title: "账号设置",
        url: "/",
        icon: User,
      },
      {
        title: "安全设置",
        url: "/",
        icon: Lock,
      },
      {
        title: "通知设置",
        url: "/",
        icon: Bell,
      },
    ],
  },
] satisfies NavItem[];

function RouteComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const breadcrumb = useMemo(() => {
    return NAV_ITEMS.filter((item) => item.url === pathname).map((item) => ({
      label: item.title,

      href: item.url,
    }));
  }, [pathname]);
  const navMain = useMemo(() => {
    return NAV_ITEMS.map((item) => ({
      ...item,
      isActive: pathname === item.url, // 或根据需要用 startsWith/匹配
    }));
  }, [pathname]);

  console.log(breadcrumb);

  console.log(breadcrumb);
  return (
    <SidebarProvider>
      <AppSidebar items={navMain} />
      <SidebarInset>
        <BreadcrumbHeader breadcrumb={breadcrumb} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
function BreadcrumbHeader({
  breadcrumb,
}: {
  breadcrumb: {
    label: string;
    href: keyof FileRoutesByTo;
  }[];
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between pr-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            {breadcrumb.map((item) => (
              <BreadcrumbItem key={item.href}>
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        {/* 消息 */}
        <Button variant="outline">
          <Bell />
        </Button>
        {/* 用户 */}
        <Button variant="outline">
          <User />
        </Button>
      </div>
    </header>
  );
}
