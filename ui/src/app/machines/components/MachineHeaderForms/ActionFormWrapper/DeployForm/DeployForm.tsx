import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import DeployFormFields from "./DeployFormFields";

import ActionForm from "app/base/components/ActionForm";
import { useSendAnalytics } from "app/base/hooks";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as generalActions } from "app/store/general";
import {
  defaultMinHweKernel as defaultMinHweKernelSelectors,
  osInfo as osInfoSelectors,
} from "app/store/general/selectors";
import { actions as machineActions } from "app/store/machine";
import type { MachineEventErrors } from "app/store/machine/types";
import { PodType } from "app/store/pod/constants";
import { NodeActions } from "app/store/types/node";

const DeploySchema = Yup.object().shape({
  oSystem: Yup.string().required("OS is required"),
  release: Yup.string().required("Release is required"),
  kernel: Yup.string(),
  includeUserData: Yup.boolean(),
  vmHostType: Yup.string().oneOf([PodType.LXD, PodType.VIRSH, ""]),
});

export type DeployFormValues = {
  includeUserData: boolean;
  kernel: string;
  oSystem: string;
  release: string;
  userData?: string;
  vmHostType: string;
};

type Props = MachineActionFormProps;

export const DeployForm = ({
  actionDisabled,
  clearHeaderContent,
  errors,
  machines,
  processingCount,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const defaultMinHweKernel = useSelector(defaultMinHweKernelSelectors.get);
  const { default_osystem, default_release, osystems, releases } =
    useSelector(osInfoSelectors.get) || {};
  const defaultMinHweKernelLoaded = useSelector(
    defaultMinHweKernelSelectors.loaded
  );
  const osInfoLoaded = useSelector(osInfoSelectors.loaded);
  const sendAnalytics = useSendAnalytics();

  useEffect(() => {
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  // Default OS+release is set in the backend even if the image has not yet been
  // downloaded. The following conditionals check whether the OS+release actually
  // exist in state before setting initial values in the form.
  let initialOS = "";
  let initialRelease = "";
  if (osystems?.some((osChoice) => osChoice[0] === default_osystem)) {
    initialOS = default_osystem || "";
  }
  if (
    releases?.some((releaseChoice) => {
      const split = releaseChoice[0].split("/");
      return split.length > 1 && split[1] === default_release;
    })
  ) {
    initialRelease = default_release || "";
  }

  return (
    <ActionForm<DeployFormValues, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={NodeActions.DEPLOY}
      allowUnchanged={osystems?.length !== 0 && releases?.length !== 0}
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{
        oSystem: initialOS,
        release: initialRelease,
        kernel: defaultMinHweKernel || "",
        includeUserData: false,
        userData: "",
        vmHostType: "",
      }}
      loaded={defaultMinHweKernelLoaded && osInfoLoaded}
      modelName="machine"
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Deploy",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        const hasUserData =
          values.includeUserData && values.userData && values.userData !== "";
        const extra = {
          osystem: values.oSystem,
          distro_series: values.release,
          hwe_kernel: values.kernel,
          ...(values.vmHostType === PodType.LXD && { register_vmhost: true }),
          ...(values.vmHostType === PodType.VIRSH && { install_kvm: true }),
          ...(hasUserData && { user_data: values.userData }),
        };
        if (hasUserData) {
          sendAnalytics(
            "Machine list deploy form",
            "Has cloud-init config",
            "Cloud-init user data"
          );
        }
        machines.forEach((machine) => {
          dispatch(
            machineActions.deploy({ systemId: machine.system_id, extra })
          );
        });
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={machines.length}
      validationSchema={DeploySchema}
    >
      <DeployFormFields />
    </ActionForm>
  );
};

export default DeployForm;
