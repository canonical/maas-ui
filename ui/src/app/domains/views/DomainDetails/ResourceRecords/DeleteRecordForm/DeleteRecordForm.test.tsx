import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeleteRecordForm from "./DeleteRecordForm";

import { actions as domainActions } from "app/store/domain";
import {
  domainDetails as domainFactory,
  domainState as domainStateFactory,
  domainResource as resourceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("DeleteRecordForm", () => {
  it("closes the form when Cancel button is clicked", () => {
    const resource = resourceFactory();
    const domain = domainFactory({ id: 1, rrsets: [resource] });
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
    });
    const store = mockStore(state);
    const closeForm = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <DeleteRecordForm
          closeForm={closeForm}
          id={domain.id}
          resource={resource}
        />
      </Provider>
    );

    wrapper.find('button[data-testid="cancel-action"]').simulate("click");

    expect(closeForm).toHaveBeenCalled();
  });

  it("dispatches an action to delete one of many records that belong to a DNS resource", async () => {
    const [resource, otherResource] = [
      resourceFactory({ dnsresource_id: 123, name: "resource" }),
      resourceFactory({ dnsresource_id: 123, name: "other-resource" }),
    ];
    const domain = domainFactory({ id: 1, rrsets: [resource, otherResource] });
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteRecordForm closeForm={jest.fn()} id={1} resource={resource} />
      </Provider>
    );
    wrapper.find("form").simulate("submit");
    await waitForComponentToPaint(wrapper);

    const expectedAction = domainActions.deleteRecord({
      deleteResource: false,
      domain: domain.id,
      rrset: resource,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "domain/deleteRecord");
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("dispatches an action to delete the last record of a DNS resource", async () => {
    const resource = resourceFactory();
    const domain = domainFactory({ id: 1, rrsets: [resource] });
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeleteRecordForm closeForm={jest.fn()} id={1} resource={resource} />
      </Provider>
    );
    wrapper.find("form").simulate("submit");
    await waitForComponentToPaint(wrapper);

    const expectedAction = domainActions.deleteRecord({
      deleteResource: true,
      domain: domain.id,
      rrset: resource,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "domain/deleteRecord");
    expect(actualAction).toStrictEqual(expectedAction);
  });
});
