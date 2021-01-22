import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import CreateBcacheFields from "./CreateBcacheFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import { BcacheModes } from "app/store/machine/types";
import { isBcache, isCacheSet, isDisk } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

export type CreateBcacheValues = {
  cacheMode: BcacheModes;
  cacheSetId: string;
  fstype?: string;
  mountOptions?: string;
  mountPoint?: string;
  name: string;
  tags: string[];
};

type Props = {
  closeExpanded: () => void;
  storageDevice: Disk | Partition;
  systemId: Machine["system_id"];
};

const CreateBcacheSchema = Yup.object().shape({
  cacheMode: Yup.string().required("Cache mode is required"),
  cacheSetId: Yup.number().required("Cache set is required"),
  fstype: Yup.string(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string().when("fstype", {
    is: (val: CreateBcacheValues["fstype"]) => Boolean(val),
    then: Yup.string().matches(/^\//, "Mount point must start with /"),
  }),
  name: Yup.string().required("Name is required"),
  tags: Yup.array().of(Yup.string()),
});

const getInitialName = (disks: Disk[]) => {
  if (!disks || disks.length === 0) {
    return "bcache0";
  }
  const bcacheCount = disks.reduce<number>(
    (count, disk) => (isBcache(disk) ? count + 1 : count),
    0
  );
  return `bcache${bcacheCount}`;
};

export const CreateBcache = ({
  closeExpanded,
  storageDevice,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingBcache",
    "createBcache",
    () => closeExpanded()
  );
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (machine && "disks" in machine) {
    const cacheSets = machine.disks.filter((disk) => isCacheSet(disk));

    if (cacheSets.length === 0) {
      // Close the form if the last remaining cache set was deleted after the
      // form had already opened.
      closeExpanded();
      return null;
    }

    return (
      <FormikForm
        allowUnchanged
        buttons={FormCardButtons}
        cleanup={machineActions.cleanup}
        errors={errors}
        initialValues={{
          cacheMode: BcacheModes.WRITE_BACK,
          cacheSetId: cacheSets[0].id,
          fstype: "",
          mountOptions: "",
          mountPoint: "",
          name: getInitialName(machine.disks),
          tags: [],
        }}
        onCancel={closeExpanded}
        onSaveAnalytics={{
          action: "Create bcache",
          category: "Machine storage",
          label: "Create bcache",
        }}
        onSubmit={(values: CreateBcacheValues) => {
          const {
            cacheMode,
            cacheSetId,
            fstype,
            mountOptions,
            mountPoint,
            name,
            tags,
          } = values;

          const params = {
            cacheMode,
            cacheSetId,
            name,
            systemId: machine.system_id,
            ...(isDisk(storageDevice) && { blockId: storageDevice.id }),
            ...(fstype && { fstype }),
            ...(fstype && mountOptions && { mountOptions }),
            ...(fstype && mountPoint && { mountPoint }),
            ...(!isDisk(storageDevice) && { partitionId: storageDevice.id }),
            ...(tags.length > 0 && { tags }),
          };

          dispatch(machineActions.createBcache(params));
        }}
        saved={saved}
        saving={saving}
        submitLabel="Create bcache"
        validationSchema={CreateBcacheSchema}
      >
        <CreateBcacheFields
          cacheSets={cacheSets}
          storageDevice={storageDevice}
          systemId={systemId}
        />
      </FormikForm>
    );
  }
  return null;
};

export default CreateBcache;
