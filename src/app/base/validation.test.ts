import { ValidationError } from "yup";

import { hostnameValidation, HostnameValidationLabel } from "./validation";

describe("hostname regex", () => {
  it("handles valid characters", async () => {
    await expect(hostnameValidation.validate("valid-name")).resolves.toBe(
      "valid-name"
    );
  });

  it("handles invalid characters", async () => {
    await expect(
      hostnameValidation.validate("valid_name")
    ).rejects.toStrictEqual(
      new ValidationError(HostnameValidationLabel.CharactersError)
    );
  });

  it("is invalid if it starts with a dash", async () => {
    await expect(
      hostnameValidation.validate("-invalidname")
    ).rejects.toStrictEqual(
      new ValidationError(HostnameValidationLabel.DashStartError)
    );
  });

  it("is invalid if it ends with a dash", async () => {
    await expect(
      hostnameValidation.validate("invalidname-")
    ).rejects.toStrictEqual(
      new ValidationError(HostnameValidationLabel.DashEndError)
    );
  });

  it("is invalid if it is longer than 63 characters", async () => {
    await expect(
      hostnameValidation.validate(
        "invalidnamethatiswaytoolongimeanthisislongbyanystandardormeasure"
      )
    ).rejects.toStrictEqual(
      new ValidationError(HostnameValidationLabel.LengthError)
    );
  });
});
