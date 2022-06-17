import { screen } from "@testing-library/react";
import MockDate from "mockdate";

import Footer from "./Footer";

import { ConfigNames } from "app/store/config/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  MockDate.set("2020-01-01");
});

afterEach(() => {
  process.env = originalEnv;
  MockDate.reset();
});

it("displays the feedback link when analytics enabled and not in development environment", () => {
  process.env = { ...originalEnv, NODE_ENV: "production" };
  const state = rootStateFactory({
    config: configStateFactory({
      items: [
        configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: true }),
      ],
    }),
  });
  renderWithMockStore(<Footer />, { state });

  expect(
    screen.getByRole("button", { name: "Give feedback" })
  ).toBeInTheDocument();
});

it("hides the feedback link when analytics disabled", () => {
  process.env = { ...originalEnv, NODE_ENV: "production" };
  const state = rootStateFactory({
    config: configStateFactory({
      items: [
        configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: false }),
      ],
    }),
  });
  renderWithMockStore(<Footer />, { state });

  expect(
    screen.queryByRole("button", { name: "Give feedback" })
  ).not.toBeInTheDocument();
});

it("hides the feedback link in development environment", () => {
  process.env = { ...originalEnv, NODE_ENV: "development" };
  const state = rootStateFactory({
    config: configStateFactory({
      items: [
        configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: true }),
      ],
    }),
  });
  renderWithMockStore(<Footer />, { state });

  expect(
    screen.queryByRole("button", { name: "Give feedback" })
  ).not.toBeInTheDocument();
});
