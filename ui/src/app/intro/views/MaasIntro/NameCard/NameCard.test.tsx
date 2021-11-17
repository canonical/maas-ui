import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { MaasIntroSchema } from "../MaasIntro";

import NameCard from "./NameCard";

import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("NameCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: "completed_intro", value: false }),
          configFactory({ name: "maas_name", value: "bionic-maas" }),
        ],
      }),
      user: userStateFactory({
        auth: authStateFactory({ user: userFactory({ is_superuser: true }) }),
      }),
    });
  });

  it("displays a tick when there are no name errors", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ name: "my new maas" }} onSubmit={jest.fn()}>
          <NameCard />
        </Formik>
      </Provider>
    );
    expect(
      wrapper
        .find("[data-testid='maas-name-form'] Icon[name='success']")
        .exists()
    ).toBe(true);
  });

  it("displays an error icon when there are name errors", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ name: "my new maas" }}
          onSubmit={jest.fn()}
          validationSchema={MaasIntroSchema}
        >
          <NameCard />
        </Formik>
      </Provider>
    );
    wrapper
      .find("[name='name']")
      .last()
      .simulate("change", {
        target: {
          name: "name",
          value: "",
        },
      });
    await waitForComponentToPaint(wrapper);
    expect(
      wrapper.find("[data-testid='maas-name-form'] Icon[name='error']").exists()
    ).toBe(true);
  });
});
