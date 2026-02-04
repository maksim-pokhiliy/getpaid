"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { senderProfileFormSchema, SenderProfileFormInput } from "@app/shared/schemas";

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CHF", label: "CHF - Swiss Franc" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SenderProfileFormInput>({
    resolver: zodResolver(senderProfileFormSchema),
    defaultValues: {
      defaultCurrency: "USD",
    },
  });

  const onSubmit = async (data: SenderProfileFormInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sender-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message || "Failed to save profile");
        return;
      }

      router.push("/app/invoices");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const currency = watch("defaultCurrency");

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Complete Your Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Set up your sender information for invoices
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register("companyName")}
              label="Company Name"
              fullWidth
              margin="normal"
              error={!!errors.companyName}
              helperText={
                errors.companyName?.message ||
                "Enter your company name or leave blank if using personal name"
              }
            />
            <TextField
              {...register("displayName")}
              label="Display Name (Personal)"
              fullWidth
              margin="normal"
              error={!!errors.displayName}
              helperText={
                errors.displayName?.message || "Your personal name if not using a company"
              }
            />
            <TextField
              {...register("emailFrom")}
              label="Reply-to Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.emailFrom}
              helperText={errors.emailFrom?.message || "Email where clients can reply (optional)"}
            />
            <TextField
              {...register("address")}
              label="Business Address"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            <TextField
              {...register("taxId")}
              label="Tax ID / VAT Number"
              fullWidth
              margin="normal"
              error={!!errors.taxId}
              helperText={errors.taxId?.message || "Optional"}
            />
            <FormControl fullWidth margin="normal" error={!!errors.defaultCurrency}>
              <InputLabel id="currency-label">Default Currency</InputLabel>
              <Select
                {...register("defaultCurrency")}
                labelId="currency-label"
                label="Default Currency"
                value={currency || "USD"}
              >
                {currencies.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.defaultCurrency && (
                <FormHelperText>{errors.defaultCurrency.message}</FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
