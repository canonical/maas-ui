import React, { useState } from "react";

import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeleteConfirm from "./DeleteConfirm";

import { useDeleteZone, useGetZone } from "@/app/api/query/zones";
import type { DeleteZoneData } from "@/app/apiclient/codegen";
import SectionHeader from "@/app/base/components/SectionHeader";
import urls from "@/app/base/urls";
import authSelectors from "@/app/store/auth/selectors";

type ZoneDetailsHeaderProps = {
  id: number;
};

const ZoneDetailsHeader: React.FC<ZoneDetailsHeaderProps> = ({ id }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const zone = useGetZone({ path: { zone_id: id } });
  const deleteZone = useDeleteZone({ path: { zone_id: id } });
  const navigate = useNavigate();
  let title = "";

  if (!zone.isPending) {
    title = zone.data
      ? `Availability zone: ${zone.data.name}`
      : "Availability zone not found";
  }

  const [deleting, setDeleting] = useState(false);

  const isAdmin = useSelector(authSelectors.isAdmin);
  const isDefaultZone = id === 1;

  const onDelete = () => {
    if (isAdmin && !isDefaultZone) {
      setDeleting(true);
      deleteZone.mutate(
        {
          path: {
            zone_id: id,
          },
        } as DeleteZoneData,
        {
          onSuccess: () => {
            setDeleting(false);
            navigate({ pathname: urls.zones.index });
          },
          onError: () => {
            setDeleting(false);
          },
        }
      );
    }
  };

  const closeExpanded = () => setShowConfirm(false);

  let buttons: React.ReactElement[] | null = [
    <Button
      data-testid="delete-zone"
      key="delete-zone"
      onClick={() => setShowConfirm(true)}
    >
      Delete AZ
    </Button>,
  ];

  if (showConfirm || isDefaultZone || !isAdmin) {
    buttons = null;
  }

  let confirmDelete = null;

  if (showConfirm && isAdmin && !isDefaultZone) {
    confirmDelete = (
      <>
        <hr />
        <DeleteConfirm
          closeExpanded={closeExpanded}
          confirmLabel="Delete AZ"
          deleting={deleting}
          message="Are you sure you want to delete this AZ?"
          onConfirm={onDelete}
        />
      </>
    );
  }

  if (!zone.isPending && zone.data) {
    title = `Availability zone: ${zone.data.name}`;
  } else if (zone.isFetched) {
    title = "Availability zone not found";
    buttons = null;
  }

  return (
    <>
      <SectionHeader
        buttons={buttons}
        loading={!zone.isFetched}
        title={title}
      />

      {confirmDelete}
    </>
  );
};

export default ZoneDetailsHeader;
