import { readJson, writeJson } from "@/lib/storage";
import { SETTINGS_STORAGE_KEY } from "../model/constants";
import type { AppSettings } from "../model/types";
import type { SettingsRepository } from "./settingsRepository";

export class LocalStorageSettingsRepository implements SettingsRepository {
  async get(): Promise<AppSettings | null> {
    return readJson<AppSettings | null>(SETTINGS_STORAGE_KEY, null);
  }

  async save(settings: AppSettings): Promise<void> {
    writeJson(SETTINGS_STORAGE_KEY, settings);
  }
}
