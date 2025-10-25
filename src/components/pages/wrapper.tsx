import { cn } from "@/lib/utils";
import { Loading } from "../ui/loading";

interface WrapperProps extends React.ComponentProps<"div"> {
  loading?: boolean;
}
function _Wrapper(props: WrapperProps) {
  const { className, loading, ...rest } = props;
  return (
    <div
      className={cn("h-full flex flex-col px-4 bg-sidebar relative", className)}
      {...rest}
    >
      {loading && (
        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-screen bg-background/50">
          <Loading />
        </div>
      )}
      {props.children}
    </div>
  );
}

function Navigation(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        "flex flex-wrap w-full items-center justify-between space-y-4",
        className
      )}
      {...rest}
    >
      {props.children}
    </div>
  );
}

export const Wrapper = Object.assign(_Wrapper, {
  Navigation,
});
