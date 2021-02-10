import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useInitialPowerParameters } from "./hooks";

import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper = (store: MockStoreEnhanced<unknown>) => ({
  children,
}: {
  children: ReactNode;
}) => <Provider store={store}>{children}</Provider>;

describe("general hook utils", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              can_probe: true,
              fields: [
                powerFieldFactory({
                  default: "",
                  name: "power_address",
                }),
                powerFieldFactory({
                  default: "",
                  name: "power_pass",
                }),
              ],
            }),
            powerTypeFactory({
              can_probe: false,
              fields: [
                powerFieldFactory({
                  default: "1",
                  name: "node_id",
                }),
                powerFieldFactory({
                  default: "",
                  name: "node_outlet",
                }),
              ],
            }),
          ],
        }),
      }),
    });
  });

  describe("useInitialPowerParameters", () => {
    it("can return the default power parameters for all power types", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useInitialPowerParameters(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toStrictEqual({
        node_id: "1",
        node_outlet: "",
        power_address: "",
        power_pass: "",
      });
    });

    it("can override default power parameters", () => {
      const store = mockStore(state);
      const { result } = renderHook(
        () =>
          useInitialPowerParameters({
            node_id: "2",
            power_address: "192.168.1.1",
          }),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current).toStrictEqual({
        node_id: "2",
        node_outlet: "",
        power_address: "192.168.1.1",
        power_pass: "",
      });
    });

    it("can filter power parameters to those that are relevant for adding chassis", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useInitialPowerParameters({}, true), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toStrictEqual({
        power_address: "",
        power_pass: "",
      });
    });
  });
});
