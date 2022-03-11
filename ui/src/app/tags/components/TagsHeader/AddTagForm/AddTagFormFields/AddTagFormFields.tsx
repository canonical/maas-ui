import { CodeSnippet, Col, Row, Textarea } from "@canonical/react-components";
import type { FormikErrors } from "formik";
import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import { useId } from "app/base/hooks/base";
import type { CreateParams } from "app/store/tag/types";

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

export const AddTagForm = (): JSX.Element => {
  const { errors } = useFormikContext<CreateParams>();
  const definitionErrorId = useId();
  const definitionError = getDefinitionError(errors, definitionErrorId);

  return (
    <Row>
      <Col size={6}>
        <FormikField
          label={Label.Name}
          name="name"
          placeholder="Enter a name for the tag."
          type="text"
          required
        />
        <FormikField
          label={Label.Comment}
          name="comment"
          placeholder="Add a comment as an explanation for this tag."
          type="text"
        />
        <FormikField
          className="p-text--code"
          label={Label.KernelOptions}
          name="kernel_opts"
          component={Textarea}
          help={
            // TODO: Add the link to the docs:
            // https://github.com/canonical-web-and-design/app-tribe/issues/748
            <>
              Kernel options are appended to the kernel command line during
              booting while machines are commissioning or deploying. Read more
              about kernel options in <a href="#todo">tag management.</a>
            </>
          }
          placeholder="e.g. nomodeset console=tty0 console=ttys0,115200n8 amd_iommu=on kvm-amd.nested=1"
        />
      </Col>
      <Col size={6}>
        <FormikField
          aria-errormessage={!!definitionError ? definitionErrorId : undefined}
          aria-invalid={!!definitionError}
          className="p-text--code"
          error={definitionError}
          label={Label.Definition}
          name="definition"
          component={Textarea}
          placeholder={`//node[@class="system"]/vendor = "QEMU" and
//node[@class="processor"]/vendor[starts-with(.,"Advanced Micro Devices")] and not
//node[@id="firmware"]/capabilities/capability/@id = "uefi"`}
          rows={3}
        />
        {/* // TODO: Add the link to the docs:
          // https://github.com/canonical-web-and-design/app-tribe/issues/748 */}
        <p className="p-form-help-text u-sv1">
          Add an XPath expression as a definition. MAAS will auto-assign this
          tag to all current and future machines that match this definition.
          More about how to use <a href="#todo">XPath Expression</a>.
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
      </Col>
    </Row>
  );
};

export default AddTagForm;
