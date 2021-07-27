import type { Model } from "app/store/types/model";

export type Message = Model & {
  message: string;
  status?: string;
  temporary: boolean;
  severity: string;
};

export type MessageState = {
  items: Message[];
};
