import type { Model } from "app/store/types/model";

export type MessageType = "caution" | "information" | "negative" | "positive";

export type Message = Model & {
  message: string;
  temporary: boolean;
  type: MessageType;
};

export type MessageState = {
  items: Message[];
};
