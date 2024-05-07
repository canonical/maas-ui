import { useFormikContext } from "formik";

import PrefixedInput from "../PrefixedInput";
import type { PrefixedInputProps } from "../PrefixedInput/PrefixedInput";

import type { Subnet } from "@/app/store/subnet/types";
import {
  getImmutableAndEditableOctets,
  getIpRangeFromCidr,
} from "@/app/utils/subnetIpRange";

type Props = Omit<
  PrefixedInputProps,
  "maxLength" | "placeholder" | "name" | "immutableText"
> & {
  cidr: Subnet["cidr"];
  name: string;
};

const PrefixedIpInput = ({ cidr, name, ...props }: Props) => {
  const [startIp, endIp] = getIpRangeFromCidr(cidr);
  const [immutable, editable] = getImmutableAndEditableOctets(startIp, endIp);

  const formikProps = useFormikContext();

  const getMaxLength = () => {
    const immutableOctetsLength = immutable.split(".").length;

    if (immutableOctetsLength === 3) {
      return 3; // 3 digits, no dots
    } else if (immutableOctetsLength === 2) {
      return 7; // 6 digits, 1 dot
    } else if (immutableOctetsLength === 1) {
      return 11; // 9 digits, 2 dots
    } else {
      return 15; // 12 digits, 3 dots
    }
  };

  return (
    <PrefixedInput
      help={
        <>
          The available range in this subnet is{" "}
          <code>
            {immutable}.{editable}
          </code>
        </>
      }
      immutableText={`${immutable}.`}
      maxLength={getMaxLength()}
      name={name}
      onPaste={(e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const octets = pastedText.split(".");
        const trimmed = octets.slice(0 - editable.split(".").length);
        formikProps.setFieldValue(name, trimmed.join("."));
      }}
      placeholder={editable}
      {...props}
    />
  );
};

export default PrefixedIpInput;
