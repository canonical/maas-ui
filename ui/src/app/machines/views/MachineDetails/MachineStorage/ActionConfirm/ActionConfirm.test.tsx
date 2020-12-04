import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ActionConfirm from "./ActionConfirm";

import * as maasUiHooks from "app/base/hooks";
import {
  machineDetails as machineDetailsFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.mock("@canonical/react-components/dist/hooks", () => ({
  usePrevious: jest.fn(),
}));

describe("ActionConfirm", () => {
  it("can show saving state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory({ deletingFilesystem: true }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ActionConfirm
          closeExpanded={jest.fn()}
          confirmLabel="Confirm"
          eventName="deleteFilesystem"
          message="Are you sure you want to do that?"
          onConfirm={jest.fn()}
          onSaveAnalytics={{
            action: "Action",
            category: "Category",
            label: "Label",
          }}
          statusKey="deletingFilesystem"
          systemId="abc123"
        />
      </Provider>
    );

    expect(wrapper.find("ActionButton").prop("loading")).toBe(true);
  });

  it("can show errors", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        eventErrors: [
          machineEventErrorFactory({
            id: "abc123",
            event: "deleteFilesystem",
            error: "uh oh",
          }),
        ],
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory({ deletingFilesystem: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const closeExpanded = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ActionConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Confirm"
          message="Are you sure you want to do that?"
          onConfirm={jest.fn()}
          onSaveAnalytics={{
            action: "Action",
            category: "Category",
            label: "Label",
          }}
          statusKey="deletingFilesystem"
          systemId="abc123"
        />
      </Provider>
    );

    expect(wrapper.find("[data-test='error-message']").text()).toBe("uh oh");
  });

  it("sends an analytics event when saved", () => {
    const analyticsEvent = {
      action: "Action",
      category: "Category",
      label: "Label",
    };
    const useSendMock = jest.spyOn(maasUiHooks, "useSendAnalyticsWhen");
    // Mock saved state by simulating "deletingFilesystem" changing from true to false
    jest
      .spyOn(reactComponentHooks, "usePrevious")
      .mockImplementation(() => true);
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory({ deletingFilesystem: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const closeExpanded = jest.fn();
    mount(
      <Provider store={store}>
        <ActionConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Confirm"
          eventName="deleteFilesystem"
          message="Are you sure you want to do that?"
          onConfirm={jest.fn()}
          onSaveAnalytics={analyticsEvent}
          statusKey="deletingFilesystem"
          systemId="abc123"
        />
      </Provider>
    );

    expect(useSendMock).toHaveBeenCalled();
    expect(useSendMock.mock.calls[0]).toEqual([
      true,
      analyticsEvent.category,
      analyticsEvent.action,
      analyticsEvent.label,
    ]);
    useSendMock.mockRestore();
  });

  it("closes the form when saved", () => {
    // Mock saved state by simulating "deletingFilesystem" changing from true to false
    jest
      .spyOn(reactComponentHooks, "usePrevious")
      .mockImplementation(() => true);
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory({ deletingFilesystem: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const closeExpanded = jest.fn();
    mount(
      <Provider store={store}>
        <ActionConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Confirm"
          eventName="deleteFilesystem"
          message="Are you sure you want to do that?"
          onConfirm={jest.fn()}
          onSaveAnalytics={{
            action: "Action",
            category: "Category",
            label: "Label",
          }}
          statusKey="deletingFilesystem"
          systemId="abc123"
        />
      </Provider>
    );

    expect(closeExpanded).toHaveBeenCalled();
  });
});
