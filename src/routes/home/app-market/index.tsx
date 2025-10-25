import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/app-market/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/home/app-market/"!</div>;
}
