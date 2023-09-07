import { useFetchActions } from "./dataFetching";

import { renderHookWithMockStore } from "testing/utils";

const mockDispatch = jest.fn();
const mockAction = jest.fn(() => ({
  type: "MOCK_ACTION",
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: () => 0,
}));

afterEach(() => {
  jest.clearAllMocks();
});

it("runs the actions once on mount and doesn't run again on rerender", async () => {
  const { rerender } = await renderHookWithMockStore(() =>
    useFetchActions([mockAction])
  );

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  expect(mockAction).toHaveBeenCalledTimes(1);

  mockAction.mockClear();
  mockDispatch.mockClear();

  rerender();

  expect(mockDispatch).not.toHaveBeenCalled();
  expect(mockAction).not.toHaveBeenCalled();
});
