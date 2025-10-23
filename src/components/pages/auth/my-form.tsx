import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FormProvider,
  type Control,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
interface MyFormItemProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

const Form = FormProvider;
export function MyFormItem<T extends FieldValues>(props: MyFormItemProps<T>) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <div className="flex justify-center gap-2">
              {props.prefix}
              <Input placeholder={props.placeholder} {...field} />
              {props.suffix}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function MyForm<T extends FieldValues>(props: {
  form: UseFormReturn<T>;
  onSubmit?: (values: T) => void;
  loading?: boolean;
  formItems: Omit<MyFormItemProps<T>, "control">[];
}) {
  return (
    <Form {...props.form}>
      <form
        onSubmit={props.form.handleSubmit(props?.onSubmit ?? (() => {}))}
        className="space-y-6"
      >
        {props.formItems.map((item) => (
          <MyFormItem key={item.name} {...item} control={props.form.control} />
        ))}
        <Button loading={props.loading} type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
