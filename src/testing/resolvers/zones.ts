import { http, HttpResponse } from "msw";
import { afterEach } from "vitest";

import type {
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

const isValidZoneRequest = (data: any): data is ZoneRequest =>
  typeof data === "object" &&
  data !== null &&
  typeof data.name === "string" &&
  (!data.description || typeof data.description === "string");

const zoneResolvers = {
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

afterEach(() => {
  mockZones = structuredClone(initialMockZones);
  (Object.keys(zoneResolvers) as (keyof typeof zoneResolvers)[]).forEach(
    (key) => {
      zoneResolvers[key].resolved = false;
    }
  );
});

export { zoneResolvers, mockZones };
