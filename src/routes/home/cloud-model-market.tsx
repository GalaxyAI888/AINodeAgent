import { getCloudAppMarketList } from "@/api/home/cloud-app-market";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download, HardDrive, Star, Tag } from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/home/cloud-model-market")({
  component: RouteComponent,
});
const CATEGORIES = [
  {
    label: "全部",
    value: "all",
  },
  {
    label: "图像生成",
    value: "image",
  },
  {
    label: "语音识别",
    value: "audio",
  },
  {
    label: "大语言模型",
    value: "language",
  },
  {
    label: "图像增强",
    value: "image-enhancement",
  },
];

const MODELS = [
  {
    name: "Stable Diffusion 3",
    description: "先进的文本到图像生成模型，支持高质量图像生成",
    category: "图像生成",
    downloads: 100000,
    score: 9.5,
    sizeGB: 8.9,
  },
  {
    name: "Flux 3",
    description: "新一代高质量图像生成模型，具有更强的想象力",
    category: "图像生成",
    downloads: 80000,
    score: 9.2,
    sizeGB: 12.3,
  },
  {
    name: "Whisper",
    description: "多语言音频识别模型，支持自动语音转文字",
    category: "语音识别",
    downloads: 60000,
    score: 9.7,
    sizeGB: 2.8,
  },
  {
    name: "LLaMA 3",
    description: "高性能开源大语言模型，支持多种任务和应用场景",
    category: "大语言模型",
    downloads: 40000,
    score: 9.6,
    sizeGB: 14.5,
  },
  {
    name: "Mixtral 8x7B",
    description: "混合专家模型，具备更高参数效率和性能",
    category: "大语言模型",
    downloads: 20000,
    score: 9.4,
    sizeGB: 22.4,
  },
  {
    name: "Gemma",
    description: "轻量级开源大语言模型，适合边缘设备部署",
    category: "大语言模型",
    downloads: 10000,
    score: 9.1,
    sizeGB: 6.2,
  },
];

function RouteComponent() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const { data, isLoading } = useQuery({
    queryKey: ["cloud-app-market-list"],
    queryFn: () => getCloudAppMarketList({ limit: 10, skip: 0 }),
  });

  console.log(data);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>模型市场</CardTitle>
        <CardDescription>模型市场是分享和发现模型的平台。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NavigationView
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
        />
        <ModelList models={MODELS} />
        <Pagination />
      </CardContent>
    </Card>
  );
}

interface RadioButtonGroupProps {
  categories: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}

function RadioButtonGroup(props: RadioButtonGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {props.categories.map((c) => (
        <div key={c.value} className="flex items-center gap-2">
          <Button
            key={c.value}
            onClick={() => props.onChange(c.value)}
            size="sm"
            className="px-4 rounded-2xl"
            variant={props.value === c.value ? "default" : "outline"}
          >
            {c.label}
          </Button>
        </div>
      ))}
    </div>
  );
}

interface NavigationViewProps {
  category: string;
  setCategory: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

function NavigationView(props: NavigationViewProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm text-gray-500">类型：</div>
        {/* 分类 */}
        <RadioButtonGroup
          categories={CATEGORIES}
          value={props.category}
          onChange={(value) => props.setCategory(value)}
        />
      </div>

      <div className="w-max-w-md">
        <Input
          placeholder="搜索模型..."
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

interface ModelListProps {
  models: {
    name: string;
    description: string;
    category: string;
    downloads: number;
    score: number;
    sizeGB: number;
  }[];
}

function ModelList(props: ModelListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {props.models.map((model) => (
        <ModelCard key={model.name} model={model} />
      ))}
    </div>
  );
}

interface ModelCardProps {
  model: {
    name: string;
    description: string;
    category: string;
    downloads: number;
    score: number;
    sizeGB: number;
  };
}

function ModelCard(props: ModelCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.model.name}</CardTitle>
        <CardDescription>{props.model.description}</CardDescription>
        <CardAction>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
            <Tag className="size-3.5" />
            {props.model.category}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <Download className="size-4" />
            {props.model.downloads}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-4 text-yellow-500" />
            {props.model.score.toFixed(1)}/10
          </span>
          <span className="inline-flex items-center gap-1">
            <HardDrive className="size-4" />
            {props.model.sizeGB.toFixed(1)} GB
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button variant="outline" size="sm">
            复制链接
          </Button>
          <Button variant="outline" size="sm">
            分享
          </Button>
          <Button variant="outline" size="sm">
            收藏
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full">
          下载模型
        </Button>
      </CardFooter>
    </Card>
  );
}
