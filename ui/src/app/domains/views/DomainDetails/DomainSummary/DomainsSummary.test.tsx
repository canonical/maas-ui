import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainSummary from "./DomainSummary";

import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainSummary", () => {
  it("render nothing if domain doesn't exist", () => {
    const state = rootStateFactory();
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DomainSummary id={1} />
      </Provider>
    );

    expect(wrapper.find("DomainSummary").children()).toHaveLength(0);
  });

  it("renders domain summary", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "test" })],
      }),
    });
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DomainSummary id={1} />
      </Provider>
    );

    expect(wrapper.find('[data-test="domain-summary"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="domain-summary-form"]').exists()).toBe(
      false
    );
  });

  it("doesn't render Edit button when user is not admin", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "test" })],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ is_superuser: false }),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainSummary id={1} />
      </Provider>
    );
    expect(wrapper.find('button[data-test="edit-domain"]').exists()).toBe(
      false
    );
  });

  describe("when user is admin", () => {
    let state: RootState;

    beforeEach(() => {
      state = rootStateFactory({
        domain: domainStateFactory({
          items: [
            domainFactory({
              id: 1,
              name: "test",
            }),
          ],
        }),
        user: userStateFactory({
          auth: authStateFactory({
            user: userFactory({ is_superuser: true }),
          }),
        }),
      });
    });

    it("renders the Edit button", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <DomainSummary id={1} />
        </Provider>
      );

      expect(wrapper.find('button[data-test="edit-domain"]').exists()).toBe(
        true
      );
    });

    it("renders the form when Edit button is clicked", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <DomainSummary id={1} />
        </Provider>
      );

      wrapper.find('button[data-test="edit-domain"]').simulate("click");

      expect(wrapper.find('[data-test="domain-summary"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="domain-summary-form"]').exists()).toBe(
        true
      );
    });

    it("closes the form when Cancel button is clicked", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <DomainSummary id={1} />
        </Provider>
      );

      wrapper.find('button[data-test="edit-domain"]').simulate("click");
      wrapper.find("button[data-test='cancel-action']").simulate("click");

      expect(wrapper.find('[data-test="domain-summary"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="domain-summary-form"]').exists()).toBe(
        false
      );
    });

    it("calls actions.update on save click", () => {
      const store = mockStore(state);

      const wrapper = mount(
        <Provider store={store}>
          <DomainSummary id={1} />
        </Provider>
      );

      wrapper.find('button[data-test="edit-domain"]').simulate("click");

      act(() =>
        wrapper.find("Formik").props().onSubmit({
          id: 1,
          name: "test",
          ttl: 42,
          authoritative: false,
        })
      );

      expect(
        store.getActions().find((action) => action.type === "domain/update")
      ).toStrictEqual({
        type: "domain/update",
        meta: {
          method: "update",
          model: "domain",
        },
        payload: {
          params: {
            id: 1,
            name: "test",
            ttl: 42,
            authoritative: false,
          },
        },
      });
    });
  });
});
