import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FullScreenLoading } from "@/components/ui/loading";
import { useInitialLoading } from "@/hooks/useInitialLoading";
import { AuthProvider } from "@/contexts/AuthContext";

const RootLayout = () => {
  const { isLoading, loadingProgress } = useInitialLoading();

  if (isLoading) {
    return (
      <FullScreenLoading text="正在初始化应用..." progress={loadingProgress} />
    );
  }

  return (
    <AuthProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </AuthProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
