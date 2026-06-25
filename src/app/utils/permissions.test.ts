import { hasPermissions } from "./permissions";

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
