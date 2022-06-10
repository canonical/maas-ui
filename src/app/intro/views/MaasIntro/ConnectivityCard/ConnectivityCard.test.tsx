import { mount } from "enzyme";
import { Formik } from "formik";

import { MaasIntroSchema } from "../MaasIntro";

import ConnectivityCard from "./ConnectivityCard";

import { waitForComponentToPaint } from "testing/utils";

describe("ConnectivityCard", () => {
  it("displays a tick when there are no errors", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          httpProxy: "http://www.website.com",
          mainArchiveUrl: "http://www.mainarchive.com",
          portsArchiveUrl: "http://www.portsarchive.com",
          upstreamDns: "8.8.8.8",
        }}
        onSubmit={jest.fn()}
        validationSchema={MaasIntroSchema}
      >
        <ConnectivityCard />
      </Formik>
    );
    expect(
      wrapper
        .find("[data-testid='maas-connectivity-form'] Icon[name='success']")
        .exists()
    ).toBe(true);
  });

  it("displays an error icon when there are errors", async () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          httpProxy: "http://www.website.com",
          mainArchiveUrl: "http://www.mainarchive.com",
          portsArchiveUrl: "http://www.portsarchive.com",
          upstreamDns: "8.8.8.8",
        }}
        onSubmit={jest.fn()}
        validationSchema={MaasIntroSchema}
      >
        <ConnectivityCard />
      </Formik>
    );
    wrapper
      .find("[name='mainArchiveUrl']")
      .last()
      .simulate("change", {
        target: {
          name: "mainArchiveUrl",
          value: "",
        },
      });
    await waitForComponentToPaint(wrapper);
    expect(
      wrapper
        .find("[data-testid='maas-connectivity-form'] Icon[name='error']")
        .exists()
    ).toBe(true);
  });
});
