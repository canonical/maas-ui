import classNames from "classnames";

import PodMeter from "app/kvm/components/PodMeter";

export type Props = {
  cores: {
    allocated: number;
    free: number;
  };
  dynamicLayout?: boolean;
};

const CoreResources = ({ cores, dynamicLayout }: Props): JSX.Element => {
  return (
    <div
      className={classNames("core-resources", {
        "core-resources--dynamic-layout": dynamicLayout,
      })}
    >
      <h4 className="core-resources__header p-heading--small u-sv1">
        CPU cores
      </h4>
      <div className="core-resources__meter">
        <PodMeter allocated={cores.allocated} free={cores.free} segmented />
      </div>
    </div>
  );
};

export default CoreResources;
