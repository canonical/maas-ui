import { Spinner, Strip } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";

import type { RootState } from "app/store/root/types";
import type { Space } from "app/store/space/types";
import type { Subnet } from "app/store/subnet/types";
import {
  domain as domainActions,
  fabric as fabricActions,
  general as generalActions,
  messages as messagesActions,
  pod as podActions,
  resourcepool as resourcePoolActions,
  space as spaceActions,
  subnet as subnetActions,
  vlan as vlanActions,
  zone as zoneActions,
} from "app/base/actions";
import domainSelectors from "app/store/domain/selectors";
import fabricSelectors from "app/store/fabric/selectors";
import generalSelectors from "app/store/general/selectors";
import podSelectors from "app/store/pod/selectors";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import spaceSelectors from "app/store/space/selectors";
import subnetSelectors from "app/store/subnet/selectors";
import vlanSelectors from "app/store/vlan/selectors";
import zoneSelectors from "app/store/zone/selectors";
import ActionForm from "app/base/components/ActionForm";
import ComposeFormFields from "./ComposeFormFields";
import InterfacesTable from "./InterfacesTable";

export type InterfaceField = {
  id: number;
  ipAddress?: string;
  name: string;
  space: string;
  subnet: string;
};

export type ComposeFormValues = {
  architecture: string;
  cores: number;
  domain: string;
  hostname: string;
  interfaces: InterfaceField[];
  memory: number;
  pool: string;
  storage: string;
  zone: string;
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

type Props = { setSelectedAction: (action: string | null) => void };

const ComposeForm = ({ setSelectedAction }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { id } = useParams();
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
  const powerTypes = useSelector(generalSelectors.powerTypes.get);
  const powerTypesLoaded = useSelector(generalSelectors.powerTypes.loaded);
  const spaces = useSelector(spaceSelectors.all);
  const spacesLoaded = useSelector(spaceSelectors.loaded);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const [machineName, setMachineName] = useState("");

  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(fabricActions.fetch());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(podActions.get(id));
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
    };
    const defaults = {
      cores: powerType?.defaults?.cores || 1,
      memory: powerType?.defaults?.memory || 2048,
    };

    const ComposeFormSchema = Yup.object().shape({
      architecture: Yup.string(),
      cores: Yup.number("Cores must be a positive number.")
        .min(1, "Cores must be a positive number.")
        .max(available.cores, `Only ${available.cores} cores available.`),
      domain: Yup.string(),
      hostname: Yup.string(),
      interfaces: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required("ID is required"),
          ipAddress: Yup.string(),
          name: Yup.string().required("Name is required"),
          space: Yup.string(),
          subnet: Yup.string(),
        })
      ),
      memory: Yup.number("RAM must be a positive number.")
        .min(1024, "At least 1024 MiB is required.")
        .max(available.memory, `Only ${available.memory} MiB available.`),
      pool: Yup.string(),
      storage: Yup.string(),
      zone: Yup.string(),
    });

    return (
      <ActionForm
        actionName="compose"
        allowUnchanged
        cleanup={podActions.cleanup}
        clearSelectedAction={() => setSelectedAction(null)}
        errors={errors}
        initialValues={{
          architecture: pod.architectures[0] || "",
          cores: "",
          domain: `${domains[0]?.id}` || "",
          hostname: "",
          interfaces: [],
          memory: "",
          pool: `${pools[0]?.id}` || "",
          storage: "",
          zone: `${zones[0]?.id}` || "",
        }}
        modelName="machine"
        onSubmit={(values: ComposeFormValues) => {
          // Remove any errors before dispatching compose action.
          dispatch(podActions.cleanup());

          const params = {
            architecture: values.architecture,
            cores: values.cores,
            domain: Number(values.domain),
            hostname: values.hostname,
            id: Number(id),
            interfaces: createInterfaceConstraints(
              values.interfaces,
              spaces,
              subnets
            ),
            memory: values.memory,
            pool: Number(values.pool),
            storage: undefined, // TODO: https://github.com/canonical-web-and-design/MAAS-squad/issues/2043
            zone: Number(values.zone),
          };

          setMachineName(values.hostname || "Machine");
          dispatch(podActions.compose(params));
        }}
        onSuccess={() =>
          dispatch(
            messagesActions.add(
              `${machineName} composed successfully.`,
              "information"
            )
          )
        }
        processingCount={composingPods.length}
        validationSchema={ComposeFormSchema}
      >
        <ComposeFormFields
          architectures={pod.architectures}
          available={available}
          defaults={defaults}
        />
        <hr className="u-sv1" />
        <InterfacesTable />
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
