import { cn } from "@/lib/utils";
import { Loading } from "../ui/loading";

interface BaseProps extends React.ComponentProps<"div"> {
  loading?: boolean;
}
function LoadingWrapper(props: BaseProps) {
  const { className, loading, ...rest } = props;
  return (
    <>
      {loading ? (
        <div
          className={cn(
            "flex justify-center items-center absolute top-0 left-0 w-full h-full bg-background/50",
            className
          )}
          {...rest}
        >
          <Loading />
        </div>
      ) : null}
      {props.children}
    </>
  );
}

function _Wrapper(props: BaseProps) {
  const { className, loading, ...rest } = props;
  return (
    <div
      className={cn("h-full flex flex-col px-4 bg-sidebar relative", className)}
      {...rest}
    >
      <LoadingWrapper loading={loading} className="h-screen">
        {props.children}
      </LoadingWrapper>
    </div>
  );
}

function Navigation(props: BaseProps) {
  const { className, loading, ...rest } = props;
  return (
    <div
      className={cn(
        "flex flex-wrap w-full items-center justify-between space-y-4 relative",
        className
      )}
      {...rest}
    >
      <LoadingWrapper loading={loading}>{props.children}</LoadingWrapper>
    </div>
  );
}

function Content(props: BaseProps) {
  const { className, loading, ...rest } = props;
  return (
    <div className={cn("flex-1 relative", className)} {...rest}>
      <LoadingWrapper loading={loading}>{props.children}</LoadingWrapper>
    </div>
  );
}

function Footer(props: BaseProps) {
  const { className, loading, ...rest } = props;
  return (
    <div className={cn("flex-1 relative", className)} {...rest}>
      <LoadingWrapper loading={loading}>{props.children}</LoadingWrapper>
    </div>
  );
}

export const Wrapper = Object.assign(_Wrapper, {
  Navigation,
  Content,
  Footer,
});
