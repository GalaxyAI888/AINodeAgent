import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
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
  Download,
  HardDrive,
  Share2,
  Star,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/home/cloud-model-market copy")({
  // 让筛选/搜索/分页/排序持久化到 URL
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : "",
    c: (typeof s.c === "string" ? s.c : "全部") as Category,
    page: Number.isFinite(Number(s.page)) ? Math.max(1, Number(s.page)) : 1,
    sort: (typeof s.sort === "string" ? s.sort : "hot") as Sort,
  }),
  component: RouteComponent,
});

type Category = "全部" | "图像生成" | "语音识别" | "大语言模型" | "图像增强";
type Sort = "hot" | "downloads" | "score" | "size";
type ModelItem = {
  id: string;
  name: string;
  desc: string;
  sizeGB: number;
  downloads: number;
  score: number;
  category: Category;
  badge?: string;
};

const CATEGORIES: Category[] = [
  "全部",
  "图像生成",
  "语音识别",
  "大语言模型",
  "图像增强",
];
const SORT_LABEL: Record<Sort, string> = {
  hot: "综合",
  downloads: "下载量",
  score: "评分",
  size: "大小",
};

const MODELS: ModelItem[] = [
  {
    id: "sd3",
    name: "Stable Diffusion 3",
    desc: "先进的文本到图像生成模型，支持高质量图像生成",
    sizeGB: 8.9,
    downloads: 125400,
    score: 9.5,
    category: "图像生成",
    badge: "图像生成",
  },
  {
    id: "flux3",
    name: "Flux 3",
    desc: "新一代高质量图像生成模型，具有更强的想象力",
    sizeGB: 12.3,
    downloads: 89200,
    score: 9.2,
    category: "图像生成",
    badge: "图像生成",
  },
  {
    id: "whisper",
    name: "Whisper",
    desc: "多语言音频识别模型，支持自动语音转文字",
    sizeGB: 2.8,
    downloads: 320500,
    score: 9.7,
    category: "语音识别",
    badge: "语音识别",
  },
  {
    id: "llama3",
    name: "LLaMA 3",
    desc: "高性能开源大语言模型，支持多种任务和应用场景",
    sizeGB: 14.5,
    downloads: 280100,
    score: 9.6,
    category: "大语言模型",
    badge: "大语言模型",
  },
  {
    id: "mixtral8x7b",
    name: "Mixtral 8x7B",
    desc: "混合专家模型，具备更高参数效率和性能",
    sizeGB: 22.4,
    downloads: 195800,
    score: 9.4,
    category: "大语言模型",
    badge: "大语言模型",
  },
  {
    id: "gemma",
    name: "Gemma",
    desc: "轻量级开源大语言模型，适合边缘设备部署",
    sizeGB: 6.2,
    downloads: 120300,
    score: 9.1,
    category: "大语言模型",
    badge: "大语言模型",
  },
];

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k+`;
  return `${n}`;
}

function RouteComponent() {
  const router = useRouter();
  const search = Route.useSearch();

  // 从 URL 初始化
  const [category, setCategory] = useState<Category>(search.c);
  const [sort, setSort] = useState<Sort>(search.sort);
  const [page, setPage] = useState(search.page);

  // 搜索防抖：input -> 300ms -> q
  const [input, setInput] = useState(search.q);
  const [q, setQ] = useState(search.q);
  useEffect(() => {
    const t = setTimeout(() => setQ(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  // URL 同步
  useEffect(() => {
    router.navigate({
      to: "/home/cloud-model-market",
      replace: true,
      search: (prev) => ({ ...prev, q, c: category, page, sort }),
    });
  }, [q, category, page, sort, router]);

  // 切换筛选/搜索/排序时回到第 1 页
  useEffect(() => {
    setPage(1);
  }, [category, q, sort]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  // 过滤 + 排序
  const filtered = useMemo(() => {
    const src =
      category === "全部"
        ? MODELS
        : MODELS.filter((m) => m.category === category);
    const qq = q?.trim().toLowerCase();
    const byQ = qq ? src.filter((m) => m.name.toLowerCase().includes(qq)) : src;
    const sorted = [...byQ].sort((a, b) => {
      switch (sort) {
        case "downloads":
          return b.downloads - a.downloads;
        case "score":
          return b.score - a.score;
        case "size":
          return b.sizeGB - a.sizeGB;
        default:
          // 综合：下载量和评分的简单加权
          return b.downloads + b.score * 1000 - (a.downloads + a.score * 1000);
      }
    });
    return sorted;
  }, [category, q, sort]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  // 下载进度
  const [progress, setProgress] = useState<Record<string, number>>({});
  const startDownload = (m: ModelItem) => {
    if (progress[m.id] && progress[m.id] >= 100) return;
    setProgress((p) => ({ ...p, [m.id]: 1 }));
    const timer = setInterval(() => {
      setProgress((p) => {
        const val = Math.min(100, (p[m.id] ?? 0) + Math.random() * 18 + 6);
        if (val >= 100) clearInterval(timer);
        return { ...p, [m.id]: val };
      });
    }, 400);
  };

  const copyLink = async (m: ModelItem) => {
    try {
      await navigator.clipboard.writeText(`model://${m.id}`);
      alert("已复制模型链接");
    } catch {
      alert("复制失败");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-lg font-semibold">云端模型市场</div>
        <div className="text-muted-foreground text-sm">
          浏览和下载预置的 AI 模型
        </div>
      </div>

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

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                排序：{SORT_LABEL[sort]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>排序</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setSort("hot")}>
                综合
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSort("downloads")}>
                下载量
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSort("score")}>
                评分
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSort("size")}>
                大小
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className="w-[--w] max-w-[28rem]"
            style={{ ["--w" as keyof CSSProperties]: "min(28rem, 70vw)" }}
          >
            <Input
              placeholder="搜索模型..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
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
              <CardFooter className="flex items-center gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            没有找到匹配的模型，试试更换筛选条件或关键字。
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.map((m) => {
              const p = Math.floor(progress[m.id] ?? 0);
              const downloading = p > 0 && p < 100;
              const done = p >= 100;
              return (
                <Card key={m.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle>{m.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {m.desc}
                        </CardDescription>
                      </div>
                      <CardAction>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                          <Tag className="size-3.5" />
                          {m.badge ?? m.category}
                        </span>
                      </CardAction>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <HardDrive className="size-4" />
                        {m.sizeGB.toFixed(1)} GB
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Download className="size-4" />
                        {formatNum(m.downloads)}+
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-4 text-yellow-500" />
                        {m.score.toFixed(1)}/10
                      </span>
                    </div>

                    <div className="relative h-10 w-full overflow-hidden rounded-md bg-muted/50">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary transition-[width]"
                        style={{ width: done ? "100%" : `${p}%` }}
                      />
                      <div className="relative z-10 flex h-full items-center justify-center px-3">
                        <Button
                          className="w-full"
                          disabled={downloading}
                          onClick={() => (done ? undefined : startDownload(m))}
                        >
                          {done
                            ? "已下载"
                            : downloading
                              ? `下载中… ${p}%`
                              : "下载模型"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyLink(m)}
                      title="复制链接"
                    >
                      <Share2 className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
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
