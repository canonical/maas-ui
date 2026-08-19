import { createElement } from "react";

import * as reactQuery from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { waitFor } from "@testing-library/react";

import { useWebsocketAwareQuery } from "./base";

import { rootState, statusState } from "@/testing/factories";
import { renderHookWithProviders, renderWithProviders } from "@/testing/utils";

vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQuery: vi.fn(),
  useQueryClient: vi.fn(),
}));

const mockOptions = {} as UseQueryOptions;

beforeEach(() => {
  vi.resetAllMocks();
  const mockQueryClient: Partial<reactQuery.QueryClient> = {};
  vi.mocked(reactQuery.useQueryClient).mockReturnValue(
    mockQueryClient as reactQuery.QueryClient
  );
  vi.mocked(reactQuery.useQuery).mockReturnValue({
    data: "testData",
    isLoading: false,
  } as reactQuery.UseQueryResult);
});

it("calls useQuery with correct parameters", () => {
  renderHookWithProviders(() => useWebsocketAwareQuery(mockOptions));
  expect(reactQuery.useQuery).toHaveBeenCalledWith(mockOptions);
});

it("skips query invalidation when connectedCount is unchanged", () => {
  const initialState = rootState({
    status: statusState({ connectedCount: 0 }),
  });
  const TestComponent = () => {
    useWebsocketAwareQuery(mockOptions);
    return null;
  };
  const { rerender } = renderWithProviders(createElement(TestComponent), {
    state: initialState,
  });

  const mockInvalidateQueries = vi.fn();
  const mockQueryClient: Partial<reactQuery.QueryClient> = {
    invalidateQueries: mockInvalidateQueries,
  };
  vi.mocked(reactQuery.useQueryClient).mockReturnValue(
    mockQueryClient as reactQuery.QueryClient
  );

  rerender(createElement(TestComponent), {
    state: rootState({
      status: statusState({ connectedCount: 0 }),
    }),
  });
  expect(mockInvalidateQueries).not.toHaveBeenCalled();
});

it("invalidates queries when connectedCount changes", async () => {
  const initialState = rootState({
    status: statusState({ connectedCount: 0 }),
  });
  const TestComponent = () => {
    useWebsocketAwareQuery(mockOptions);
    return null;
  };
  const { rerender } = renderWithProviders(createElement(TestComponent), {
    state: initialState,
  });

  const mockInvalidateQueries = vi.fn();
  const mockQueryClient: Partial<reactQuery.QueryClient> = {
    invalidateQueries: mockInvalidateQueries,
  };
  vi.mocked(reactQuery.useQueryClient).mockReturnValue(
    mockQueryClient as reactQuery.QueryClient
  );

  rerender(createElement(TestComponent), {
    state: rootState({
      status: statusState({ connectedCount: 1 }),
    }),
  });
  await waitFor(() => {
    expect(mockInvalidateQueries).toHaveBeenCalled();
  });
});

it("returns the result of useQuery", () => {
  const { result } = renderHookWithProviders(() =>
    useWebsocketAwareQuery(mockOptions)
  );
  expect(result.current).not.toBeNull();
  expect(result.current).toEqual({ data: "testData", isLoading: false });
});
