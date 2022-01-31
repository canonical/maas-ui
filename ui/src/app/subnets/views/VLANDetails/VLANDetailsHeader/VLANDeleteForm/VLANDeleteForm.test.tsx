import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VLANDeleteForm from "./VLANDeleteForm";

import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import {
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("VLANDeleteForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      vlan: vlanStateFactory({
        items: [vlanFactory({ id: 1 })],
      }),
    });
  });

  it("calls closeForm on cancel click", () => {
    const closeForm = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VLANDeleteForm id={1} closeForm={closeForm} />
      </Provider>
    );
    wrapper.find("button[data-testid='cancel-action']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("can delete a VLAN", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VLANDeleteForm id={1} closeForm={jest.fn()} />
      </Provider>
    );
    submitFormikForm(wrapper);
    const deleteAction = vlanActions.delete(1);
    expect(
      store.getActions().find((action) => action.type === deleteAction.type)
    ).toStrictEqual(deleteAction);
  });
});
