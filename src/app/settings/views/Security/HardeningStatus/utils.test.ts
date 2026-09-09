import {
  parseHardeningNotification,
  parseHardeningNotifications,
} from "./utils";

import * as factory from "@/testing/factories";

describe("parseHardeningNotification", () => {
  it("splits the description and the resolving command", () => {
    const notification = factory.notification({
      id: 1,
      ident: "hardening-wildcard-bind-api-bind",
      message:
        "api_bind is not configured; the service would bind to all interfaces, which is not allowed when hardening is active Run: maas config-hardening set api_bind <specific-ip-address>",
    });

    expect(parseHardeningNotification(notification)).toStrictEqual({
      id: 1,
      configKey: "api_bind",
      description:
        "api_bind is not configured; the service would bind to all interfaces, which is not allowed when hardening is active",
      command: "maas config-hardening set api_bind <specific-ip-address>",
    });
  });

  it("extracts the config key from the resolving command", () => {
    const notification = factory.notification({
      ident: "hardening-invalid-bind-dns-bind",
      message:
        "dns_bind 'nope' is not a valid IP address Run: maas config-hardening set dns_bind <specific-ip-address>",
    });

    expect(parseHardeningNotification(notification).configKey).toBe("dns_bind");
  });

  it("keeps a controller-scoped prefix in the description", () => {
    const notification = factory.notification({
      ident: "hardening-ctrl-abc123-api_bind",
      message:
        "[abc123] api_bind '0.0.0.0' binds to all interfaces, which is not allowed when hardening is active Run: maas config-hardening set api_bind <specific-ip-address>",
    });

    const parsed = parseHardeningNotification(notification);
    expect(parsed.description).toBe(
      "[abc123] api_bind '0.0.0.0' binds to all interfaces, which is not allowed when hardening is active"
    );
    expect(parsed.configKey).toBe("api_bind");
    expect(parsed.command).toBe(
      "maas config-hardening set api_bind <specific-ip-address>"
    );
  });

  it("handles a message without a resolving command", () => {
    const notification = factory.notification({
      ident: "hardening-unknown",
      message: "Something is wrong",
    });

    expect(parseHardeningNotification(notification)).toStrictEqual({
      id: notification.id,
      configKey: "",
      description: "Something is wrong",
      command: "",
    });
  });
});

describe("parseHardeningNotifications", () => {
  it("parses a list of notifications", () => {
    const notifications = [
      factory.notification({
        message:
          "api_bind is not configured Run: maas config-hardening set api_bind <specific-ip-address>",
      }),
      factory.notification({
        message:
          "dns_bind is not configured Run: maas config-hardening set dns_bind <specific-ip-address>",
      }),
    ];

    expect(
      parseHardeningNotifications(notifications).map((r) => r.configKey)
    ).toStrictEqual(["api_bind", "dns_bind"]);
  });
});
