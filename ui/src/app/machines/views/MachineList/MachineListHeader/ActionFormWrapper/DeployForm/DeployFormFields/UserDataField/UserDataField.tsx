import { Spinner, Textarea } from "@canonical/react-components";
import { FileRejection, useDropzone } from "react-dropzone";
import { useFormikContext } from "formik";
import classNames from "classnames";
import React, { useState } from "react";

import { DeployFormValues } from "../../DeployForm";
import FormikField from "app/base/components/FormikField";

const MAX_SIZE_BYTES = 2000000; // 2MB

export const UserDataField = (): JSX.Element => {
  const [fileErrors, setFileErrors] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const { handleChange, setFieldTouched, setFieldValue } = useFormikContext<
    DeployFormValues
  >();

  const onDropAccepted = ([file]) => {
    setUploadingFile(true);
    inputRef.current.value = "";
    const reader = new FileReader();

    reader.onabort = () => {
      setUploadingFile(false);
      setFileErrors("Reading file aborted.");
    };
    reader.onerror = () => {
      setUploadingFile(false);
      setFileErrors("Error reading file.");
    };
    reader.onload = () => {
      setUploadingFile(false);
      setFieldValue("userData", reader.result as string);
      setFieldTouched("userData");
    };
    reader.readAsText(file);
  };

  const onDragEnter = () => {
    // Clear the last file's errors.
    setFileErrors(null);
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    let errors: string;
    if (fileRejections.length > 1) {
      errors = "Only a single file may be uploaded.";
    } else {
      // Convert the errors to a single string.
      errors = fileRejections[0].errors.map(({ message }) => message).join(" ");
    }
    setFileErrors(errors);
  };

  const {
    getInputProps,
    getRootProps,
    inputRef,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept:
      "text/*, application/x-csh, application/x-sh, application/x-shellscript, application/json, application/ld+json, application/x-yaml",
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDropAccepted,
    onDragEnter,
    onDropRejected,
  });

  return (
    <div
      {...getRootProps()}
      className={classNames({
        "is-success": isDragAccept,
        "is-error": isDragReject,
      })}
    >
      <FormikField
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="u-sv2"
        component={Textarea}
        error={fileErrors}
        name="userData"
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(evt);
          if (fileErrors) {
            // Clear the errors if the text has been changed.
            setFileErrors(null);
          }
        }}
        placeholder="Paste or drop script here"
        spellCheck="false"
        style={{ minHeight: "15rem" }}
      />
      {uploadingFile && <Spinner inline text="Uploading file..." />}
      <input {...getInputProps()} style={null} />
    </div>
  );
};

export default UserDataField;
