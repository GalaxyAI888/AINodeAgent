import { cn } from "@/lib/utils";

export default function Wrapper(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn("h-full flex flex-col px-4 bg-sidebar", className)}
      {...rest}
    >
      {props.children}
    </div>
  );
}
