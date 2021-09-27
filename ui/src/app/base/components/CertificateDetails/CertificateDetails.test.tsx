import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CertificateDetails from "./CertificateDetails";

import * as hooks from "app/base/hooks";
import {
  certificateMetadata as metadataFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CertificateDetails", () => {
  it("can toggle displaying the private key", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CertificateDetails
          certificate="certificate"
          eventCategory="eventCategory"
          metadata={metadataFactory()}
          privateKey="private-key"
        />
      </Provider>
    );
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(false);

    wrapper.find("Button[data-test='toggle-key']").simulate("click");
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(true);

    wrapper.find("Button[data-test='toggle-key']").simulate("click");
    expect(wrapper.find("[data-test='private-key']").exists()).toBe(false);
  });

  it(`sends an analytics event when clicking the 'read more' link if analytics
    is enabled`, () => {
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);
    const state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "analytics_enabled", value: true })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CertificateDetails
          certificate="certificate"
          eventCategory="eventCategory"
          metadata={metadataFactory()}
          privateKey="private-key"
        />
      </Provider>
    );
    wrapper.find("Link[data-test='read-more-link']").simulate("click");

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "eventCategory",
      "Click link to LXD authentication discourse",
      "Read more about authentication",
    ]);
    mockUseSendAnalytics.mockRestore();
  });
});
