import type { UseQueryResult } from "@tanstack/react-query";

import { useItemsCount } from "./utils";

import { renderHook } from "@/testing/utils";

it("should return 0 when data is undefined", () => {
  const mockUseItems = vi.fn(
    () => ({ data: undefined }) as UseQueryResult<any[], unknown>
  );
  const { result } = renderHook(() => useItemsCount(mockUseItems));
  expect(result.current).toBe(0);
});

it("should return the correct count when data is available", () => {
  const mockData = [1, 2, 3, 4, 5];
  const mockUseItems = vi.fn(
    () => ({ data: mockData }) as UseQueryResult<number[], unknown>
  );
  const { result } = renderHook(() => useItemsCount(mockUseItems));
  expect(result.current).toBe(5);
});

it("should return 0 when data is an empty array", () => {
  const mockUseItems = vi.fn();
  mockUseItems.mockReturnValueOnce({ data: [] } as UseQueryResult<[], unknown>);
  const { result } = renderHook(() => useItemsCount(mockUseItems));
  expect(result.current).toBe(0);
});

it("should update count when data changes", () => {
  const mockUseItems = vi.fn();
  mockUseItems.mockReturnValueOnce({ data: [1, 2, 3] } as UseQueryResult<
    number[],
    unknown
  >);
  const { result, rerender } = renderHook(() => useItemsCount(mockUseItems));
  expect(result.current).toBe(3);

  mockUseItems.mockReturnValueOnce({ data: [1, 2, 3, 4] } as UseQueryResult<
    number[],
    unknown
  >);
  rerender();
  expect(result.current).toBe(4);
});
