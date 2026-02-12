export type BreakdownOption = "projects" | "clients" | "tasks" | "descriptions";

export type RoundingDirection = "nearest" | "up" | "down";

export interface ProviderCapabilities {
  breakdownOptions: BreakdownOption[];
  allowedCombinations: Record<string, BreakdownOption[]>;
  roundingOptions: readonly number[];
  roundingDirections: RoundingDirection[];
  hasClients: boolean;
  hasTasks: boolean;
  hasBillableRates: boolean;
  hasCurrency: boolean;
  hasProjects: boolean;
}

export interface ProviderUser {
  id: string;
  email: string;
  name: string;
  defaultWorkspaceId: string;
}

export interface NormalizedWorkspace {
  id: string;
  name: string;
  defaultCurrency: string | null;
  defaultHourlyRateCents: number | null;
  roundingDirection: RoundingDirection;
  roundingMinutes: number;
}

export interface NormalizedProject {
  id: string;
  name: string;
  clientId: string | null;
  clientName: string | null;
  active: boolean;
  billable: boolean;
  color: string | null;
  currency: string | null;
  rateCents: number | null;
}

export interface NormalizedClient {
  id: string;
  name: string;
}

export interface TimeEntriesQuery {
  workspaceId: string;
  startDate: string;
  endDate: string;
  projectIds?: string[];
  grouping: BreakdownOption;
  subGrouping: BreakdownOption;
  roundingMinutes?: number;
  billableOnly?: boolean;
}

export interface TimeEntryGroup {
  id: string;
  title: string;
  items: TimeEntryItem[];
  totalSeconds: number;
  totalAmountCents: number | null;
}

export interface TimeEntryItem {
  id: string;
  title: string;
  seconds: number;
  amountCents: number | null;
  rateCents: number | null;
  currency: string | null;
}

export interface TimeEntriesResult {
  groups: TimeEntryGroup[];
  totalSeconds: number;
  totalAmountCents: number | null;
  currency: string | null;
}

export interface TimeTrackingProvider {
  id: string;
  name: string;
  capabilities: ProviderCapabilities;

  validateToken(token: string): Promise<{ valid: boolean; user?: ProviderUser }>;
  getWorkspaces(token: string): Promise<NormalizedWorkspace[]>;
  getProjects(token: string, workspaceId: string): Promise<NormalizedProject[]>;
  getClients(token: string, workspaceId: string): Promise<NormalizedClient[]>;
  getTimeEntries(token: string, query: TimeEntriesQuery): Promise<TimeEntriesResult>;
}
