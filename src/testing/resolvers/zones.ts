import { http, HttpResponse } from "msw";
import { afterEach } from "vitest";

import type {
  CreateZoneError,
  DeleteZoneError,
  UpdateZoneError,
  ZoneRequest,
  ZonesWithSummaryListResponse,
} from "@/app/apiclient";
import { zone as zoneFactory } from "@/testing/factories";
import { BASE_URL } from "@/testing/utils";

const initialMockZones: ZonesWithSummaryListResponse = {
  items: [
    zoneFactory({
      id: 1,
      name: "zone-1",
      description: "",
      controllers_count: 0,
      devices_count: 0,
      machines_count: 0,
    }),
    zoneFactory({
      id: 2,
      name: "zone-2",
      description: "",
      controllers_count: 0,
      devices_count: 0,
      machines_count: 0,
    }),
    zoneFactory({
      id: 3,
      name: "zone-3",
      description: "",
      controllers_count: 0,
      devices_count: 0,
      machines_count: 0,
    }),
  ],
  total: 3,
};

let mockZones = structuredClone(initialMockZones);

const mockCreateZoneError: CreateZoneError = {
  message: "Zone already exists",
  code: 409,
  kind: "Error",
};

const mockUpdateZoneError: UpdateZoneError = {
  message: "Bad request",
  code: 400,
  kind: "Error",
};

const mockDeleteZoneError: DeleteZoneError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

// data object could be any shape, this method verifies the shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidZoneRequest = (data: any): data is ZoneRequest =>
  typeof data === "object" &&
  data !== null &&
  typeof data.name === "string" &&
  (!data.description || typeof data.description === "string");

const zoneResolvers = {
  listZones: {
    resolved: false,
    handler: (data: ZonesWithSummaryListResponse = mockZones) =>
      http.get(`${BASE_URL}MAAS/a/v3/zones_with_summary`, () => {
        zoneResolvers.listZones.resolved = true;
        return HttpResponse.json(data);
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
    error: (error: CreateZoneError = mockCreateZoneError) =>
      http.post(`${BASE_URL}MAAS/a/v3/zones`, () => {
        zoneResolvers.createZone.resolved = true;
        return HttpResponse.json(error, { status: error.code });
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
    error: (error: UpdateZoneError = mockUpdateZoneError) =>
      http.put(`${BASE_URL}MAAS/a/v3/zones/:id`, () => {
        zoneResolvers.updateZone.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
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
    error: (error: DeleteZoneError = mockDeleteZoneError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/zones/:id`, () => {
        zoneResolvers.deleteZone.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

afterEach(() => {
  mockZones = structuredClone(initialMockZones);
  (Object.keys(zoneResolvers) as (keyof typeof zoneResolvers)[]).forEach(
    (key) => {
      zoneResolvers[key].resolved = false;
    }
  );
});

export { zoneResolvers, mockZones };
