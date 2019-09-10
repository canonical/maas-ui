import { Formik } from "formik";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";

import actions from "app/settings/actions";
import { formikFormDisabled } from "app/settings/utils";
import Col from "app/base/components/Col";
import Form from "app/base/components/Form";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import Row from "app/base/components/Row";

const ScriptSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required()
});

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out"
};

const activeStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

const ScriptsUpload = ({ type }) => {
  const [savedScript, setSavedScript] = useState();
  const [scriptContents, setScriptContents] = useState();
  const dispatch = useDispatch();

  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();
    reader.onabort = () => console.error("file reading was aborted");
    reader.onerror = () => console.error("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      console.log(binaryStr);
      setScriptContents(binaryStr);
    };

    acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    console.log("got", acceptedFiles);
  }, []);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: "text/*"
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragAccept, isDragActive, isDragReject]
  );

  const acceptedFilesItems = acceptedFiles.map(file => (
    <span>
      {file.path} - {file.size} bytes
    </span>
  ));

  return (
    <>
      <FormCard title={`Upload ${type} Script`}>
        <Row>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag 'n' drop a file here, or click to select a file</p>
            )}
          </div>
        </Row>
        <Row>
          <Formik
            initialValues={{
              name: "",
              description: ""
            }}
            validationSchema={ScriptSchema}
            onSubmit={values => {
              dispatch(actions.scripts.cleanup());
              dispatch(
                actions.scripts.upload(
                  values.name,
                  values.description,
                  type,
                  scriptContents
                )
              );
              setSavedScript(values.name);
            }}
            render={formikProps => (
              <Form onSubmit={formikProps.handleSubmit}>
                {acceptedFiles.length > 0 && (
                  <>
                    <h4>{acceptedFilesItems}</h4>
                    <Row>
                      <Col size={4}>
                        <FormikField
                          label="Name"
                          type="text"
                          fieldKey="name"
                          formikProps={formikProps}
                          required
                        />
                        <FormikField
                          label="Description"
                          type="text"
                          fieldKey="description"
                          formikProps={formikProps}
                          required
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <FormCardButtons
                  actionDisabled={
                    acceptedFiles.length === 0 ||
                    formikFormDisabled(formikProps)
                  }
                  actionLabel={`Upload script`}
                />
              </Form>
            )}
          ></Formik>
        </Row>
      </FormCard>
    </>
  );
};

ScriptsUpload.propTypes = {
  type: PropTypes.oneOf(["commissioning", "testing"]).isRequired
};

export default ScriptsUpload;
