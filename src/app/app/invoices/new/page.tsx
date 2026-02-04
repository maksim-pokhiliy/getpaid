"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppLayout } from "@app/components/layout/AppLayout";
import {
  invoiceFormSchema,
  InvoiceFormInput,
  createClientSchema,
  CreateClientInput,
} from "@app/shared/schemas";

interface Client {
  id: string;
  name: string;
  email: string;
}

const currencies = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
];

export default function NewInvoicePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = React.useState<string | null>(null);
  const [clientDialogOpen, setClientDialogOpen] = React.useState(false);

  const { data: clients, isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientId: "",
      currency: "USD",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (
      data: InvoiceFormInput & {
        items: Array<{ description: string; quantity: number; unitPrice: number }>;
      }
    ) => {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || "Failed to create invoice");
      }
      return response.json();
    },
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.push(`/app/invoices/${invoice.id}`);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit = (data: InvoiceFormInput) => {
    setError(null);
    const transformedData = {
      ...data,
      dueDate: data.dueDate,
      items: data.items.map((item) => ({
        ...item,
        unitPrice: Math.round(item.unitPrice * 100),
      })),
    };
    createInvoiceMutation.mutate(transformedData);
  };

  const items = watch("items");
  const currency = watch("currency");

  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          New Invoice
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
              <FormControl fullWidth error={!!errors.clientId}>
                <InputLabel id="client-label">Client</InputLabel>
                <Select
                  {...register("clientId")}
                  labelId="client-label"
                  label="Client"
                  disabled={clientsLoading}
                >
                  {clients?.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </MenuItem>
                  ))}
                </Select>
                {errors.clientId && (
                  <Typography variant="caption" color="error">
                    {errors.clientId.message}
                  </Typography>
                )}
                <Button
                  size="small"
                  onClick={() => setClientDialogOpen(true)}
                  sx={{ mt: 1, alignSelf: "flex-start" }}
                >
                  + Add New Client
                </Button>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  {...register("currency")}
                  labelId="currency-label"
                  label="Currency"
                  defaultValue="USD"
                >
                  {currencies.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                {...register("dueDate")}
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Items
            </Typography>

            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto",
                  gap: 2,
                  mb: 2,
                  alignItems: "start",
                }}
              >
                <TextField
                  {...register(`items.${index}.description`)}
                  label="Description"
                  error={!!errors.items?.[index]?.description}
                  helperText={errors.items?.[index]?.description?.message}
                />
                <TextField
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  label="Qty"
                  type="number"
                  inputProps={{ min: 1 }}
                  error={!!errors.items?.[index]?.quantity}
                  helperText={errors.items?.[index]?.quantity?.message}
                />
                <TextField
                  {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                  label={`Price (${currency})`}
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  error={!!errors.items?.[index]?.unitPrice}
                  helperText={errors.items?.[index]?.unitPrice?.message}
                />
                <IconButton
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  color="error"
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
              sx={{ mb: 3 }}
            >
              Add Item
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Box>
                <Typography variant="body1">
                  Subtotal: {currency}{" "}
                  {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="h6">
                  Total: {currency} {subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => router.push("/app/invoices")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={createInvoiceMutation.isPending}>
                {createInvoiceMutation.isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  "Create Invoice"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <AddClientDialog
        open={clientDialogOpen}
        onClose={() => setClientDialogOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["clients"] });
          setClientDialogOpen(false);
        }}
      />
    </AppLayout>
  );
}

function AddClientDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || "Failed to create client");
      }
      return response.json();
    },
    onSuccess: () => {
      reset();
      onSuccess();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit = (data: CreateClientInput) => {
    setError(null);
    createClientMutation.mutate(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Client</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            {...register("name")}
            label="Client Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            {...register("email")}
            label="Client Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={createClientMutation.isPending}>
            {createClientMutation.isPending ? "Creating..." : "Add Client"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
