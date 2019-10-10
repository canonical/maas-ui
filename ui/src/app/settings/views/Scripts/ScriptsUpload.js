import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import { useDropzone } from "react-dropzone";

import "./ScriptsUpload.scss";
import readScript from "./readScript";
import { messages } from "app/base/actions";
import Form from "app/base/components/Form";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import Row from "app/base/components/Row";
import { scripts as scriptActions } from "app/base/actions";
import { scripts as scriptSelectors } from "app/base/selectors";

const ScriptsUpload = ({ type }) => {
  const MAX_SIZE_BYTES = 2000000; // 2MB
  const hasErrors = useSelector(scriptSelectors.hasErrors);
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);
  const [savedScript, setSavedScript] = useState();
  const [script, setScript] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasErrors) {
      Object.keys(errors).forEach(key => {
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
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 1 || rejectedFiles.length > 1) {
        dispatch(
          messages.add(`Only a single file may be uploaded.`, "caution")
        );
        return;
      }

      if (rejectedFiles.length > 0 && rejectedFiles[0].size > MAX_SIZE_BYTES) {
        dispatch(
          messages.add(
            `File size must be ${MAX_SIZE_BYTES} bytes, or fewer.`,
            "caution"
          )
        );
        return;
      }

      if (rejectedFiles.length > 0) {
        dispatch(
          messages.add(`Invalid filetype, please try again.`, "negative")
        );
        return;
      }

      const acceptedFile = acceptedFiles[0];
      readScript(acceptedFile, dispatch, setScript);
    },
    [dispatch]
  );

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: "text/*, application/x-csh, application/x-sh",
    maxSize: MAX_SIZE_BYTES,
    multiple: false
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
    <FormCard stacked title={`Upload ${type} Script`}>
      <Row>
        <div
          {...getRootProps()}
          className={classNames("scripts-upload", {
            "scripts-upload--active": isDragActive,
            "scripts-upload--accept": isDragAccept,
            "scripts-upload--reject": isDragReject
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
          onSubmit={e => {
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
            actionDisabled={acceptedFiles.length === 0}
            actionLabel="Upload script"
          />
        </Form>
      </Row>
    </FormCard>
  );
};

ScriptsUpload.propTypes = {
  type: PropTypes.oneOf(["commissioning", "testing"]).isRequired
};

export default ScriptsUpload;
