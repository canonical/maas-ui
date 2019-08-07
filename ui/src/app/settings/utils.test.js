import { formikFormDisabled, simpleObjectEquality } from "./utils";

describe("settings utils", () => {
  describe("simpleObjectEquality", () => {
    it("returns true if two objects have the same key value pairs in the same order", () => {
      const obj1 = { key1: "value1", key2: "value2" };
      const obj2 = { key1: "value1", key2: "value2" };
      expect(simpleObjectEquality(obj1, obj2)).toBe(true);
    });
  });

  describe("formikFormDisabled", () => {
    it("returns true if form is submitting", () => {
      const formikProps = {
        initialValues: { key: "value" },
        values: { key: "value" },
        isSubmitting: true
      };
      expect(formikFormDisabled(formikProps)).toBe(true);
    });

    it("returns true if the form values have not changed", () => {
      const formikProps = {
        initialValues: { key: "value" },
        values: { key: "value" },
        isSubmitting: false
      };
      expect(formikFormDisabled(formikProps)).toBe(true);
    });

    it("returns false if the form is not submitting and form values have changed", () => {
      const formikProps = {
        initialValues: { key: "value1" },
        values: { key: "value2" },
        isSubmitting: false
      };
      expect(formikFormDisabled(formikProps)).toBe(false);
    });
  });
});
