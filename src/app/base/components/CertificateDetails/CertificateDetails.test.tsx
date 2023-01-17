import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CertificateDetails, { Labels } from "./CertificateDetails";

import * as hooks from "app/base/hooks/analytics";
import { ConfigNames } from "app/store/config/types";
import {
  certificateMetadata as metadataFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("CertificateDetails", () => {
  it(`sends an analytics event when clicking the 'read more' link if analytics
    is enabled`, async () => {
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: true }),
        ],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <CertificateDetails
          certificate="certificate"
          eventCategory="eventCategory"
          metadata={metadataFactory()}
        />
      </Provider>
    );

    await userEvent.click(screen.getByRole("link", { name: Labels.ReadMore }));

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "eventCategory",
      "Click link to LXD authentication discourse",
      "Read more about authentication",
    ]);
    mockUseSendAnalytics.mockRestore();
  });
});
