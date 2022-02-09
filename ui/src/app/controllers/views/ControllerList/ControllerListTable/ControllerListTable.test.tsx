import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerListTable from "./ControllerListTable";

import controllersURLs from "app/controllers/urls";
import type { Controller } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVersions as controllerVersionsFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ControllerListTable", () => {
  let controller: Controller;
  let state: RootState;
  beforeEach(() => {
    controller = controllerFactory();
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [controller],
      }),
    });
  });

  it("links to a controller's details page", () => {
    controller.system_id = "def456";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ControllerListTable
            controllers={[controller]}
            onSelectedChange={jest.fn()}
            selectedIDs={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("LegacyLink").at(0).prop("route")).toBe(
      controllersURLs.controller.index({ id: controller.system_id })
    );
  });

  describe("controller list sorting", () => {
    const getRowTestId = (wrapper: ReactWrapper, index: number) =>
      wrapper.find("tbody tr").at(index).prop("data-testid");

    it("can sort by FQDN", () => {
      const controllers = [
        controllerFactory({ fqdn: "b", system_id: "b" }),
        controllerFactory({ fqdn: "c", system_id: "c" }),
        controllerFactory({ fqdn: "a", system_id: "a" }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ControllerListTable
              controllers={controllers}
              onSelectedChange={jest.fn()}
              selectedIDs={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      // Table is sorted be descending FQDN by default
      expect(getRowTestId(wrapper, 0)).toBe("controller-a");
      expect(getRowTestId(wrapper, 1)).toBe("controller-b");
      expect(getRowTestId(wrapper, 2)).toBe("controller-c");

      // Change sort to ascending FQDN
      wrapper.find("[data-testid='fqdn-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("controller-c");
      expect(getRowTestId(wrapper, 1)).toBe("controller-b");
      expect(getRowTestId(wrapper, 2)).toBe("controller-a");
    });

    it("can sort by version", () => {
      const controllers = [
        controllerFactory({
          versions: controllerVersionsFactory({ origin: "3" }),
          system_id: "c",
        }),
        controllerFactory({
          versions: controllerVersionsFactory({ origin: "1" }),
          system_id: "a",
        }),
        controllerFactory({
          versions: controllerVersionsFactory({ origin: "2" }),
          system_id: "b",
        }),
      ];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ControllerListTable
              controllers={controllers}
              onSelectedChange={jest.fn()}
              selectedIDs={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      // Change sort to descending version
      wrapper.find("[data-testid='version-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("controller-a");
      expect(getRowTestId(wrapper, 1)).toBe("controller-b");
      expect(getRowTestId(wrapper, 2)).toBe("controller-c");

      // Change sort to ascending version
      wrapper.find("[data-testid='version-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("controller-c");
      expect(getRowTestId(wrapper, 1)).toBe("controller-b");
      expect(getRowTestId(wrapper, 2)).toBe("controller-a");
    });
  });

  describe("controller selection", () => {
    it("handles selecting a single controller", () => {
      const controllers = [controllerFactory({ system_id: "abc123" })];
      const onSelectedChange = jest.fn();
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ControllerListTable
              controllers={controllers}
              onSelectedChange={onSelectedChange}
              selectedIDs={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      wrapper
        .find("[data-testid='controller-checkbox'] input")
        .at(0)
        .simulate("change");

      expect(onSelectedChange).toHaveBeenCalledWith(["abc123"]);
    });

    it("handles unselecting a single controller", () => {
      const controllers = [controllerFactory({ system_id: "abc123" })];
      const onSelectedChange = jest.fn();
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ControllerListTable
              controllers={controllers}
              onSelectedChange={onSelectedChange}
              selectedIDs={["abc123"]}
            />
          </MemoryRouter>
        </Provider>
      );

      wrapper
        .find("[data-testid='controller-checkbox'] input")
        .at(0)
        .simulate("change");

      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });

    it("handles selecting all controllers", () => {
      const controllers = [
        controllerFactory({ system_id: "abc123" }),
        controllerFactory({ system_id: "def456" }),
      ];
      const onSelectedChange = jest.fn();
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ControllerListTable
              controllers={controllers}
              onSelectedChange={onSelectedChange}
              selectedIDs={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      wrapper
        .find("[data-testid='all-controllers-checkbox'] input")
        .simulate("change");

      expect(onSelectedChange).toHaveBeenCalledWith(["abc123", "def456"]);
    });

    it("handles unselecting all controllers", () => {
      const controllers = [
        controllerFactory({ system_id: "abc123" }),
        controllerFactory({ system_id: "def456" }),
      ];
      const onSelectedChange = jest.fn();
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ControllerListTable
              controllers={controllers}
              onSelectedChange={onSelectedChange}
              selectedIDs={["abc123", "def456"]}
            />
          </MemoryRouter>
        </Provider>
      );

      wrapper
        .find("[data-testid='all-controllers-checkbox'] input")
        .simulate("change");

      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });
  });
});
