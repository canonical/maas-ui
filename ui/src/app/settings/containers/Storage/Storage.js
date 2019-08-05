import { Formik, Form } from "formik";
import React from "react";
import { useSelector } from "react-redux";

import selectors from "app/settings/selectors";
import Button from "app/base/components/Button";
import Input from "app/base/components/Input";
import Loader from "app/base/components/Loader";
import Select from "app/base/components/Select";

const getStorageLayoutWarning = layout => {
  switch (layout) {
    case "blank":
      return "You will not be able to deploy machines with this storage layout. Manual configuration is required.";
    case "vmfs6":
      return "The VMFS6 storage layout only allows for the deployment of VMware (ESXi).";
    default:
      return;
  }
};

const Storage = () => {
  const loaded = useSelector(selectors.config.loaded);
  const loading = useSelector(selectors.config.loading);

  const defaultStorageLayout = useSelector(
    selectors.config.defaultStorageLayout
  );
  const storageLayoutOptions = useSelector(
    selectors.config.storageLayoutOptions
  );
  const enableDiskErasing = useSelector(selectors.config.enableDiskErasing);
  const diskEraseWithSecure = useSelector(selectors.config.diskEraseWithSecure);
  const diskEraseWithQuick = useSelector(selectors.config.diskEraseWithQuick);

  return (
    <>
      <h4>
        Storage
        {loading && <Loader text="Loading..." inline />}
      </h4>
      {loaded && (
        <Formik
          initialValues={{
            defaultStorageLayout,
            enableDiskErasing,
            diskEraseWithQuick,
            diskEraseWithSecure
          }}
          onChange
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            values
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-8">
                  <Select
                    id="defaultStorageLayout"
                    label="Default storage layout"
                    help="Storage layout that is applied to a node when it is commissioned."
                    options={storageLayoutOptions}
                    caution={getStorageLayoutWarning(
                      values.defaultStorageLayout
                    )}
                    value={values.defaultStorageLayout}
                    onChange={handleChange}
                  />
                  <Input
                    id="enableDiskErasing"
                    type="checkbox"
                    label="Erase nodes' disks prior to releasing"
                    help="Forces users to always erase disks when releasing."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values.enableDiskErasing}
                  />
                  <Input
                    id="diskEraseWithSecure"
                    type="checkbox"
                    label="Use secure erase by default when erasing disks"
                    help="Will only be used on devices that support secure erase. Other devices will fall back to full wipe or quick erase depending on the selected options."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values.diskEraseWithSecure}
                  />
                  <Input
                    id="diskEraseWithQuick"
                    type="checkbox"
                    label="Use quick erase by default when erasing disks"
                    help="This is not a secure erase; it wipes only the beginning and end of each disk."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values.diskEraseWithQuick}
                  />
                  <div className="user-form__buttons">
                    <Button
                      appearance="positive"
                      className="u-no-margin--bottom"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default Storage;
