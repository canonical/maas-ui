import * as baseHooks from "app/base/hooks/base";

beforeEach(() => {
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [false, () => null]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Simulate FormikForm saved state going from false to true by mocking useCycled
export const mockFormikFormSaved = (): jest.SpyInstance =>
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
