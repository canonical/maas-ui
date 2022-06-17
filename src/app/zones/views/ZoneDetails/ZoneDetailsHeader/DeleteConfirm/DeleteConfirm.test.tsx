import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeleteConfirm from "./DeleteConfirm";

import type { RootState } from "app/store/root/types";
import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeleteConfirm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      zone: zoneStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          zoneFactory({
            id: 1,
            name: "zone-name",
          }),
        ],
      }),
    });
  });

  it("runs onConfirm function when Delete AZ is clicked", () => {
    const closeExpanded = jest.fn();
    const onConfirm = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Delete AZ"
          onConfirm={onConfirm}
        />
      </Provider>
    );

    wrapper.find("button[data-testid='delete-az']").simulate("click");
    expect(onConfirm).toHaveBeenCalled();
  });

  it("runs closeExpanded function when cancel is clicked", () => {
    const closeExpanded = jest.fn();
    const onConfirm = jest.fn();
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Delete AZ"
          onConfirm={onConfirm}
        />
      </Provider>
    );

    wrapper
      .find("button[data-testid='close-confirm-delete']")
      .simulate("click");
    expect(closeExpanded).toHaveBeenCalled();
  });
});
