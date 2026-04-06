import type { ReactElement } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import {
  Col,
  Notification as NotificationBanner,
  Row,
  Spinner,
} from "@canonical/react-components";
import * as Yup from "yup";

import {
  useGetConfiguration,
  useSetConfiguration,
} from "@/app/api/query/configurations";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import PageContent from "@/app/base/components/PageContent";
import { ConfigNames } from "@/app/store/config/types";

const SynchronizationSchema = Yup.object()
  .shape({
    autoSync: Yup.boolean().required(),
  })
  .defined();

type SynchronizationValues = {
  autoSync: boolean;
  syncInterval?: number;
};

const Synchronization = (): ReactElement => {
  const importConfig = useGetConfiguration({
    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
  });
  const configETag = importConfig.data?.headers?.get("ETag");
  const autoImport = (importConfig.data?.value as boolean) ?? false;
  const updateConfig = useSetConfiguration();

  const initialValues: SynchronizationValues = {
    autoSync: autoImport,
    syncInterval: 60,
  };

  const onSubmit = (values: SynchronizationValues) => {
    updateConfig.mutate({
      headers: {
        ETag: configETag,
      },
      body: {
        value: values.autoSync,
      },
      path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
    });
  };

  return (
    <PageContent>
      <ContentSection variant="narrow">
        <ContentSection.Title className="section-header__title">
          Synchronization
        </ContentSection.Title>
        <ContentSection.Content>
          {importConfig.isPending && <Spinner text="Loading..." />}
          <Row>
            <Col size={12}>
              {importConfig.isError && (
                <NotificationBanner severity="negative">
                  {importConfig.error.message}
                </NotificationBanner>
              )}
              {importConfig.isSuccess && importConfig.data && (
                <FormikForm
                  aria-label="Synchronization"
                  enableReinitialize
                  errors={updateConfig.error}
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                  saved={updateConfig.isSuccess}
                  saving={updateConfig.isPending}
                  submitLabel="Save"
                  validationSchema={SynchronizationSchema}
                >
                  {() => {
                    return (
                      <>
                        <FormikField
                          data-testid="auto-sync-switch"
                          help="Enables image updates by a given synchronization interval."
                          id="auto-sync-switch"
                          label="Automatically sync images"
                          name="autoSync"
                          type="checkbox"
                        />
                        {/*TODO: uncomment when synchronization interval is available as a global configuration*/}
                        {/*{values.autoSync ? (*/}
                        {/*  <FormikField*/}
                        {/*    help="Image synchronization interval, in minutes."*/}
                        {/*    label="Sync interval"*/}
                        {/*    name="syncInterval"*/}
                        {/*    required*/}
                        {/*    type="number"*/}
                        {/*  />*/}
                        {/*) : null}*/}
                      </>
                    );
                  }}
                </FormikForm>
              )}
            </Col>
          </Row>
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default Synchronization;
