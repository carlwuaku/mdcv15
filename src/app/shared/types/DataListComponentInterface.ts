import { DataActionsButton } from "../components/load-data-list/data-actions-button.interface";

export interface DataListComponentInterface<T> {
  baseUrl: string;
  url: string;
  ts: string;

  getActions(object: T): DataActionsButton[];

  updateTimestamp(): void;

  setSelectedItems(objects: T[]): void;

  specialClasses: Record<string, string>;
}
