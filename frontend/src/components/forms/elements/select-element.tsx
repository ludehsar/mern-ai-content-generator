import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { type SelectProps } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import type { TOption } from "@/types/common";

interface Props extends SelectProps {
  name: string;
  label?: string;
  options: TOption[];
  description?: string;
  placeholder?: string;
  className?: string;
}

const SelectElement = ({
  name,
  label,
  description,
  options,
  placeholder,
  disabled = false,
  className,
  ...props
}: Props) => {
  const { control, setValue } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            {...props}
            onValueChange={(value) => setValue(name, value)}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn("notranslate")}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn("notranslate")}>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectElement;
