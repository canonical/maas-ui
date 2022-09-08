import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import { MaasIntroSchema } from "../MaasIntro";

import ConnectivityCard, {
  Labels as ConnectivityCardLabels,
} from "./ConnectivityCard";

describe("ConnectivityCard", () => {
  it("displays a tick when there are no errors", () => {
    render(
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
    const icon = screen.getByLabelText("success");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--success");
  });

  it("displays an error icon when there are errors", async () => {
    render(
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
    await userEvent.clear(
      screen.getByRole("textbox", {
        name: ConnectivityCardLabels.MainArchiveUrl,
      })
    );
    const icon = screen.getByLabelText("error");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--error");
  });
});
