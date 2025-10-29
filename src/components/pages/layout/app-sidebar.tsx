import {
  AppWindow,
  AudioWaveform,
  Bell,
  Bot,
  Boxes,
  Command,
  CreditCard,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Image as ImageIcon,
  LayoutDashboard,
  ListChecks,
  Lock,
  Map,
  Package,
  PieChart,
  Server,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/pages/layout/nav-main";
import { NavProjects } from "@/components/pages/layout/nav-projects";
import { NavUser } from "@/components/pages/layout/nav-user";
import { TeamSwitcher } from "@/components/pages/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { FileRoutesByTo } from "@/routeTree.gen";

export interface NavItem {
  title: string;
  url: keyof FileRoutesByTo;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  collapsible?: boolean;
}
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
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
  ] satisfies NavItem[],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  items,
  ...props
}: React.ComponentProps<typeof Sidebar> & { items: NavItem[] }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
