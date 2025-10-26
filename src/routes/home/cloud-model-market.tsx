import { getCloudAppMarketList } from "@/api/home/cloud-app-market";
import type { CloudApp } from "@/api/home/model/index.type";
import { Wrapper } from "@/components/pages/wrapper";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download, HardDrive, Tag } from "lucide-react";
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
function RouteComponent() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const { data, isLoading } = useQuery({
    queryKey: ["cloud-app-market-list"],
    queryFn: () => getCloudAppMarketList({ limit: 10, skip: 0 }),
  });

  console.log(data);

  return (
    <Wrapper className="space-y-4" loading={isLoading}>
      <div className="">
        <h2 className="text-2xl font-bold">模型市场</h2>
        <p className="text-sm text-muted-foreground">
          模型市场是分享和发现模型的平台。
        </p>
      </div>
      <Wrapper.Navigation>
        <div className="flex flex-wrap items-center gap-2 m-0">
          <div className="text-sm text-gray-500">类型：</div>
          {/* 分类 */}
          <RadioButtonGroup
            categories={CATEGORIES}
            value={category}
            onChange={(value) => setCategory(value)}
          />
        </div>

        <div className="w-max-w-md">
          <Input
            placeholder="搜索模型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Wrapper.Navigation>
      <Wrapper.Content>
        <ModelList models={data?.results || []} />
      </Wrapper.Content>
      <Wrapper.Footer>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Wrapper.Footer>
    </Wrapper>
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

interface ModelListProps {
  models: CloudApp[];
}

function ModelList(props: ModelListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {props.models.map((model) => (
        <ModelCard key={model.objectId} model={model} />
      ))}
    </div>
  );
}

interface ModelCardProps {
  model: CloudApp;
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
            {props.model.tags.join(", ")}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <HardDrive className="size-4" />
            {props.model.modelsize}
          </span>
          <span className="inline-flex items-center gap-1">
            <Download className="size-4" />
            {props.model.modelscope_path}
          </span>
          {/* <span className="inline-flex items-center gap-1">
            <Star className="size-4 text-yellow-500" />
            {props.model.modelsize}
          </span> */}
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
        <Button
          variant="default"
          className="w-full"
          // onClick={() => handleDownload(props.model.path)}
        >
          下载模型
        </Button>
      </CardFooter>
    </Card>
  );
}
