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
      return 3;
    } else if (immutableOctetsLength === 2) {
      return 7;
    } else if (immutableOctetsLength === 1) {
      return 11;
    } else {
      return 15;
    }
  };

  useEffect(() => {
    setInputWrapper(document.querySelector(".limited-ip-input__input-wrapper"));
    setInputElement(document.querySelector(".limited-ip-input__input"));
    if (inputWrapper) {
      const width = window.getComputedStyle(inputWrapper, ":before").width;
      setImmutableWidth(width);
      inputWrapper.setAttribute("style", `--immutable: '${immutable}.'`);
    } else {
      setInputWrapper(
        document.querySelector(".limited-ip-input__input-wrapper")
      );
    }

    if (inputElement) {
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
