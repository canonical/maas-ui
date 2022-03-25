import { CodeSnippet, Textarea } from "@canonical/react-components";
import type { FormikErrors } from "formik";
import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import { useId } from "app/base/hooks/base";
import type { CreateParams, UpdateParams } from "app/store/tag/types";

export const INVALID_XPATH_ERROR = "Invalid xpath expression";

export enum Label {
  Comment = "Comment",
  Definition = "Definition (automatic tag)",
  KernelOptions = "Kernel options",
  Name = "Tag name",
}

const getDefinitionError = (
  errors: FormikErrors<CreateParams>,
  definitionErrorId: string
) => {
  if (errors.definition?.includes(INVALID_XPATH_ERROR)) {
    // TODO: Add the link to the docs:
    // https://github.com/canonical-web-and-design/app-tribe/issues/748
    return (
      <span id={definitionErrorId}>
        The definition is an invalid XPath expression. See our{" "}
        <a href="#todo">XPath documentation</a> for more examples.
      </span>
    );
  }
  return errors.definition;
};

export const DefinitionField = (): JSX.Element => {
  const { initialValues, errors, values } = useFormikContext<
    CreateParams | UpdateParams
  >();
  const definitionErrorId = useId();
  const definitionError = getDefinitionError(errors, definitionErrorId);

  return (
    <>
      <FormikField
        aria-errormessage={!!definitionError ? definitionErrorId : undefined}
        aria-invalid={!!definitionError}
        className="p-text--code"
        error={definitionError}
        label={Label.Definition}
        name="definition"
        caution={
          !!initialValues.definition &&
          values.definition !== initialValues.definition
            ? "This tag will be unassigned from previous machines that no longer match this definition."
            : null
        }
        component={Textarea}
        placeholder={`//node[@class="system"]/vendor = "QEMU" and
//node[@class="processor"]/vendor[starts-with(.,"Advanced Micro Devices")] and not
//node[@id="firmware"]/capabilities/capability/@id = "uefi"`}
        rows={3}
      />
      {/* // TODO: Add the link to the docs:
          // https://github.com/canonical-web-and-design/app-tribe/issues/748 */}
      <p className="p-form-help-text u-sv1">
        Add an XPath expression as a definition. MAAS will auto-assign this tag
        to all current and future machines that match this definition. More
        about how to use <a href="#todo">XPath Expression</a>.
      </p>
      <p className="p-form-help-text u-sv1">
        This will tag legacy KVM vms running on AMD-based Hosts:
      </p>
      <CodeSnippet
        blocks={[
          {
            code: `//node[@class="system"]/vendor = "QEMU" and
//node[@class="processor"]/vendor[starts-with(.,"Advanced Micro Devices")] and not
//node[@id="firmware"]/capabilities/capability/@id = "uefi"`,
          },
        ]}
      />
    </>
  );
};

export default DefinitionField;
