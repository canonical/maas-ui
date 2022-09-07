import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import { MaasIntroSchema } from "../MaasIntro";

import NameCard, { Labels as NameCardLabels } from "./NameCard";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("NameCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.COMPLETED_INTRO, value: false }),
          configFactory({ name: ConfigNames.MAAS_NAME, value: "bionic-maas" }),
        ],
      }),
      user: userStateFactory({
        auth: authStateFactory({ user: userFactory({ is_superuser: true }) }),
      }),
    });
  });

  it("displays a tick when there are no name errors", () => {
    renderWithMockStore(
      <Formik initialValues={{ name: "my new maas" }} onSubmit={jest.fn()}>
        <NameCard />
      </Formik>,
      { state }
    );
    const icon = screen.getByLabelText("success");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--success");
  });

  it("displays an error icon when there are name errors", async () => {
    renderWithMockStore(
      <Formik
        initialValues={{ name: "my new maas" }}
        onSubmit={jest.fn()}
        validationSchema={MaasIntroSchema}
      >
        <NameCard />
      </Formik>,
      { state }
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: NameCardLabels.Name })
    );

    const icon = screen.getByLabelText("error");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--error");
  });
});
