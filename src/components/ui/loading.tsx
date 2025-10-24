import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({
  className,
  size = "md",
  text = "加载中...",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

export function FullScreenLoading({
  text = "正在加载应用...",
  progress = 0,
}: {
  text?: string;
  progress?: number;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center w-full max-w-md px-6">
        {/* Logo 区域 */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-lg">
          <svg
            className="w-10 h-10 text-primary-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Loading 动画 */}
        <Loading size="lg" text={text} />

        {/* 进度条 */}
        <div className="mt-6 w-full">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>

        {/* 版本信息 */}
        <p className="mt-8 text-xs text-muted-foreground">
          AI Node Agent v1.0.0
        </p>
      </div>
    </div>
  );
}
