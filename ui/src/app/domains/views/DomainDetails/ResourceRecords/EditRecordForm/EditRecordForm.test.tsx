import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import EditRecordForm from "./EditRecordForm";

import { actions as domainActions } from "app/store/domain";
import { RecordType } from "app/store/domain/types";
import type { RootState } from "app/store/root/types";
import {
  domainDetails as domainFactory,
  domainState as domainStateFactory,
  domainResource as resourceFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainSummary", () => {
  let state: RootState;
  const resourceA = resourceFactory({
    dnsdata_id: null,
    dnsresource_id: 11,
    name: "test-resource-A",
    rrdata: "0.0.0.0",
    rrtype: RecordType.A,
  });
  const resourceTXT = resourceFactory({
    dnsdata_id: 22,
    dnsresource_id: 33,
    name: "test-resource-TXT",
    rrdata: "testing",
    rrtype: RecordType.TXT,
  });

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "test",
            rrsets: [resourceA, resourceTXT],
          }),
        ],
      }),
    });
  });

  it("closes the form when Cancel button is clicked", () => {
    const store = mockStore(state);
    const closeForm = jest.fn();

    const wrapper = mount(
      <Provider store={store}>
        <EditRecordForm id={1} resource={resourceA} closeForm={closeForm} />
      </Provider>
    );

    wrapper.find('button[data-test="cancel-action"]').simulate("click");

    expect(closeForm).toHaveBeenCalled();
  });

  it("dispatches an action to update the record", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <EditRecordForm closeForm={jest.fn()} id={1} resource={resourceA} />
      </Provider>
    );
    wrapper.find("Formik").invoke("onSubmit")({
      name: resourceA.name,
      rrdata: "testing",
      rrtype: resourceA.rrtype,
      ttl: 42,
    });

    const expectedAction = domainActions.updateRecord({
      domain: 1,
      name: resourceA.name,
      resource: resourceA,
      rrdata: "testing",
      ttl: 42,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "domain/updateRecord");
    expect(actualAction).toStrictEqual(expectedAction);
  });
});
