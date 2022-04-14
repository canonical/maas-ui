import { useCallback, useEffect, useState } from "react";

import { Row, NotificationSeverity } from "@canonical/react-components";
import classNames from "classnames";
import { Formik } from "formik";
import type { FileRejection, FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";

import type { ReadScriptResponse } from "./readScript";
import readScript from "./readScript";

import FormCard from "app/base/components/FormCard";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useWindowTitle } from "app/base/hooks";
import { actions as messageActions } from "app/store/message";
import { actions as scriptActions } from "app/store/script";
import scriptSelectors from "app/store/script/selectors";
import { ScriptType } from "app/store/script/types";

type Props = {
  type: "commissioning" | "testing";
};

const ScriptsUpload = ({ type }: Props): JSX.Element => {
  const MAX_SIZE_BYTES = 2000000; // 2MB
  const hasErrors = useSelector(scriptSelectors.hasErrors);
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);
  const saving = useSelector(scriptSelectors.saving);
  const [savedScript, setSavedScript] = useState<string | null>(null);
  const [script, setScript] = useState<ReadScriptResponse | null>(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const title = `Upload ${type} script`;
  const listLocation = `/settings/scripts/${type}`;

  useWindowTitle(title);

  useEffect(() => {
    if (hasErrors && errors && typeof errors === "object") {
      Object.values(errors).forEach((error) => {
        dispatch(
          messageActions.add(
            `Error uploading ${savedScript}: ${error}`,
            NotificationSeverity.NEGATIVE
          )
        );
      });
      dispatch(scriptActions.cleanup());
    }
  }, [savedScript, hasErrors, errors, dispatch]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      let tooManyFiles = false; // only display 'too-many-files' error once.
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          // override error message for 'too-many-files' as we prefer ours.
          if (error.code === "too-many-files") {
            if (!tooManyFiles) {
              dispatch(
                messageActions.add(
                  `Only a single file may be uploaded.`,
                  NotificationSeverity.NEGATIVE
                )
              );
            }
            tooManyFiles = true;
            return;
          }
          // handle all other errors
          dispatch(
            messageActions.add(
              `${rejection.file.name}: ${error.message}`,
              NotificationSeverity.NEGATIVE
            )
          );
        });
      });

      if (!fileRejections.length && acceptedFiles.length) {
        readScript(acceptedFiles[0], dispatch, setScript);
      }
    },
    [dispatch]
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
      dispatch(
        messageActions.add(
          `${savedScript} uploaded successfully.`,
          NotificationSeverity.INFORMATION
        )
      );
      setSavedScript(null);
    }
  }, [dispatch, saved, savedScript]);

  if (saved) {
    // The script was successfully uploaded so redirect to the scripts list.
    return <Redirect to={listLocation} />;
  }

  const uploadedFile: FileWithPath = acceptedFiles[0];

  return (
    <FormCard stacked title={title}>
      <Row>
        <div
          {...getRootProps()}
          className={classNames("scripts-upload", {
            "scripts-upload--active": isDragActive,
            "scripts-upload--accept": isDragAccept,
            "scripts-upload--reject": isDragReject,
          })}
        >
          <input {...getInputProps()} />
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
        <Formik
          initialValues={{}}
          onSubmit={() => {
            dispatch(scriptActions.cleanup());
            if (script?.script) {
              const scriptType =
                type === "commissioning"
                  ? ScriptType.COMMISSIONING
                  : ScriptType.TESTING;
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
        >
          <FormikFormContent
            onCancel={() => history.push({ pathname: listLocation })}
            saved={saved}
            saving={saving}
            submitDisabled={acceptedFiles.length === 0}
            submitLabel="Upload script"
          >
            {uploadedFile ? (
              <p>
                {`${uploadedFile.path} (${uploadedFile.size} bytes) ready for upload.`}
              </p>
            ) : null}
          </FormikFormContent>
        </Formik>
      </Row>
    </FormCard>
  );
};

export default ScriptsUpload;
