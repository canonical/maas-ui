import { useEffect, useState } from "react";

import { Input } from "@canonical/react-components";
import type { InputProps } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { Subnet } from "@/app/store/subnet/types";
import {
  getImmutableAndEditableOctets,
  getIpRangeFromCidr,
} from "@/app/utils/subnetIpRange";

type Props = Omit<InputProps, "maxLength" | "placeholder" | "type" | "name"> & {
  cidr: Subnet["cidr"];
  name: string;
};

const LimitedIpInput = ({ cidr, name, ...props }: Props) => {
  const [startIp, endIp] = getIpRangeFromCidr(cidr);
  const [immutable, editable] = getImmutableAndEditableOctets(startIp, endIp);
  const [immutableWidth, setImmutableWidth] = useState("inherit");
  const [inputWrapper, setInputWrapper] = useState<Element | null>(null);
  const [inputElement, setInputElement] = useState<Element | null>(null);

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

  useEffect(() => {
    setInputWrapper(document.querySelector(".limited-ip-input__input-wrapper"));
    setInputElement(document.querySelector(".limited-ip-input__input"));
    if (inputWrapper) {
      const width = window.getComputedStyle(inputWrapper, ":before").width;
      setImmutableWidth(width);
      // CSS variable "--immutable" is the content of the :before element, which shows the immutable octets
      inputWrapper.setAttribute("style", `--immutable: '${immutable}.'`);
    } else {
      // Element won't be present until first render is completed, so we need to set it again.
      setInputWrapper(
        document.querySelector(".limited-ip-input__input-wrapper")
      );
    }

    if (inputElement) {
      // Adjust the left padding of the input to be the same width as the immutable octets.
      // This displays the user input and the unchangeable text together as one IP address.
      inputElement.setAttribute("style", `padding-left: ${immutableWidth}`);
    } else {
      setInputElement(document.querySelector(".limited-ip-input__input"));
    }
  }, [immutable, inputElement, inputWrapper, immutableWidth]);

  return (
    <div className="limited-ip-input">
      <div className="u-flex">
        <div className="u-position--relative u-flex--grow">
          <Input
            className="limited-ip-input__input"
            help={
              <>
                The available range in this subnet is{" "}
                <code>
                  {immutable}.{editable}
                </code>
              </>
            }
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
            type="text"
            wrapperClassName="limited-ip-input__input-wrapper"
            {...props}
          />
        </div>
      </div>
    </div>
  );
};

export default LimitedIpInput;
