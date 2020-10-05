import { Form, Row } from "@canonical/react-components";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import readScript from "./readScript";
import { messages } from "app/base/actions";
import { useWindowTitle } from "app/base/hooks";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import { scripts as scriptActions } from "app/base/actions";
import scriptSelectors from "app/store/scripts/selectors";

const ScriptsUpload = ({ type }) => {
  const MAX_SIZE_BYTES = 2000000; // 2MB
  const hasErrors = useSelector(scriptSelectors.hasErrors);
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);
  const [savedScript, setSavedScript] = useState();
  const [script, setScript] = useState();
  const dispatch = useDispatch();
  const title = `Upload ${type} script`;

  useWindowTitle(title);

  useEffect(() => {
    if (hasErrors) {
      Object.keys(errors).forEach((key) => {
        dispatch(
          messages.add(
            `Error uploading ${savedScript}: ${errors[key]}`,
            "negative"
          )
        );
      });
      dispatch(scriptActions.cleanup());
    }
  }, [savedScript, hasErrors, errors, dispatch]);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      let tooManyFiles = false; // only display 'too-many-files' error once.
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          // override error message for 'too-many-files' as we prefer ours.
          if (error.code === "too-many-files") {
            if (!tooManyFiles) {
              dispatch(
                messages.add(`Only a single file may be uploaded.`, "negative")
              );
            }
            tooManyFiles = true;
            return;
          }
          // handle all other errors
          dispatch(
            messages.add(`${rejection.file.name}: ${error.message}`, "negative")
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
        messages.add(`${savedScript} uploaded successfully.`, "information")
      );
      setSavedScript();
    }
  }, [dispatch, saved, savedScript]);

  if (saved) {
    // The script was successfully uploaded so redirect to the scripts list.
    return <Redirect to={`/settings/scripts/${type}`} />;
  }

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
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(scriptActions.cleanup());
            if (script) {
              if (script.hasMetadata) {
                // we allow the API to parse the script name from the metadata header
                dispatch(scriptActions.upload(type, script.script));
              } else {
                dispatch(
                  scriptActions.upload(type, script.script, script.name)
                );
              }
              setSavedScript(script.name);
            }
          }}
        >
          {acceptedFiles.length > 0 && (
            <p>
              {`${acceptedFiles[0].path} (${acceptedFiles[0].size} bytes) ready for upload.`}
            </p>
          )}

          <FormCardButtons
            submitDisabled={acceptedFiles.length === 0}
            submitLabel="Upload script"
          />
        </Form>
      </Row>
    </FormCard>
  );
};

ScriptsUpload.propTypes = {
  type: PropTypes.oneOf(["commissioning", "testing"]).isRequired,
};

export default ScriptsUpload;
