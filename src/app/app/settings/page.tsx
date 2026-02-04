"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  alpha,
  useTheme,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PaymentIcon from "@mui/icons-material/Payment";
import { AppLayout } from "@app/components/layout/AppLayout";
import { Breadcrumbs } from "@app/components/navigation/Breadcrumbs";
import { PageLoader, Spinner } from "@app/components/feedback/Loading";
import { useToast } from "@app/components/feedback/Toast";
import { senderProfileFormSchema, SenderProfileFormInput } from "@app/shared/schemas";

interface SenderProfile {
  id: string;
  companyName: string | null;
  displayName: string | null;
  emailFrom: string | null;
  address: string | null;
  taxId: string | null;
  defaultCurrency: string;
  stripeAccountId: string | null;
}

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CHF", label: "CHF - Swiss Franc" },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
  );
}

export default function SettingsPage() {
  const theme = useTheme();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const { data: profile, isLoading } = useQuery<SenderProfile>({
    queryKey: ["sender-profile"],
    queryFn: async () => {
      const response = await fetch("/api/sender-profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset,
  } = useForm<SenderProfileFormInput>({
    resolver: zodResolver(senderProfileFormSchema),
    defaultValues: {
      companyName: "",
      displayName: "",
      emailFrom: "",
      address: "",
      taxId: "",
      defaultCurrency: "USD",
    },
  });

  React.useEffect(() => {
    if (profile) {
      reset({
        companyName: profile.companyName || "",
        displayName: profile.displayName || "",
        emailFrom: profile.emailFrom || "",
        address: profile.address || "",
        taxId: profile.taxId || "",
        defaultCurrency: profile.defaultCurrency || "USD",
      });
    }
  }, [profile, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: SenderProfileFormInput) => {
      const response = await fetch("/api/sender-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sender-profile"] });
      toast.success("Settings saved successfully!");
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const onSubmit = (data: SenderProfileFormInput) => {
    setError(null);
    updateProfileMutation.mutate(data);
  };

  const currency = useWatch({ control, name: "defaultCurrency" });

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader message="Loading settings..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Breadcrumbs items={[{ label: "Settings" }]} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your account and business settings
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <Tab
            icon={<BusinessIcon />}
            iconPosition="start"
            label="Business Profile"
            sx={{ minHeight: 64 }}
          />
          <Tab
            icon={<PaymentIcon />}
            iconPosition="start"
            label="Payments"
            sx={{ minHeight: 64 }}
          />
        </Tabs>

        <Box sx={{ p: 4 }}>
          <TabPanel value={tabValue} index={0}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Company Information
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 4,
                }}
              >
                <TextField
                  {...register("companyName")}
                  label="Company Name"
                  fullWidth
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message || "Your business or company name"}
                />
                <TextField
                  {...register("displayName")}
                  label="Display Name"
                  fullWidth
                  error={!!errors.displayName}
                  helperText={
                    errors.displayName?.message || "Your personal name (if not using company)"
                  }
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Contact & Address
              </Typography>
              <Box sx={{ display: "grid", gap: 3, mb: 4 }}>
                <TextField
                  {...register("emailFrom")}
                  label="Reply-to Email"
                  type="email"
                  fullWidth
                  error={!!errors.emailFrom}
                  helperText={errors.emailFrom?.message || "Email where clients can reply"}
                />
                <TextField
                  {...register("address")}
                  label="Business Address"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message || "Will appear on your invoices"}
                />
                <TextField
                  {...register("taxId")}
                  label="Tax ID / VAT Number"
                  fullWidth
                  error={!!errors.taxId}
                  helperText={errors.taxId?.message || "Optional - displayed on invoices"}
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Invoice Defaults
              </Typography>
              <Box sx={{ maxWidth: 300 }}>
                <FormControl fullWidth error={!!errors.defaultCurrency}>
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
              </Box>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isDirty || updateProfileMutation.isPending}
                  sx={{ minWidth: 150 }}
                >
                  {updateProfileMutation.isPending ? <Spinner size={20} /> : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <PaymentIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {profile?.stripeAccountId ? "Stripe Connected" : "Connect Stripe"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
              >
                {profile?.stripeAccountId
                  ? "Your Stripe account is connected. You can accept online payments from your clients."
                  : "Connect your Stripe account to accept online payments directly from invoices."}
              </Typography>
              {profile?.stripeAccountId ? (
                <Alert severity="success" sx={{ maxWidth: 400, mx: "auto", borderRadius: 2 }}>
                  Stripe account connected successfully
                </Alert>
              ) : (
                <Button variant="contained" startIcon={<PaymentIcon />} size="large">
                  Connect Stripe Account
                </Button>
              )}
            </Box>
          </TabPanel>
        </Box>
      </Paper>
    </AppLayout>
  );
}
