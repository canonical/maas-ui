import { http, HttpResponse } from "msw";
import { describe } from "vitest";

import {
  useZones,
  useZoneCount,
  useGetZone,
  useCreateZone,
  useUpdateZone,
  useDeleteZone,
} from "@/app/api/query/zones";
import type {
  ZoneRequest,
  ZonesWithSummaryListResponse,
} from "@/app/apiclient";
import {
  BASE_URL,
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const initialMockZones: ZonesWithSummaryListResponse = {
  items: [
    {
      id: 1,
      name: "zone-1",
      description: "",
      controllers_count: 0,
      devices_count: 0,
      machines_count: 0,
    },
    {
      id: 2,
      name: "zone-2",
      description: "",
      controllers_count: 0,
      devices_count: 0,
      machines_count: 0,
    },
    {
      id: 3,
      name: "zone-3",
      description: "",
      controllers_count: 0,
      devices_count: 0,
      machines_count: 0,
    },
  ],
  total: 3,
};

let mockZones = structuredClone(initialMockZones);

const isValidZoneRequest = (data: any): data is ZoneRequest =>
  typeof data === "object" &&
  data !== null &&
  typeof data.name === "string" &&
  (!data.description || typeof data.description === "string");

export const zoneResolvers = {
  listZones: {
    resolved: false,
    handler: () =>
      http.get(`${BASE_URL}MAAS/a/v3/zones_with_summary`, () => {
        zoneResolvers.listZones.resolved = true;
        return HttpResponse.json(mockZones);
      }),
  },

  getZone: {
    resolved: false,
    handler: () =>
      http.get(`${BASE_URL}MAAS/a/v3/zones/:id`, ({ params }) => {
        const id = Number(params.id);
        if (!id) return HttpResponse.error();

        const zone = mockZones.items.find((zone) => zone.id === id);
        zoneResolvers.getZone.resolved = true;
        return zone ? HttpResponse.json(zone) : HttpResponse.error();
      }),
  },

  createZone: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/zones`, async ({ request }) => {
        zoneResolvers.createZone.resolved = false;
        try {
          const data = await request.json();
          if (!isValidZoneRequest(data)) return HttpResponse.error();
          const newZone = {
            id: mockZones.items.length + 1,
            name: data.name,
            description: data.description ?? "",
            controllers_count: 0,
            devices_count: 0,
            machines_count: 0,
          };
          mockZones.items.push(newZone);
          zoneResolvers.createZone.resolved = true;
          return HttpResponse.json(newZone);
        } catch {
          return HttpResponse.error();
        }
      }),
  },

  updateZone: {
    resolved: false,
    handler: () =>
      http.put(
        `${BASE_URL}MAAS/a/v3/zones/:id`,
        async ({ request, params }) => {
          const id = Number(params.id);
          if (!id) return HttpResponse.error();

          zoneResolvers.updateZone.resolved = false;
          try {
            const updates = await request.json();
            if (!isValidZoneRequest(updates)) return HttpResponse.error();

            const zone = mockZones.items.find((zone) => zone.id === id);
            if (!zone) return HttpResponse.error();

            Object.assign(zone, updates);
            zoneResolvers.updateZone.resolved = true;
            return HttpResponse.json(zone);
          } catch {
            return HttpResponse.error();
          }
        }
      ),
  },

  deleteZone: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/zones/:id`, ({ params }) => {
        const id = Number(params.id);
        if (!id) return HttpResponse.error();

        zoneResolvers.deleteZone.resolved = false;
        const index = mockZones.items.findIndex((zone) => zone.id === id);
        if (index === -1) return HttpResponse.error();

        mockZones.items.splice(index, 1);
        zoneResolvers.deleteZone.resolved = true;
        return HttpResponse.json({ success: true });
      }),
  },
};

const mockServer = setupMockServer(
  zoneResolvers.listZones.handler(),
  zoneResolvers.getZone.handler(),
  zoneResolvers.createZone.handler(),
  zoneResolvers.updateZone.handler(),
  zoneResolvers.deleteZone.handler()
);

beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  mockServer.resetHandlers();
  mockZones = structuredClone(initialMockZones);
  (Object.keys(zoneResolvers) as (keyof typeof zoneResolvers)[]).forEach(
    (key) => {
      zoneResolvers[key].resolved = false;
    }
  );
});
afterAll(() => mockServer.close());

describe("useZones", () => {
  it("should return zones data", async () => {
    const { result } = renderHookWithProviders(() => useZones());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockZones);
  });
});

describe("useZoneCount", () => {
  it("should return correct count", async () => {
    const { result } = renderHookWithProviders(() => useZoneCount());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(3);
  });

  it("should return 0 when no zones exist", async () => {
    mockZones.items = [];
    const { result } = renderHookWithProviders(() => useZoneCount());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(0);
  });
});

describe("useGetZone", () => {
  it("should return the correct zone", async () => {
    const expectedZone = mockZones.items[0];
    const { result } = renderHookWithProviders(() =>
      useGetZone({ path: { zone_id: expectedZone.id } })
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(expectedZone);
  });

  it("should return error if zone does not exist", async () => {
    const { result } = renderHookWithProviders(() =>
      useGetZone({ path: { zone_id: 99 } })
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateZone", () => {
  it("should create a new zone", async () => {
    const newZone: ZoneRequest = {
      name: "new-zone",
      description: "This is a new zone.",
    };
    const { result } = renderHookWithProviders(() => useCreateZone());
    result.current.mutate({ body: newZone });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { result: listResult } = renderHookWithProviders(() => useZones());
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true));
    expect(
      listResult.current.data?.items.some((zone) => zone.name === newZone.name)
    ).toBe(true);
  });

  it("should return error if data is missing", async () => {
    const { result } = renderHookWithProviders(() => useCreateZone());
    // @ts-ignore
    result.current.mutate({ body: { description: "Missing name" } });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("should return error if request body is invalid", async () => {
    const { result } = renderHookWithProviders(() => useCreateZone());
    result.current.mutate({ body: "invalid_string" as any });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useUpdateZone", () => {
  it("should update an existing zone", async () => {
    const updatedZone = { ...mockZones.items[0], description: "Edited" };
    const { result } = renderHookWithProviders(() => useUpdateZone());
    result.current.mutate({
      body: updatedZone,
      path: { zone_id: updatedZone.id },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { result: listResult } = renderHookWithProviders(() => useZones());
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true));
    expect(
      listResult.current.data?.items.find((zone) => zone.id === updatedZone.id)
    ).toEqual(updatedZone);
  });

  it("should return error if data is missing", async () => {
    const { result } = renderHookWithProviders(() => useUpdateZone());
    // @ts-ignore
    result.current.mutate({ body: {}, path: { zone_id: 1 } });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("should return error if request body is invalid", async () => {
    const { result } = renderHookWithProviders(() => useUpdateZone());
    result.current.mutate({
      body: "invalid_string" as any,
      path: { zone_id: 1 },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useDeleteZone", () => {
  it("should delete a zone", async () => {
    const zoneToDelete = mockZones.items[0];
    const { result } = renderHookWithProviders(() => useDeleteZone());
    result.current.mutate({ path: { zone_id: zoneToDelete.id } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { result: listResult } = renderHookWithProviders(() => useZones());
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true));
    expect(
      listResult.current.data?.items.some((zone) => zone.id === zoneToDelete.id)
    ).toBe(false);
  });

  it("should return error if zone does not exist", async () => {
    const { result } = renderHookWithProviders(() => useDeleteZone());
    result.current.mutate({ path: { zone_id: 99 } });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
