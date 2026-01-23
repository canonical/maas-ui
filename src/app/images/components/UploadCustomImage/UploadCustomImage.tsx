import type { ReactElement } from "react";

import { FileUpload } from "@canonical/maas-react-components";
import type { SelectProps } from "@canonical/react-components";
import { Input, Label, Select, Strip } from "@canonical/react-components";
import classNames from "classnames";
import type { FormikProps } from "formik";
import { Field } from "formik";
import { sha256 } from "js-sha256";
import type { FileRejection } from "react-dropzone";
import * as Yup from "yup";

import { useUploadCustomImage } from "@/app/api/query/images";
import type {
  BootResourceFileTypeChoice,
  UploadCustomImageError,
} from "@/app/apiclient";
import { FormikFieldChangeError } from "@/app/base/components/FormikField/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import {
  ARCHITECTURES,
  OPERATING_SYSTEM_NAMES,
  VALID_IMAGE_FILE_TYPES,
} from "@/app/images/constants";

type UploadImageFormValues = {
  title: string;
  release: string;
  os: string;
  arch: string;
  file: File | undefined;
};

const getFileExtension = (fileName: string): BootResourceFileTypeChoice => {
  return fileName.split(".").pop()?.toLowerCase() as BootResourceFileTypeChoice;
};

const getChecksumSha256 = async (file: Blob | File) => {
  const arrayBuffer = await file.arrayBuffer();
  return sha256(arrayBuffer);
};

const osOptions: SelectProps["options"] = [
  {
    label: "Select an operating system",
    value: "",
    disabled: true,
  },
  ...OPERATING_SYSTEM_NAMES,
];

const archOptions: SelectProps["options"] = [
  {
    label: "Select an architecture",
    value: "",
    disabled: true,
  },
  ...ARCHITECTURES,
];

const UploadImageSchema = Yup.object().shape({
  title: Yup.string().required("Release title is required."),
  release: Yup.string().required("Release is required."),
  os: Yup.string().required("OS is required."),
  arch: Yup.string().required("Architecture is required."),
  file: Yup.mixed<File>().required("Image file is required."),
});

const UploadCustomImage = (): ReactElement => {
  const { closeSidePanel } = useSidePanel();

  const uploadCustomImage = useUploadCustomImage();

  return (
    <div className="upload-custom-image-form">
      <Strip shallow>
        <FormikForm<UploadImageFormValues, UploadCustomImageError>
          allowUnchanged
          buttonsBehavior="independent"
          enableReinitialize
          errors={uploadCustomImage.error}
          initialValues={
            {
              title: "",
              release: "",
              os: "",
              arch: "",
              file: undefined,
            } as UploadImageFormValues
          }
          onCancel={closeSidePanel}
          onSubmit={async (values) => {
            if (values.file) {
              const sha256 = await getChecksumSha256(values.file);
              uploadCustomImage.mutate({
                body: values.file,
                headers: {
                  "Content-Type": "multipart/form-data",
                  name: `${values.os.toLowerCase()}/${values.release}`,
                  sha256,
                  size: values.file.size,
                  architecture: `${values.arch}/generic`,
                  "file-type": getFileExtension(values.file.name),
                  title: values.title,
                  "base-image": undefined, // TODO: base-image needs to be investigated as to what it's used for
                },
              });
            }
          }}
          onSuccess={closeSidePanel}
          saved={uploadCustomImage.isSuccess}
          saving={uploadCustomImage.isPending}
          submitLabel="Save and sync"
          validateOnChange
          validationSchema={UploadImageSchema}
        >
          {({
            errors,
            touched,
            values,
            setFieldValue,
            setFieldTouched,
            setFieldError,
          }: FormikProps<UploadImageFormValues>) => (
            <>
              <Label className="is-required" id="os-field">
                Operating system
              </Label>
              <Field
                aria-labelledby="os-field"
                as={Select}
                error={touched.os && errors.os}
                help="The operating system the custom image is based on."
                name="os"
                options={osOptions}
                required
              />
              <Label className="is-required" id="release-title-field">
                Release title
              </Label>
              <Field
                aria-labelledby="release-title-field"
                as={Input}
                error={touched.title && errors.title}
                help="The release title that will be shown in the images table, e.g. 24.04 LTS."
                name="title"
                required
                type="text"
              />
              <Label className="is-required" id="release-codename-field">
                Release codename
              </Label>
              <Field
                aria-labelledby="release-codename-field"
                as={Input}
                error={touched.release && errors.release}
                help="The codename for the release, e.g. 'noble'."
                name="release"
                required
                type="text"
              />
              <Label className="is-required" id="architecture-field">
                Architecture
              </Label>
              <Field
                aria-labelledby="architecture-field"
                as={Select}
                error={touched.arch && errors.arch}
                name="arch"
                options={archOptions}
                required
              />
              <div
                className={classNames("p-form__group p-form-validation", {
                  "is-error": touched.file && errors.file,
                })}
              >
                <Label className="is-required" id="file-field">
                  Upload image
                </Label>
                <p className="p-form-help-text">
                  Supported file types are tgz, tbz, txz, ddtgz, ddtbz, ddtxz,
                  ddtar, ddbz2, ddgz, ddxz and ddraw.
                </p>
                <div className="p-form__control">
                  <div className="u-padding-bottom--medium">
                    <Field
                      accept={VALID_IMAGE_FILE_TYPES}
                      aria-labelledby="file-field"
                      as={FileUpload}
                      error={touched.file && errors.file}
                      files={values.file && !errors.file ? [values.file] : []}
                      maxFiles={1}
                      maxSize={20000}
                      minSize={1}
                      name="file"
                      onFileUpload={async (
                        files: File[],
                        rejectedFiles: FileRejection[]
                      ) => {
                        setFieldTouched("file", true).catch(
                          (reason: unknown) => {
                            throw new FormikFieldChangeError(
                              "file",
                              "setFieldTouched",
                              reason as string
                            );
                          }
                        );
                        if (files.length) {
                          setFieldValue("file", files[0])
                            // Clear errors if file is valid
                            .then(() => {
                              setFieldError("file", undefined);
                            })
                            .catch((reason: unknown) => {
                              throw new FormikFieldChangeError(
                                "file",
                                "setFieldValue",
                                reason as string
                              );
                            });
                        } else {
                          setFieldValue("file", rejectedFiles[0].file)
                            // Set error to rejected file's message
                            .then(() => {
                              setFieldError(
                                "file",
                                `${rejectedFiles[0].errors[0].message}.`
                              );
                            })
                            .catch((reason: unknown) => {
                              throw new FormikFieldChangeError(
                                "file",
                                "setFieldValue",
                                reason as string
                              );
                            });
                        }
                      }}
                      onRemoveFile={async () => {
                        setFieldValue("file", undefined).catch(
                          (reason: unknown) => {
                            throw new FormikFieldChangeError(
                              "file",
                              "setFieldTouched",
                              reason as string
                            );
                          }
                        );
                      }}
                      rejectedFiles={
                        values.file && errors.file
                          ? [
                              {
                                file: values.file,
                                errors: [
                                  {
                                    code: "validation-error",
                                    message: errors.file as string,
                                  },
                                ],
                              },
                            ]
                          : []
                      }
                      required
                      validate={() => {
                        // Force return the previous state's errors so that
                        // form re-validation does not clear field-level errors.
                        return errors.file;
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </FormikForm>
      </Strip>
    </div>
  );
};

export default UploadCustomImage;
