import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useGetInstallationOutput } from "./hooks";

import type { RootState } from "app/store/root/types";
import {
  ScriptResultType,
  ScriptResultStatus,
} from "app/store/scriptresult/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultData as scriptResultDataFactory,
  scriptResultState as scriptResultStateFactory,
  nodeScriptResultState as nodeScriptResultStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper = (store: MockStoreEnhanced<unknown>) => ({
  children,
}: {
  children: ReactNode;
}) => <Provider store={store}>{children}</Provider>;

describe("machine utils", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
      nodescriptresult: nodeScriptResultStateFactory({
        items: { abc123: [1] },
      }),
      scriptresult: scriptResultStateFactory({
        items: [
          scriptResultFactory({
            id: 1,
            result_type: ScriptResultType.INSTALLATION,
            status: ScriptResultStatus.PASSED,
          }),
        ],
        logs: {
          1: scriptResultDataFactory({
            combined: "Installation output",
          }),
        },
      }),
    });
  });

  describe("useGetInstallationOutput", () => {
    it("fetches the logs if they're not already loaded", () => {
      state.scriptresult.logs = {};
      const store = mockStore(state);
      renderHook(() => useGetInstallationOutput("abc123"), {
        wrapper: generateWrapper(store),
      });
      expect(
        store.getActions().some(({ type }) => type === "scriptresult/getLogs")
      ).toEqual(true);
    });

    it("retrieves the installation log", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useGetInstallationOutput("abc123"), {
        wrapper: generateWrapper(store),
      });
      expect(result.current.log).toBe("Installation output");
      expect(result.current.result).toStrictEqual(state.scriptresult.items[0]);
    });
  });
});
