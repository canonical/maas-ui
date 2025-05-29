import { renderHook } from "@testing-library/react";

import useSSHKeysTableColumns from "@/app/preferences/views/SSHKeys/components/SSHKeysTable/useSSHKeysTableColumns/useSSHKeysTableColumns";

vi.mock("@/context", async () => {
  const actual = await vi.importActual("@/context");
  return {
    ...actual!,
  };
});

it("returns the correct number of columns", () => {
  const { result } = renderHook(() => useSSHKeysTableColumns());
  expect(result.current).toBeInstanceOf(Array);
  expect(result.current.map((column) => column.id)).toStrictEqual([
    "source",
    "auth_id",
    "keys",
    "action",
  ]);
});
