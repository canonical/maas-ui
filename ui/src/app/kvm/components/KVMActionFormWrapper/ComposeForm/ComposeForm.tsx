import { useCallback, useEffect, useState } from "react";

import { notificationTypes, Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";

import ComposeFormFields from "./ComposeFormFields";
import InterfacesTable from "./InterfacesTable";
import StorageTable from "./StorageTable";

import ActionForm from "app/base/components/ActionForm";
import type { RouteParams } from "app/base/types";
import { RANGE_REGEX } from "app/base/validation";
import type { SetSelectedAction } from "app/kvm/views/KVMDetails";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import { actions as generalActions } from "app/store/general";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import { actions as messageActions } from "app/store/message";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type { RootState } from "app/store/root/types";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space } from "app/store/space/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { arrayFromRangesString, formatBytes } from "app/utils";

export type Disk = {
  location: string;
  size: number; // GB
  tags: string[];
};

export type DiskField = Disk & { id: number };

export type InterfaceField = {
  id: number;
  ipAddress?: string;
  name: string;
  space: string;
  subnet: string;
};

export type ComposeFormValues = {
  architecture: string;
  bootDisk: number;
  cores: number;
  disks: DiskField[];
  domain: string;
  hostname: string;
  hugepagesBacked: boolean;
  interfaces: InterfaceField[];
  memory: number;
  pinnedCores: string;
  pool: string;
  zone: string;
};

export type ComposeFormDefaults = {
  cores: number;
  disk: Disk;
  memory: number;
};

/**
 * Create interface constraints in the form <interface-name>:<key>=<value>[,<key>=<value>];....
 * e.g. "eth0:ip=192.168.0.0,subnet_cidr=192.168.0.0/24"
 * @param {InterfaceField[]} interfaces - The interfaces from which to create the constraints.
 * @param {Space[]} spaces - The spaces in state.
 * @param {Subnet[]} subnets - The subnets in state.
 * @returns {string} Interface constraints string.
 */
export const createInterfaceConstraints = (
  interfaces: InterfaceField[],
  spaces: Space[],
  subnets: Subnet[]
): string => {
  return interfaces
    .map((iface) => {
      const constraints: string[] = [];
      if (iface.ipAddress !== "") {
        constraints.push(`ip=${iface.ipAddress}`);
      }
      if (iface.space !== "") {
        const space = spaces.find(
          (space) => space.id === parseInt(iface.space)
        );
        !!space && constraints.push(`space=${space.name}`);
      }
      if (iface.subnet !== "") {
        const subnet = subnets.find(
          (subnet) => subnet.id === parseInt(iface.subnet)
        );
        !!subnet && constraints.push(`subnet_cidr=${subnet?.cidr}`);
      }
      if (constraints.length >= 1) {
        return `${iface.name}:${constraints.join(",")}`;
      }
      return "";
    })
    .filter(Boolean)
    .join(";");
};

/**
 * Create storage constraints in the form "<id>:<sizeGB>(<location>,<tag1>,<tag2>,...)"
 * e.g. "0:8(my-pool, tag1, tag2)"
 * @param {DiskField[]} disks - The disks from which to create the constraints.
 * @param {number} bootDiskID - The form id of the boot disk.
 * @returns {string} Storage constraints string.
 */
export const createStorageConstraints = (
  disks: DiskField[],
  bootDiskID: number
): string => {
  if (!disks || disks.length === 0) {
    return "";
  }

  // Sort disks so boot disk is first.
  const sortedDisks = bootDiskID
    ? [
        disks.find((disk) => disk.id === bootDiskID),
        ...disks.filter((disk) => disk.id !== bootDiskID),
      ]
    : disks;

  return sortedDisks
    .map((disk) => {
      return `${disk.id}:${disk.size}(${[disk.location, ...disk.tags].join(
        ","
      )})`;
    })
    .join(",");
};

/**
 * Get the default location of the first disk when form is mounted.
 * @param pod - The pod in which to determine default disk location.
 * @returns default disk location.
 */
export const getDefaultPoolLocation = (pod: Pod): string => {
  const defaultPool = pod.storage_pools?.find(
    (pool) => pool.id === pod.default_storage_pool
  );
  return defaultPool?.name || "";
};

type Props = {
  setSelectedAction: SetSelectedAction;
};

const ComposeForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const errors = useSelector(podSelectors.errors);
  const composingPods = useSelector(podSelectors.composing);
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const pools = useSelector(resourcePoolSelectors.all);
  const poolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);
  const spaces = useSelector(spaceSelectors.all);
  const spacesLoaded = useSelector(spaceSelectors.loaded);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const [machineName, setMachineName] = useState("");
  const cleanup = useCallback(() => podActions.cleanup(), []);

  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(fabricActions.fetch());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(podActions.get(Number(id)));
    dispatch(resourcePoolActions.fetch());
    dispatch(spaceActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(vlanActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch, id]);

  const loaded =
    domainsLoaded &&
    fabricsLoaded &&
    poolsLoaded &&
    powerTypesLoaded &&
    spacesLoaded &&
    subnetsLoaded &&
    vlansLoaded &&
    zonesLoaded;

  if (!!pod && loaded) {
    const powerType = powerTypes.find((type) => type.name === pod.type);
    const available = {
      cores: pod.total.cores * pod.cpu_over_commit_ratio - pod.used.cores,
      memory: pod.total.memory * pod.memory_over_commit_ratio - pod.used.memory, // MiB
      storage:
        pod.storage_pools?.reduce((available, pool) => {
          available[pool.name] = formatBytes(pool.available, "B", {
            convertTo: "GB",
          }).value;
          return available;
        }, {}) || [],
    };
    const defaultPoolLocation = getDefaultPoolLocation(pod);
    const defaults = {
      cores: powerType?.defaults?.cores || 1,
      disk: {
        location: defaultPoolLocation,
        size: powerType?.defaults?.storage || 8,
        tags: [],
      },
      memory: powerType?.defaults?.memory || 2048,
    };

    const ComposeFormSchema = Yup.object().shape({
      architecture: Yup.string(),
      cores: Yup.number()
        .positive("Cores must be a positive number.")
        .min(1, "Cores must be a positive number.")
        .max(available.cores, `Only ${available.cores} cores available.`),
      disks: Yup.array()
        .of(
          Yup.object()
            .shape({
              id: Yup.number().required("ID is required"),
              location: Yup.string().required("Location is required"),
              size: Yup.number()
                .min(1, "At least 1GB required")
                .required("Size is required"),
              tags: Yup.array().of(Yup.string()),
            })
            .test("enoughSpace", "Not enough space", function test() {
              // This test validates whether there is enough space in the storage
              // pools for all disk requests. A functional expression is used
              // in order to use Yup's "this" context.
              // https://github.com/jquense/yup#mixedtestname-string-message-string--function-test-function-schema
              const disks: DiskField[] = this.parent || [];

              let error: Yup.ValidationError;
              disks.forEach((disk, i) => {
                const poolName = disk.location;
                const disksInPool = disks.filter(
                  (d) => d.location === poolName
                );
                const poolRequestTotal = disksInPool.reduce(
                  (total, d) => total + d.size,
                  0
                );
                const availableGB = available.storage[poolName];

                if (poolRequestTotal > availableGB) {
                  error = this.createError({
                    message: `Only ${availableGB}GB available in ${poolName}.`,
                    path: `disks[${i}].size`,
                  });
                }
              });
              return error || true;
            })
        )
        .min(1, "At least one disk is required"),
      domain: Yup.string(),
      hostname: Yup.string(),
      hugepagesBacked: Yup.boolean(),
      interfaces: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required("ID is required"),
          ipAddress: Yup.string(),
          name: Yup.string().required("Name is required"),
          space: Yup.string(),
          subnet: Yup.string(),
        })
      ),
      memory: Yup.number()
        .positive("RAM must be a positive number.")
        .min(1024, "At least 1024 MiB is required.")
        .max(available.memory, `Only ${available.memory} MiB available.`),
      pinnedCores: Yup.string().matches(
        RANGE_REGEX,
        'Cores string must follow format e.g "1,2,4-12"'
      ),
      pool: Yup.string(),
      zone: Yup.string(),
    });

    return (
      <ActionForm
        actionName="compose"
        allowUnchanged
        cleanup={cleanup}
        clearSelectedAction={() => setSelectedAction(null)}
        errors={errors}
        initialValues={{
          architecture: pod.architectures[0] || "",
          bootDisk: 1,
          cores: "",
          disks: defaultPoolLocation ? [{ ...defaults.disk, id: 1 }] : [],
          domain: `${domains[0]?.id}` || "",
          hostname: "",
          hugepagesBacked: false,
          interfaces: [],
          memory: "",
          pinnedCores: "",
          pool: `${pools[0]?.id}` || "",
          zone: `${zones[0]?.id}` || "",
        }}
        modelName="machine"
        onSaveAnalytics={{
          action: "Submit",
          category: "KVM details action form",
          label: "Compose",
        }}
        onSubmit={(values: ComposeFormValues) => {
          // Remove any errors before dispatching compose action.
          dispatch(cleanup());
          const pinnedCoresArray = arrayFromRangesString(values.pinnedCores);

          const params = {
            architecture: values.architecture,
            domain: Number(values.domain),
            hostname: values.hostname,
            hugepages_backed: values.hugepagesBacked,
            id: Number(id),
            interfaces: createInterfaceConstraints(
              values.interfaces,
              spaces,
              subnets
            ),
            memory: values.memory,
            pool: Number(values.pool),
            storage: createStorageConstraints(values.disks, values.bootDisk),
            zone: Number(values.zone),
            ...(values.cores && { cores: values.cores }),
            ...(pinnedCoresArray && { pinned_cores: pinnedCoresArray }),
          };

          setMachineName(values.hostname || "Machine");
          dispatch(podActions.compose(params));
        }}
        onSuccess={() =>
          dispatch(
            messageActions.add(
              `${machineName} composed successfully.`,
              notificationTypes.INFORMATION
            )
          )
        }
        processingCount={composingPods.length}
        validationSchema={ComposeFormSchema}
      >
        <Strip bordered className="u-no-padding--top" shallow>
          <ComposeFormFields
            architectures={pod.architectures}
            available={available}
            defaults={defaults}
          />
        </Strip>
        <Strip bordered shallow>
          <InterfacesTable />
        </Strip>
        <Strip shallow>
          <StorageTable defaultDisk={defaults.disk} />
        </Strip>
      </ActionForm>
    );
  }
  return (
    <Strip>
      <Spinner text="Loading..." />
    </Strip>
  );
};

export default ComposeForm;
