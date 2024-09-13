import {
  useForm,
  FieldValues,
  DefaultValues,
  UseFormReturn,
} from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AMOUNT_OPTIONS, RESOLUTION_OPTIONS } from "@/contants";
import { cn } from "@/lib/utils";

interface CommonInputProps<T extends FieldValues> {
  onSubmit: (values: T) => Promise<void>;
  placeholder?: string;
  isLoading?: boolean;
  showFields?: boolean;
  form: UseFormReturn<T>;
}

export const CommonInput = <T extends FieldValues>({
  onSubmit,
  placeholder = "Start a conversation...",
  isLoading = false,
  showFields = false,
  form,
}: CommonInputProps<T>) => {
  return (
    <div className={cn("text-md px-3 w-full", "md:px-5", "lg:px-1", "xl:px-5")}>
      <div className="w-full">
        <div
          className={cn(
            "mx-auto flex flex-1 gap-4 text-md",
            "md:gap-5 md:max-w-3xl",
            "lg:gap-6 lg:max-w-[40rem]",
            "xl:max-w-[48rem]"
          )}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex"
            >
              <div className="relative flex h-full max-w-full flex-1">
                <div className="group relative flex w-full items-center">
                  <div className="flex w-full flex-col gap-1.5 p-1.5 bg-[#f4f4f4] dark:bg-slate-500 rounded-[26px] transition-colors">
                    <div className="flex items-end gap-1.5 md:gap-2">
                      <FormField
                        name="prompt"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-0 flex-col">
                            <FormControl>
                              <Textarea
                                className="border-0 w-full px-0 pl-2 lg:pl-4 resize-none min-h-[32px] max-h-[25vh] h-[40px] outline-none bg-transparent overflow-hidden focus:ring-0 focus-visible:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                disabled={isLoading}
                                placeholder={placeholder}
                                {...field}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {showFields && (
                        <>
                          {/* Amount Field */}
                          <FormField
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  disabled={isLoading}
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue defaultValue={field.value} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {AMOUNT_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          {/* Resolution Field */}
                          <FormField
                            name="resolution"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  disabled={isLoading}
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue defaultValue={field.value} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {RESOLUTION_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      <Button
                        variant={"outline"}
                        disabled={isLoading}
                        className="rounded-full w-10 h-10 flex items-center justify-center p-0 me-1 mb-1"
                      >
                        <Send size={24} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div className="relative w-full px-2 py-2 text-center text-xs text-slate-400 md:px-[60px] lg:px-[80px]">
          <span>FreemanAI can misstakes. Check important info.</span>
        </div>
      </div>
    </div>
  );
};
