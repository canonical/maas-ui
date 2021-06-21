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

  describe("when record is an address record of A or AAAA type", () => {
    it("calls only update_address_record if resource name didn't change on save click", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <EditRecordForm closeForm={jest.fn()} id={1} resource={resourceA} />
        </Provider>
      );
      wrapper.find("Formik").invoke("onSubmit")({
        name: resourceA.name,
        ttl: 42,
        rrdata: "testing",
        rrtype: resourceA.rrtype,
      });

      const expectedAction = domainActions.updateAddressRecord({
        address_ttl: 42,
        domain: 1,
        ip_addresses: ["testing"],
        name: resourceA.name,
        previous_name: resourceA.name,
        previous_rrdata: resourceA.rrdata,
      });
      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDNSResource")
      ).toBeUndefined();
      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateAddressRecord")
      ).toStrictEqual(expectedAction);
    });

    it("parses IP addresses out of rrdata on save click", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <EditRecordForm closeForm={jest.fn()} id={1} resource={resourceA} />
        </Provider>
      );
      wrapper.find("Formik").invoke("onSubmit")({
        name: resourceA.name,
        rrdata: "0.0.0.0, 1.2.3.4",
        rrtype: resourceA.rrtype,
        ttl: "",
      });

      const expectedAction = domainActions.updateAddressRecord({
        address_ttl: null,
        domain: 1,
        ip_addresses: ["0.0.0.0", "1.2.3.4"],
        name: resourceA.name,
        previous_name: resourceA.name,
        previous_rrdata: resourceA.rrdata,
      });
      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateAddressRecord")
      ).toStrictEqual(expectedAction);
    });
  });

  describe("when record is not an address record of A or AAAA type", () => {
    it("calls only update_address_record if record name didn't change on save click", () => {
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <EditRecordForm closeForm={jest.fn()} id={1} resource={resourceTXT} />
        </Provider>
      );
      wrapper.find("Formik").invoke("onSubmit")({
        name: resourceTXT.name,
        rrdata: "testing",
        rrtype: resourceTXT.rrtype,
        ttl: resourceTXT.ttl,
      });

      const expectedAction = domainActions.updateDNSData({
        dnsdata_id: resourceTXT.dnsdata_id,
        dnsresource_id: resourceTXT.dnsresource_id,
        domain: 1,
        rrdata: "testing",
        ttl: resourceTXT.ttl,
      });
      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDNSResource")
      ).toBeUndefined();
      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDNSData")
      ).toStrictEqual(expectedAction);
    });
  });
});
