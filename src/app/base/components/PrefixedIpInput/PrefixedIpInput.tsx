import type { ClipboardEvent } from "react";

import { useFormikContext } from "formik";
import { isIPv4 } from "is-ip";

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
  const [networkAddress] = cidr.split("/");
  const ipv6Prefix = networkAddress.substring(
    0,
    networkAddress.lastIndexOf(":")
  );
  const subnetIsIpv4 = isIPv4(networkAddress);

  const [startIp, endIp] = getIpRangeFromCidr(cidr);
  const [immutable, editable] = getImmutableAndEditableOctets(startIp, endIp);

  const formikProps = useFormikContext();

  const getPlaceholderText = () => {
    if (subnetIsIpv4) {
      return editable;
    } else {
      // 7 is the maximum number of colons in an IPv6 address
      const placeholderColons = 7 - (ipv6Prefix.match(/:/g) || []).length;
      return `${"0000:".repeat(placeholderColons)}0000`;
    }
  };

  const getMaxLength = () => {
    if (subnetIsIpv4) {
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
    } else {
      return getPlaceholderText().length;
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (subnetIsIpv4) {
      const octets = pastedText.split(".");
      const trimmed = octets.slice(0 - editable.split(".").length);
      formikProps.setFieldValue(name, trimmed.join("."));
    } else {
      const interfaceId = pastedText.replace(ipv6Prefix, "");
      formikProps.setFieldValue(name, interfaceId);
    }
  };

  return (
    <PrefixedInput
      help={
        subnetIsIpv4 ? (
          <>
            The available range in this subnet is{" "}
            <code>
              {immutable}.{editable}
            </code>
          </>
        ) : null
      }
      immutableText={subnetIsIpv4 ? `${immutable}.` : ipv6Prefix}
      maxLength={getMaxLength()}
      name={name}
      onPaste={handlePaste}
      placeholder={getPlaceholderText()}
      {...props}
    />
  );
};

export default PrefixedIpInput;
