"use client";

import * as React from "react";
import { Box, Button, Typography, TextField, Divider } from "@mui/material";
import { Spinner } from "@app/shared/ui/loading";
import { useToast } from "@app/shared/ui/toast";
import { useUpdateSenderProfile } from "@app/features/settings";
import { ApiError } from "@app/shared/api";
import type { SenderProfile } from "@app/shared/schemas/api";
import { LogoPreview } from "./logo-preview";
import { BrandColors } from "./brand-colors";
import { BrandingPreview } from "./branding-preview";

const DEFAULT_PRIMARY = "#1976d2";
const DEFAULT_ACCENT = "#9c27b0";
const DEFAULT_CURRENCY = "USD";

const toUndefined = (val: string | null | undefined): string | undefined => val || undefined;

interface BrandingTabProps {
  profile: SenderProfile | undefined;
}

export function BrandingTab({ profile }: BrandingTabProps) {
  const toast = useToast();
  const mutation = useUpdateSenderProfile();

  const [logoUrl, setLogoUrl] = React.useState("");
  const [primaryColor, setPrimaryColor] = React.useState(DEFAULT_PRIMARY);
  const [accentColor, setAccentColor] = React.useState(DEFAULT_ACCENT);
  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setLogoUrl(profile.logoUrl || "");
      setPrimaryColor(profile.primaryColor || DEFAULT_PRIMARY);
      setAccentColor(profile.accentColor || DEFAULT_ACCENT);
      setIsDirty(false);
    }
  }, [profile]);

  const markDirty = () => setIsDirty(true);

  const handleSave = () => {
    const data = {
      companyName: toUndefined(profile?.companyName),
      displayName: toUndefined(profile?.displayName),
      emailFrom: toUndefined(profile?.emailFrom),
      address: toUndefined(profile?.address),
      taxId: toUndefined(profile?.taxId),
      defaultCurrency: profile?.defaultCurrency || DEFAULT_CURRENCY,
      logoUrl: toUndefined(logoUrl),
      primaryColor: toUndefined(primaryColor),
      accentColor: toUndefined(accentColor),
    };

    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Branding saved successfully!");
        setIsDirty(false);
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Failed to save branding");
      },
    });
  };

  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
        Invoice Branding
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Customize how your invoices look to clients.
      </Typography>

      <Box sx={{ display: "grid", gap: 4, maxWidth: 500 }}>
        <TextField
          label="Logo URL"
          value={logoUrl}
          onChange={(e) => {
            setLogoUrl(e.target.value);
            markDirty();
          }}
          fullWidth
          placeholder="https://example.com/logo.png"
          helperText="Enter a URL to your company logo (recommended: 200x60px)"
        />
        <LogoPreview logoUrl={logoUrl} />
        <Divider />
        <BrandColors
          primaryColor={primaryColor}
          accentColor={accentColor}
          onPrimaryChange={(v) => {
            setPrimaryColor(v);
            markDirty();
          }}
          onAccentChange={(v) => {
            setAccentColor(v);
            markDirty();
          }}
        />
        <Divider />
        <BrandingPreview
          logoUrl={logoUrl}
          companyName={profile?.companyName || profile?.displayName || ""}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isDirty || mutation.isPending}
          sx={{ minWidth: 150 }}
        >
          {mutation.isPending ? <Spinner size={20} /> : "Save Changes"}
        </Button>
      </Box>
    </>
  );
}
