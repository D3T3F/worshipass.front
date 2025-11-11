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
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { InputDefault } from "@/components/inputs/InputDefault";

type InputField = {
  name: string;
  label: string;
  type?: string;
  mask?: (value: string) => string;
};

interface FormDialogProps<T extends z.ZodTypeAny> {
  schema: T;
  inputs: InputField[];
  isOpen: boolean;
  isEditing?: boolean;
  initialValues?: z.infer<T>;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
  title?: string;
  isSubmitting?: boolean;
}

export function FormDialog<T extends z.ZodTypeAny>({
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
  const {
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: initialValues ?? {},
  });

  React.useEffect(() => {
    reset(initialValues ?? {});
  }, [initialValues, reset]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title || (isEditing ? "Editar" : "Novo registro")}</DialogTitle>
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
