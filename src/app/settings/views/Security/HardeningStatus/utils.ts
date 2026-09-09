import type { Notification } from "@/app/store/notification/types";

export type HardeningRequirement = {
  id: Notification["id"];
  configKey: string;
  description: string;
  command: string;
};

// Hardening notification messages have the shape "<description> Run: <command>",
// where the command is the resolving `maas config-hardening set ...` invocation.
const RUN_SEPARATOR = " Run: ";
const CONFIG_KEY_REGEX = /config-hardening set (\S+)/;

/**
 * Parse a single hardening notification into a requirement row.
 * @param notification - a hardening notification.
 * @returns The parsed hardening requirement.
 */
export const parseHardeningNotification = (
  notification: Notification
): HardeningRequirement => {
  const message = notification.message ?? "";
  const runIndex = message.indexOf(RUN_SEPARATOR);
  const hasCommand = runIndex !== -1;
  const description = (
    hasCommand ? message.slice(0, runIndex) : message
  ).trim();
  const command = hasCommand
    ? message.slice(runIndex + RUN_SEPARATOR.length).trim()
    : "";
  const configKey = CONFIG_KEY_REGEX.exec(command)?.[1] ?? "";
  return { id: notification.id, configKey, description, command };
};

/**
 * Parse hardening notifications into requirement rows for the table.
 * @param notifications - hardening notifications.
 * @returns The parsed hardening requirements.
 */
export const parseHardeningNotifications = (
  notifications: Notification[]
): HardeningRequirement[] => notifications.map(parseHardeningNotification);
