import { actions } from "./";

describe("device actions", () => {
  it("should handle fetching devices", () => {
    expect(actions.fetch()).toEqual({
      type: "device/fetch",
      meta: {
        model: "device",
        method: "list",
      },
      payload: null,
    });
  });

  it("should handle creating devices", () => {
    expect(
      actions.create({
        interfaces: [
          {
            mac: "aa:bb:cc",
            ip_assignment: "external",
            ip_address: "1.2.3.4",
            subnet: 9,
          },
        ],
      })
    ).toEqual({
      type: "device/create",
      meta: {
        model: "device",
        method: "create",
      },
      payload: {
        params: {
          interfaces: [
            {
              mac: "aa:bb:cc",
              ip_assignment: "external",
              ip_address: "1.2.3.4",
              subnet: 9,
            },
          ],
        },
      },
    });
  });

  it("should handle updating devices", () => {
    expect(
      actions.update({
        system_id: "abc123",
        interfaces: [
          {
            mac: "aa:bb:cc",
            ip_assignment: "external",
            ip_address: "1.2.3.4",
            subnet: 9,
          },
        ],
      })
    ).toEqual({
      type: "device/update",
      meta: {
        model: "device",
        method: "update",
      },
      payload: {
        params: {
          system_id: "abc123",
          interfaces: [
            {
              mac: "aa:bb:cc",
              ip_assignment: "external",
              ip_address: "1.2.3.4",
              subnet: 9,
            },
          ],
        },
      },
    });
  });
});
