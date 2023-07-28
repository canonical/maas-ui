import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import configureStore from "redux-mock-store";

import ActionConfirm from "./ActionConfirm";

import * as maasUiHooks from "app/base/hooks/analytics";
import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineEventError as machineEventErrorFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore, screen } from "testing/utils";

const mockStore = configureStore<RootState>();

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
    renderWithMockStore(
      <ActionConfirm
        closeExpanded={jest.fn()}
        confirmLabel="Confirm"
        eventName="deleteFilesystem"
        message={<span>Are you sure you want to do that?</span>}
        onConfirm={jest.fn()}
        onSaveAnalytics={{
          action: "Action",
          category: "Category",
          label: "Label",
        }}
        statusKey="deletingFilesystem"
        systemId="abc123"
      />,
      { store }
    );

    const actionButton = screen.getByRole("button", {
      name: "Waiting for action to complete",
    });
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveClass("is-processing");
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
    renderWithMockStore(
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
      />,
      { store }
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent("uh oh");
  });

  it("can change the submit appearance", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory({ creatingCacheSet: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const closeExpanded = jest.fn();
    renderWithMockStore(
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
        statusKey="creatingCacheSet"
        submitAppearance="positive"
        systemId="abc123"
      />,
      { store }
    );

    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass(
      "p-button--positive"
    );
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
    renderWithMockStore(
      <ActionConfirm
        closeExpanded={closeExpanded}
        confirmLabel="Confirm"
        eventName="deleteFilesystem"
        message="Are you sure you want to do that?"
        onConfirm={jest.fn()}
        onSaveAnalytics={analyticsEvent}
        statusKey="deletingFilesystem"
        systemId="abc123"
      />,
      { store }
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
    renderWithMockStore(
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
      />,
      { store }
    );

    expect(closeExpanded).toHaveBeenCalled();
  });
});
