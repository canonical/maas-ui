import { GenericTable, MainToolbar } from "@canonical/maas-react-components";
import { Button, Notification } from "@canonical/react-components";

import { useGetSslKeys } from "@/app/api/query/sslKeys";
import { useSidePanel } from "@/app/base/side-panel-context";
import useSSLKeysTableColumns from "@/app/preferences/views/SSLKeys/components/SSLKeysTable/useSSLKeysTableColumns/useSSLKeysTableColumns";
import { SSLKeyActionSidePanelViews } from "@/app/preferences/views/SSLKeys/constants";

const SSLKeysTable = (): React.ReactElement => {
  const { setSidePanelContent } = useSidePanel();
  const { data, failureReason, isPending } = useGetSslKeys();
  const sslKeys = data?.items ?? [];

  const columns = useSSLKeysTableColumns();

  return (
    <div className="ssl-keys-table" data-testid="ssl-keys-table">
      {failureReason && (
        <Notification severity="negative" title="Error:">
          {failureReason.message}
        </Notification>
      )}
      <MainToolbar>
        <MainToolbar.Controls>
          <Button
            onClick={() => {
              setSidePanelContent({
                view: SSLKeyActionSidePanelViews.ADD_SSL_KEY,
              });
            }}
          >
            Add SSL key
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      <GenericTable
        aria-label="SSL keys"
        columns={columns}
        data={sslKeys}
        isLoading={isPending}
        noData="No SSL keys available."
        variant="regular"
      />
    </div>
  );
};

export default SSLKeysTable;
