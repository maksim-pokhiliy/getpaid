"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@app/shared/ui/toast";
import { useCreateTemplate } from "@app/features/templates";
import { ApiError } from "@app/shared/api";
import { templateFormSchema, type TemplateFormData } from "@app/shared/schemas";

export function useTemplateForm() {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreateTemplate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      currency: "USD",
      discountType: "",
      discountValue: 0,
      taxRate: 0,
      notes: "",
      dueDays: 30,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const currency = useWatch({ control, name: "currency" });
  const discountType = useWatch({ control, name: "discountType" });

  const onSubmit = (data: TemplateFormData) => {
    const submitData = {
      name: data.name,
      description: data.description || undefined,
      currency: data.currency,
      discount:
        data.discountType && data.discountValue
          ? {
              type: data.discountType as "PERCENTAGE" | "FIXED",
              value:
                data.discountType === "FIXED"
                  ? Math.round(data.discountValue * 100)
                  : data.discountValue,
            }
          : undefined,
      taxRate: data.taxRate || undefined,
      notes: data.notes || undefined,
      dueDays: data.dueDays,
      items: data.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: Math.round(item.unitPrice * 100),
      })),
    };

    createMutation.mutate(submitData, {
      onSuccess: () => {
        toast.success("Template created successfully!");
        router.push("/app/templates");
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to create template");
      },
    });
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    fields,
    append,
    remove,
    currency,
    discountType,
    isPending: createMutation.isPending,
    onSubmit,
    router,
  };
}
