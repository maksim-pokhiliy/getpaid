import { registerProvider } from "./providers/registry";
import { togglProvider } from "./providers/toggl";

registerProvider(togglProvider);

export type {
  BreakdownOption,
  NormalizedProject,
  NormalizedWorkspace,
  ProviderCapabilities,
  TimeEntriesResult,
  TimeEntryGroup,
  TimeEntryItem,
  TimeTrackingProvider,
} from "./providers";
export { getAllProviders, getProvider } from "./providers";
export {
  connectProvider,
  disconnectProvider,
  getConnections,
  getProjects,
  getTimeEntries,
  getWorkspaces,
} from "./service";
