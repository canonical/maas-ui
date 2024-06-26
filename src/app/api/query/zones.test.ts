import type { JsonBodyType } from "msw";

import { useZonesCount } from "./zones";

import { getFullApiUrl } from "@/app/api/base";
import * as factory from "@/testing/factories";
import {
  renderHookWithQueryClient,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const { server, http, HttpResponse } = setupMockServer();

const setupZonesTest = (mockData: JsonBodyType) => {
  server.use(
    http.get(getFullApiUrl("zones"), () => HttpResponse.json(mockData))
  );
  return renderHookWithQueryClient(() => useZonesCount());
};

it("should return 0 when zones data is undefined", async () => {
  const { result } = setupZonesTest(null);
  await waitFor(() => expect(result.current).toBe(0));
});

it("should return the correct count when zones data is available", async () => {
  const mockZonesData = [factory.zone(), factory.zone(), factory.zone()];
  const { result } = setupZonesTest(mockZonesData);
  await waitFor(() => expect(result.current).toBe(3));
});

it("should return 0 when zones data is an empty array", async () => {
  const { result } = setupZonesTest([]);
  await waitFor(() => expect(result.current).toBe(0));
});
