import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import type { InputProps } from "@canonical/react-components";
import { Input } from "@canonical/react-components";
import classNames from "classnames";

export type PrefixedInputProps = Omit<InputProps, "type"> & {
  immutableText: string;
};

// TODO: Upstream to maas-react-components https://warthogs.atlassian.net/browse/MAASENG-3113
const PrefixedInput = ({ immutableText, ...props }: PrefixedInputProps) => {
  const prefixedInputRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const inputWrapper = prefixedInputRef.current?.firstElementChild;
    if (inputWrapper) {
      if (props.label) {
        // CSS variable "--immutable" is the content of the :before element, which shows the immutable octets
        // "--top" is the `top` property of the :before element, which is adjusted if there is a label to prevent overlap
        inputWrapper.setAttribute(
          "style",
          `--top: 2.5rem; --immutable: "${immutableText}"`
        );
      } else {
        inputWrapper.setAttribute("style", `--immutable: "${immutableText}"`);
      }

      const width = window.getComputedStyle(inputWrapper, ":before").width;

      // Adjust the left padding of the input to be the same width as the immutable octets.
      // This displays the user input and the unchangeable text together as one IP address.
      inputWrapper
        .querySelector("input")
        ?.setAttribute("style", `padding-left: ${width}`);
    }
  }, [prefixedInputRef, immutableText, props.label]);

  return (
    <div className="prefixed-input" ref={prefixedInputRef}>
      <Input
        className={classNames("prefixed-input__input", props.className)}
        type="text"
        wrapperClassName={classNames(
          "prefixed-input__wrapper",
          props.wrapperClassName
        )}
        {...props}
      />
    </div>
  );
};

export default PrefixedInput;
