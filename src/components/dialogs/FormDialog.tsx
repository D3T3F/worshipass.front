"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import * as z from "zod";
import { InputDefault } from "@/components/inputs/InputDefault";

type InputField = {
  name: string;
  label: string;
  type?: string;
  mask?: (value: string) => string;
};

interface FormDialogProps<T extends z.ZodType<any, any, any>> {
  schema: T;
  inputs: InputField[];
  isOpen: boolean;
  isEditing?: boolean;
  initialValues?: z.infer<T>;
  onClose: () => void;
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
  title?: string;
  isSubmitting?: boolean;
}

export function FormDialog<T extends z.ZodType<any, any, any>>({
  schema,
  inputs,
  isOpen,
  isEditing = false,
  initialValues,
  onClose,
  onSubmit,
  title,
  isSubmitting = false,
}: FormDialogProps<T>) {
  const { handleSubmit, control, reset } = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as Resolver<z.infer<T>>,
    defaultValues: initialValues ?? ({} as z.infer<T>),
  });

  React.useEffect(() => {
    reset(initialValues ?? ({} as z.infer<T>));
  }, [initialValues, reset]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {title || (isEditing ? "Editar" : "Novo registro")}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          {inputs.map((input) => (
            <Controller
              key={input.name}
              name={input.name as any}
              control={control}
              render={({ field, fieldState }) => (
                <InputDefault
                  title={input.label}
                  type={input.type || "text"}
                  value={
                    input.type === "date" && field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : field.value ?? ""
                  }
                  onChange={(e) => {
                    let val = e.target.value;
                    if (input.mask) val = input.mask(val);
                    if (input.type === "date") field.onChange(new Date(val));
                    else if (input.type === "number")
                      field.onChange(Number(val.replace(/\D/g, "")));
                    else field.onChange(val);
                  }}
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
