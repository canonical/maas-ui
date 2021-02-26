import { Input } from "@canonical/react-components";

import type { SetKvmType } from "../AddKVM";

import { PodType } from "app/store/pod/types";

type Props = {
  kvmType: PodType;
  setKvmType: SetKvmType;
};

export const KvmTypeSelect = ({ kvmType, setKvmType }: Props): JSX.Element => {
  return (
    <>
      <p>KVM host type</p>
      <ul className="p-inline-list">
        <li className="p-inline-list__item u-display-inline-block">
          <Input
            checked={kvmType === PodType.VIRSH}
            id="add-virsh"
            label="virsh"
            onChange={() => setKvmType(PodType.VIRSH)}
            type="radio"
          />
        </li>
        <li className="p-inline-list__item u-display-inline-block u-nudge-right">
          <Input
            checked={kvmType === PodType.LXD}
            id="add-lxd"
            label="LXD"
            onChange={() => setKvmType(PodType.LXD)}
            type="radio"
          />
        </li>
      </ul>
      <a
        className="p-link--external"
        href="https://maas.io/docs/intro-to-vm-hosting"
      >
        More about KVM hosts in MAAS&hellip;
      </a>
    </>
  );
};

export default KvmTypeSelect;
