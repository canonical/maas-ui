import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { Row, useToastNotification } from "@canonical/react-components";
import classNames from "classnames";
import type { FileRejection, FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

import type { ReadScriptResponse } from "./readScript";
import readScript from "./readScript";

import FormikForm from "@/app/base/components/FormikForm";
import { scriptActions } from "@/app/store/script";
import scriptSelectors from "@/app/store/script/selectors";
import { ScriptType } from "@/app/store/script/types";

type ScriptsUploadProps = {
  type: "commissioning" | "deployment" | "testing";
};

export enum Labels {
  FileUploadArea = "File upload area",
  SubmitButton = "Upload script",
}

const ScriptsUpload = ({ type }: ScriptsUploadProps): ReactElement => {
  const MAX_SIZE_BYTES = 2000000; // 2MB
  const hasErrors = useSelector(scriptSelectors.hasErrors);
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);
  const saving = useSelector(scriptSelectors.saving);
  const [savedScript, setSavedScript] = useState<string | null>(null);
  const [script, setScript] = useState<ReadScriptResponse | null>(null);
  const dispatch = useDispatch();
  const { closeSidePanel } = useSidePanel();
  const { failure, info } = useToastNotification();

  useEffect(() => {
    if (hasErrors && errors && typeof errors === "object") {
      Object.values(errors).forEach((error) => {
        failure(`Error uploading ${savedScript}: ${error}`, error);
      });
      dispatch(scriptActions.cleanup());
    }
  }, [savedScript, hasErrors, errors, dispatch, failure]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      let tooManyFiles = false; // only display 'too-many-files' error once.
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          // override error message for 'too-many-files' as we prefer ours.
          if (error.code === "too-many-files") {
            if (!tooManyFiles) {
              failure(`Only a single file may be uploaded.`, error);
            }
            tooManyFiles = true;
            return;
          }
          // handle all other errors
          failure(`${rejection.file.name}: ${error.message}`, error);
        });
      });

      if (!fileRejections.length && acceptedFiles.length) {
        readScript(
          acceptedFiles[0],
          (message) => failure(message, undefined),
          setScript
        );
      }
    },
    [failure]
  );

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
  });

  useEffect(() => {
    if (saved) {
      dispatch(scriptActions.cleanup());
      info(`${savedScript} uploaded successfully.`);
      setSavedScript(null);
    }
  }, [dispatch, saved, savedScript, info]);

  const uploadedFile: FileWithPath = acceptedFiles[0];

  return (
    <div className="u-nudge-down">
      <Row>
        <div
          {...getRootProps()}
          className={classNames("scripts-upload", {
            "scripts-upload--active": isDragActive,
            "scripts-upload--accept": isDragAccept,
            "scripts-upload--reject": isDragReject,
          })}
        >
          <input aria-label={Labels.FileUploadArea} {...getInputProps()} />
          {isDragActive ? (
            <p className="u-no-margin--bottom">Drop the file here ...</p>
          ) : (
            <p className="u-no-margin--bottom">
              Drag 'n' drop a script here ('.sh' file ext required), or click to
              select a file
            </p>
          )}
        </div>
      </Row>
      <Row>
        <FormikForm
          initialValues={{}}
          onCancel={closeSidePanel}
          onSubmit={() => {
            dispatch(scriptActions.cleanup());
            if (script?.script) {
              const scriptType =
                type === "commissioning"
                  ? ScriptType.COMMISSIONING
                  : type === "testing"
                    ? ScriptType.TESTING
                    : ScriptType.DEPLOYMENT;
              if (script.hasMetadata) {
                // we allow the API to parse the script name from the metadata header
                dispatch(scriptActions.upload(scriptType, script.script));
              } else {
                dispatch(
                  scriptActions.upload(scriptType, script.script, script.name)
                );
              }
              setSavedScript(script.name);
            }
          }}
          onSuccess={closeSidePanel}
          saved={saved}
          saving={saving}
          submitDisabled={acceptedFiles.length === 0}
          submitLabel={Labels.SubmitButton}
        >
          {uploadedFile ? (
            <p>
              {`${uploadedFile.path} (${uploadedFile.size} bytes) ready for upload.`}
            </p>
          ) : null}
        </FormikForm>
      </Row>
    </div>
  );
};

export default ScriptsUpload;
