import { http, HttpResponse } from "msw";

import type {
  CreateZoneError,
  DeleteZoneError,
  GetZoneError,
  ListZonesWithSummaryError,
  UpdateZoneError,
  ZonesWithSummaryListResponse,
} from "@/app/apiclient";
import { zone as zoneFactory } from "@/testing/factories";
import { BASE_URL } from "@/testing/utils";

const mockZones: ZonesWithSummaryListResponse = {
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

const mockListZonesError: ListZonesWithSummaryError = {
  message: "Unauthorized",
  code: 401,
  kind: "Error", // This will always be 'Error' for every error response
};

const mockGetZoneError: GetZoneError = {
  message: "Not found",
  code: 404,
  kind: "Error",
};

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

const zoneResolvers = {
  listZones: {
    resolved: false,
    handler: (data: ZonesWithSummaryListResponse = mockZones) =>
      http.get(`${BASE_URL}MAAS/a/v3/zones_with_summary`, () => {
        zoneResolvers.listZones.resolved = true;
        return HttpResponse.json(data);
      }),
    error: (error: ListZonesWithSummaryError = mockListZonesError) =>
      http.get(`${BASE_URL}MAAS/a/v3/zones_with_summary`, () => {
        zoneResolvers.listZones.resolved = true;
        return HttpResponse.json(error, { status: error.code });
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
    error: (error: GetZoneError = mockGetZoneError) =>
      http.get(`${BASE_URL}MAAS/a/v3/zones/:id`, () => {
        zoneResolvers.getZone.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  createZone: {
    resolved: false,
    handler: () =>
      http.post(`${BASE_URL}MAAS/a/v3/zones`, () => {
        zoneResolvers.createZone.resolved = true;
        return HttpResponse.json({ id: 1 });
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
      http.put(`${BASE_URL}MAAS/a/v3/zones/:id`, () => {
        zoneResolvers.updateZone.resolved = true;
        return HttpResponse.json({});
      }),
    error: (error: UpdateZoneError = mockUpdateZoneError) =>
      http.put(`${BASE_URL}MAAS/a/v3/zones/:id`, () => {
        zoneResolvers.updateZone.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
  deleteZone: {
    resolved: false,
    handler: () =>
      http.delete(`${BASE_URL}MAAS/a/v3/zones/:id`, () => {
        zoneResolvers.deleteZone.resolved = true;
        return HttpResponse.json({}, { status: 204 });
      }),
    error: (error: DeleteZoneError = mockGetZoneError) =>
      http.delete(`${BASE_URL}MAAS/a/v3/zones/:id`, () => {
        zoneResolvers.deleteZone.resolved = true;
        return HttpResponse.json(error, { status: error.code });
      }),
  },
};

export { zoneResolvers, mockZones };
