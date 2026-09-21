import type { AppSettings } from "../model/types";

export interface SettingsRepository {
  get(): Promise<AppSettings | null>;
  save(settings: AppSettings): Promise<void>;
}
