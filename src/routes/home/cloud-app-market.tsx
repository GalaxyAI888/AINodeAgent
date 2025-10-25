import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Star,
  Tag,
} from "lucide-react";

export const Route = createFileRoute("/home/cloud-app-market")({
  component: RouteComponent,
});

type Category =
  | "全部"
  | "图像生成"
  | "语音合成"
  | "模型部署"
  | "图像增强"
  | "本地LLM";
type CloudApp = {
  id: string;
  name: string;
  desc: string;
  dockerImage: string;
  dockerfileUrl: string;
  stars: number;
  downloads: number;
  category: Category;
  badge?: string;
};

const CATEGORIES: Category[] = [
  "全部",
  "图像生成",
  "语音合成",
  "模型部署",
  "图像增强",
  "本地LLM",
];

const APPS: CloudApp[] = [
  {
    id: "a1111",
    name: "Automatic1111 WebUI",
    desc: "流行的 Stable Diffusion Web 界面，支持多种图像生成功能和插件",
    dockerImage: "ghcr.io/AUTOMATIC1111/stable-diffusion-webui:latest",
    dockerfileUrl:
      "https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/master/Dockerfile",
    stars: 25600,
    downloads: 1800000,
    category: "图像生成",
    badge: "图像生成",
  },
  {
    id: "voxbox",
    name: "VoxBox",
    desc: "多功能语音合成工具箱，支持多种声音模型和音频处理",
    dockerImage: "registry.cn-hangzhou.aliyuncs.com/silkcloud/voxbox:latest",
    dockerfileUrl:
      "https://github.com/Winfredy/sadTalker/blob/main/docker/Dockerfile",
    stars: 12300,
    downloads: 750000,
    category: "语音合成",
    badge: "语音合成",
  },
  {
    id: "comfyui",
    name: "ComfyUI",
    desc: "基于节点的 Stable Diffusion 界面，支持复杂工作流和自定义节点",
    dockerImage: "ghcr.io/comfyanonymous/ComfyUI:latest",
    dockerfileUrl:
      "https://github.com/comfyanonymous/ComfyUI/blob/master/Dockerfile",
    stars: 15800,
    downloads: 1200000,
    category: "图像生成",
    badge: "图像生成",
  },
  {
    id: "ollama",
    name: "Ollama",
    desc: "本地大语言模型运行框架，支持多种开源模型部署",
    dockerImage: "ollama/ollama:latest",
    dockerfileUrl: "https://github.com/ollama/ollama/blob/main/Dockerfile",
    stars: 32500,
    downloads: 6520000,
    category: "本地LLM",
    badge: "本地LLM",
  },
  {
    id: "bentoml",
    name: "BentoML",
    desc: "机器学习模型部署和服务框架，支持模型打包和 API 暴露",
    dockerImage: "bentoml/bento-server:latest",
    dockerfileUrl: "https://github.com/bentoml/BentoML/blob/main/Dockerfile",
    stars: 8700,
    downloads: 620000,
    category: "模型部署",
    badge: "模型部署",
  },
  {
    id: "upscaler",
    name: "Upscaler",
    desc: "AI 图像超分辨率工具，支持多种模型和批量处理",
    dockerImage: "ghcr.io/xinntao/real-esrgan-ncnn-vulkan:latest",
    dockerfileUrl:
      "https://github.com/xinntao/Real-ESRGAN/blob/master/Dockerfile",
    stars: 7200,
    downloads: 480000,
    category: "图像增强",
    badge: "图像增强",
  },
];

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k+`;
  return `${n}`;
}

function RouteComponent() {
  const [category, setCategory] = useState<Category>("全部");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 6;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300); // 模拟加载
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [category, q]);

  const list = useMemo(() => {
    const src =
      category === "全部" ? APPS : APPS.filter((a) => a.category === category);
    const ql = q.trim().toLowerCase();
    return ql ? src.filter((a) => a.name.toLowerCase().includes(ql)) : src;
  }, [category, q]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const start = (page - 1) * pageSize;
  const data = list.slice(start, start + pageSize);

  const handleBuild = (app: CloudApp) => {
    // TODO: 调用后端构建镜像 API
    alert(`开始构建镜像：${app.dockerImage}`);
  };

  const handleDeploy = (app: CloudApp) => {
    // TODO: 跳转或调用部署 API
    alert(`开始部署应用：${app.name}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "secondary" : "ghost"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="w-full max-w-[28rem]">
          <Input
            placeholder="搜索应用..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-[80%]" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Skeleton className="h-8 w-28" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle>{app.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {app.desc}
                      </CardDescription>
                    </div>
                    <CardAction>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                        <Tag className="size-3.5" />
                        {app.badge ?? app.category}
                      </span>
                    </CardAction>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="text-muted-foreground">
                    Docker镜像：
                    <code className="ml-1 select-all rounded bg-muted px-1 py-0.5">
                      {app.dockerImage}
                    </code>
                  </div>
                  <div className="text-muted-foreground">
                    Dockerfile：
                    <a
                      href={app.dockerfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1 inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      查看
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-4 text-yellow-500" />
                      {formatNum(app.stars)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="size-4" />
                      {formatNum(app.downloads)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => handleBuild(app)}>
                    构建镜像
                  </Button>
                  <Button onClick={() => handleDeploy(app)}>
                    部署应用
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const idx = i + 1;
              return (
                <Button
                  key={idx}
                  size="sm"
                  variant={page === idx ? "secondary" : "ghost"}
                  onClick={() => setPage(idx)}
                >
                  {idx}
                </Button>
              );
            })}
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
