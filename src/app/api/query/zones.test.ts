import type { UseQueryResult } from "@tanstack/react-query";
import { type JsonBodyType } from "msw";

import { useZoneCount, useZoneById, useZones } from "./zones";

import * as factory from "@/testing/factories";
import {
  renderHookWithQueryClient,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const { mockGet } = setupMockServer();

const setupTest = (
  hook: () => ReturnType<
    typeof useZoneCount | typeof useZoneById | typeof useZones
  >,
  mockData: JsonBodyType
) => {
  mockGet("zones", mockData);
  return renderHookWithQueryClient(() => hook()) as {
    result: { current: UseQueryResult<number> };
  };
};

describe("useZones", () => {
  it("should return zones data when query succeeds", async () => {
    const mockZones = [factory.zone(), factory.zone()];
    const { result } = setupTest(useZones, mockZones);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockZones);
  });
});

describe("useZoneById", () => {
  it("should return specific zone when query succeeds", async () => {
    const mockZones = [factory.zone({ id: 1 }), factory.zone({ id: 2 })];
    const { result } = setupTest(() => useZoneById(1), mockZones);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockZones[0]);
  });

  it("should return null when zone is not found", async () => {
    const mockZones = [factory.zone({ id: 1 })];
    const { result } = setupTest(() => useZoneById(2), mockZones);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});

describe("useZoneCount", () => {
  it("should return correct count when query succeeds", async () => {
    const mockZones = [factory.zone(), factory.zone(), factory.zone()];
    const { result } = setupTest(useZoneCount, mockZones);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(3);
  });

  it("should return 0 when zones array is empty", async () => {
    const { result } = setupTest(useZoneCount, []);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(0);
  });
});
