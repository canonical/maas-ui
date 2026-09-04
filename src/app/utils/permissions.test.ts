import { hasEntitlementForPool, hasPermissions } from "./permissions";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import * as factory from "@/testing/factories";

describe("hasPermissions", () => {
  it("returns true when no permissions are required", () => {
    expect(hasPermissions([], undefined)).toBe(true);
    expect(hasPermissions([], [])).toBe(true);
  });

  it("returns true when all required entitlements are held", () => {
    const current = [
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONTROLLERS }),
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS }),
    ];
    expect(
      hasPermissions(current, [
        Entitlement.CAN_VIEW_CONTROLLERS,
        Entitlement.CAN_VIEW_CONFIGURATIONS,
      ])
    ).toBe(true);
  });

  it("returns false when only some required entitlements are held", () => {
    const current = [
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONTROLLERS }),
    ];
    expect(
      hasPermissions(current, [
        Entitlement.CAN_VIEW_CONTROLLERS,
        Entitlement.CAN_VIEW_CONFIGURATIONS,
      ])
    ).toBe(false);
  });

  it("treats an edit entitlement as satisfying the view equivalent", () => {
    const current = [
      factory.entitlement({ entitlement: Entitlement.CAN_EDIT_CONTROLLERS }),
    ];
    expect(hasPermissions(current, [Entitlement.CAN_VIEW_CONTROLLERS])).toBe(
      true
    );
  });

  it("does not treat a view entitlement as satisfying the edit requirement", () => {
    const current = [
      factory.entitlement({ entitlement: Entitlement.CAN_VIEW_CONTROLLERS }),
    ];
    expect(hasPermissions(current, [Entitlement.CAN_EDIT_CONTROLLERS])).toBe(
      false
    );
  });
});

describe("hasEntitlementForPool", () => {
  it("returns false when the user has no entitlements", () => {
    expect(hasEntitlementForPool([], Entitlement.CAN_EDIT_MACHINES, 2)).toBe(
      false
    );
    expect(
      hasEntitlementForPool(undefined, Entitlement.CAN_EDIT_MACHINES, 2)
    ).toBe(false);
  });

  it("returns true for a global (maas) grant regardless of pool", () => {
    const current = [
      factory.entitlement({
        entitlement: Entitlement.CAN_EDIT_MACHINES,
        resource_type: "maas",
        resource_id: 0,
      }),
    ];
    expect(
      hasEntitlementForPool(current, Entitlement.CAN_EDIT_MACHINES, 2)
    ).toBe(true);
  });

  it("returns true for a pool grant matching the given pool", () => {
    const current = [
      factory.entitlement({
        entitlement: Entitlement.CAN_EDIT_MACHINES,
        resource_type: "pool",
        resource_id: 2,
      }),
    ];
    expect(
      hasEntitlementForPool(current, Entitlement.CAN_EDIT_MACHINES, 2)
    ).toBe(true);
  });

  it("returns false for a pool grant scoped to a different pool", () => {
    const current = [
      factory.entitlement({
        entitlement: Entitlement.CAN_EDIT_MACHINES,
        resource_type: "pool",
        resource_id: 3,
      }),
    ];
    expect(
      hasEntitlementForPool(current, Entitlement.CAN_EDIT_MACHINES, 2)
    ).toBe(false);
  });

  it("treats an edit entitlement as satisfying the view equivalent", () => {
    const current = [
      factory.entitlement({
        entitlement: Entitlement.CAN_EDIT_MACHINES,
        resource_type: "pool",
        resource_id: 2,
      }),
    ];
    expect(
      hasEntitlementForPool(current, Entitlement.CAN_VIEW_MACHINES, 2)
    ).toBe(true);
  });
});
