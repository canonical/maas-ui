import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import EditRecordDomainForm from "./EditRecordDomainForm";

import type { DomainResource } from "app/store/domain/types/base";
import { RecordType } from "app/store/domain/types/base";
import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainSummary", () => {
  let state: RootState;
  const resourceA: DomainResource = {
    name: "test-resource-A",
    rrtype: RecordType.A,
    rrdata: "0.0.0.0",
    ttl: null,
    system_id: null,
    node_type: null,
    user_id: null,
    dnsresource_id: null,
    dnsdata_id: null,
  };
  const resourceTXT: DomainResource = {
    name: "test-resource-TXT",
    rrtype: RecordType.TXT,
    rrdata: "testing",
    ttl: null,
    system_id: null,
    node_type: null,
    user_id: null,
    dnsresource_id: null,
    dnsdata_id: null,
  };

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
        <EditRecordDomainForm
          id={1}
          resource={resourceA}
          closeForm={closeForm}
        />
      </Provider>
    );

    wrapper.find('button[data-test="cancel-action"]').simulate("click");

    expect(closeForm).toHaveBeenCalled();
  });

  describe("when resource is an address record of A or AAAA type", () => {
    it("calls update_dnsresource and update_address_record if resource name changed on save click", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <EditRecordDomainForm
            id={1}
            resource={resourceA}
            closeForm={() => void 0}
          />
        </Provider>
      );

      act(() =>
        wrapper.find("Formik").props().onSubmit({
          name: "test",
          ttl: 42,
          rrdata: "testing",
          rrtype: resourceA.rrtype,
        })
      );

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDnsResource")
      ).toMatchObject({
        type: "domain/updateDnsResource",
        meta: {
          method: "update_dnsresource",
          model: "domain",
        },
        payload: {
          params: {
            ...resourceA,
            domain: 1,
            name: "test",
            rrdata: "testing",
            address_ttl: 42,
            previous_name: resourceA.name,
            previous_rrdata: resourceA.rrdata,
          },
        },
      });

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateAddressRecord")
      ).toMatchObject({
        type: "domain/updateAddressRecord",
        meta: {
          method: "update_address_record",
          model: "domain",
        },
        payload: {
          params: {
            ...resourceA,
            domain: 1,
            name: "test",
            rrdata: "testing",
            address_ttl: 42,
            previous_name: resourceA.name,
            previous_rrdata: resourceA.rrdata,
          },
        },
      });
    });

    it("calls only update_address_record if resource name didn't change on save click", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <EditRecordDomainForm
            id={1}
            resource={resourceA}
            closeForm={() => void 0}
          />
        </Provider>
      );

      act(() =>
        wrapper.find("Formik").props().onSubmit({
          name: resourceA.name,
          ttl: 42,
          rrdata: "testing",
          rrtype: resourceA.rrtype,
        })
      );

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDnsResource")
      ).toBeUndefined();

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateAddressRecord")
      ).toMatchObject({
        type: "domain/updateAddressRecord",
        meta: {
          method: "update_address_record",
          model: "domain",
        },
        payload: {
          params: {
            ...resourceA,
            domain: 1,
            rrdata: "testing",
            previous_rrdata: resourceA.rrdata,
          },
        },
      });
    });

    it("parses IP addresses out of rrdata on save click", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <EditRecordDomainForm
            id={1}
            resource={resourceA}
            closeForm={() => void 0}
          />
        </Provider>
      );

      act(() =>
        wrapper.find("Formik").props().onSubmit({
          name: resourceA.name,
          rrdata: "0.0.0.0, 1.2.3.4",
          rrtype: resourceA.rrtype,
        })
      );

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateAddressRecord")
      ).toMatchObject({
        payload: {
          params: {
            ...resourceA,
            rrdata: "0.0.0.0, 1.2.3.4",
            ip_addresses: ["0.0.0.0", "1.2.3.4"],
          },
        },
      });
    });
  });

  describe("when resource is a record other type", () => {
    it("calls update_dnsresource and update_dns_data if resource name changed on save click", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <EditRecordDomainForm
            id={1}
            resource={resourceTXT}
            closeForm={() => void 0}
          />
        </Provider>
      );

      act(() =>
        wrapper.find("Formik").props().onSubmit({
          name: "test",
          ttl: resourceTXT.ttl,
          rrdata: "testing",
          rrtype: resourceTXT.rrtype,
        })
      );

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDnsResource")
      ).toMatchObject({
        type: "domain/updateDnsResource",
        meta: {
          method: "update_dnsresource",
          model: "domain",
        },
        payload: {
          params: {
            ...resourceTXT,
            domain: 1,
            name: "test",
            rrdata: "testing",
            previous_name: resourceTXT.name,
            previous_rrdata: resourceTXT.rrdata,
          },
        },
      });

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDnsData")
      ).toMatchObject({
        type: "domain/updateDnsData",
        meta: {
          method: "update_dnsdata",
          model: "domain",
        },
        payload: {
          params: {
            ...resourceTXT,
            domain: 1,
            name: "test",
            rrdata: "testing",
            previous_name: resourceTXT.name,
            previous_rrdata: resourceTXT.rrdata,
          },
        },
      });
    });

    it("calls only update_address_record if resource name didn't change on save click", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <EditRecordDomainForm
            id={1}
            resource={resourceTXT}
            closeForm={() => void 0}
          />
        </Provider>
      );

      act(() =>
        wrapper.find("Formik").props().onSubmit({
          name: resourceTXT.name,
          ttl: resourceTXT.ttl,
          rrdata: "testing",
          rrtype: resourceTXT.rrtype,
        })
      );

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDnsResource")
      ).toBeUndefined();

      expect(
        store
          .getActions()
          .find((action) => action.type === "domain/updateDnsData")
      ).toMatchObject({
        type: "domain/updateDnsData",
        meta: {
          method: "update_dnsdata",
          model: "domain",
        },
        payload: {
          params: {
            ...resourceTXT,
            domain: 1,
            rrdata: "testing",
            previous_name: resourceTXT.name,
            previous_rrdata: resourceTXT.rrdata,
          },
        },
      });
    });
  });
});
