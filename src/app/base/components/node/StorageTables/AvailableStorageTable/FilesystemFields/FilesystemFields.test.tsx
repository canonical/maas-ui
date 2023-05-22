import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FilesystemFields from "./FilesystemFields";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("FilesystemFields", () => {
  it("only shows filesystem types that require a storage device", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            supported_filesystems: [
              { key: "fat32", ui: "fat32" }, // reuuires storage
              { key: "ramfs", ui: "ramfs" }, // does not require storage
            ],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik
          initialValues={{ fstype: "", mountOptions: "", mountPoint: "" }}
          onSubmit={jest.fn()}
        >
          <FilesystemFields systemId="abc123" />
        </Formik>
      </Provider>
    );

    expect(
      screen
        .getByRole("option", { name: /fat32/i, value: "fat32" })
        .toBeInTheDocument()
    ).toBeTruthy();
    expect(
      screen.queryByRole("option", { name: /ramfs/i, value: "ramfs" })
    ).toBeNull();
  });

  it("disables mount point and options if no fstype selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            supported_filesystems: [{ key: "fat32", ui: "fat32" }],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik
          initialValues={{ fstype: "", mountOptions: "", mountPoint: "" }}
          onSubmit={jest.fn()}
        >
          <FilesystemFields systemId="abc123" />
        </Formik>
      </Provider>
    );

    expect(screen.getByLabelText(/Mount Options/i)).toHaveAttribute(
      "disabled",
      "true"
    );
    expect(screen.getByLabelText(/Mount Point/i)).toHaveAttribute(
      "disabled",
      "true"
    );
  });

  it("sets mount point to 'none' and disables field if swap fstype selected", async () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            supported_filesystems: [{ key: "swap", ui: "swap" }],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik
          initialValues={{ fstype: "", mountOptions: "", mountPoint: "" }}
          onSubmit={jest.fn()}
        >
          <FilesystemFields systemId="abc123" />
        </Formik>
      </Provider>
    );

    userEvent.selectOptions(
      screen.getByLabelText(/Filesystem Type/i),
      screen.getByRole("option", { name: /swap/i, value: "swap" })
    );
    await waitFor(() => {
      expect(screen.getByLabelText(/Mount Options/i)).not.toHaveAttribute(
        "disabled"
      );
      expect(screen.getByLabelText(/Mount Point/i)).toHaveAttribute(
        "disabled",
        "true"
      );
      expect(screen.getByLabelText(/Mount Point/i)).toHaveValue("none");
    });
  });
});
