import PowerParameterDefinition from "./PowerParameterDefinition";

import { PowerFieldType } from "app/store/general/types";
import { powerField as powerFieldFactory } from "testing/factories";
import { render, screen } from "testing/utils";

it("renders the value of a power parameter", () => {
  const field = powerFieldFactory({
    field_type: PowerFieldType.STRING,
  });
  render(<PowerParameterDefinition field={field} powerParameter="parameter" />);

  expect(screen.getByText(/parameter/)).toBeInTheDocument();
});

it("handles 'choice' power fields", () => {
  const field = powerFieldFactory({
    choices: [
      ["choice1", "Choice 1"],
      ["choice2", "Choice 2"],
    ],
    field_type: PowerFieldType.CHOICE,
  });
  render(<PowerParameterDefinition field={field} powerParameter="choice1" />);

  expect(screen.getByText(/Choice 1/)).toBeInTheDocument();
});

it("handles 'multiple_choice' power fields", () => {
  const field = powerFieldFactory({
    choices: [
      ["choice1", "Choice 1"],
      ["choice2", "Choice 2"],
      ["choice3", "Choice 3"],
    ],
    field_type: PowerFieldType.MULTIPLE_CHOICE,
  });
  render(
    <PowerParameterDefinition
      field={field}
      powerParameter={["choice1", "choice2"]}
    />
  );

  expect(screen.getByText(/Choice 1, Choice 2/)).toBeInTheDocument();
});

it("handles 'password' power fields", () => {
  const field = powerFieldFactory({
    field_type: PowerFieldType.PASSWORD,
  });
  render(<PowerParameterDefinition field={field} powerParameter="password" />);

  expect(screen.getByText("********")).toBeInTheDocument();
});
