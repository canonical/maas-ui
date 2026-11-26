import type { HTMLAttributes, ReactElement } from "react";

import { InlineCode } from "@canonical/react-ds-global";
import classNames from "classnames";

import CopyButton from "@/app/base/components/CopyButton";

type Appearance = "linux-prompt" | "numbered";

type Props = Omit<HTMLAttributes<HTMLPreElement>, "children"> & {
  /** Prompt or line-number treatment. Plain blocks omit this. */
  appearance?: Appearance;
  /** The code to display. Numbered blocks split this on newlines. */
  children: string;
  /** Show a button that copies `children`. */
  copyable?: boolean;
};

const CodeBlock = ({
  appearance,
  children,
  className,
  copyable = false,
  ...preProps
}: Props): ReactElement => {
  const code =
    appearance === "numbered"
      ? children.split("\n").map((line, index) => (
          <span className="p-code-block__line" key={index}>
            {line}
          </span>
        ))
      : children;

  const block = (
    <pre
      className={classNames(
        "p-code-block",
        appearance === "linux-prompt" && "p-code-block--linux-prompt",
        appearance === "numbered" && "p-code-block--numbered",
        className
      )}
      {...preProps}
    >
      <InlineCode>{code}</InlineCode>
    </pre>
  );

  if (!copyable) {
    return block;
  }

  return (
    <div className="p-code-block-copyable">
      {block}
      <CopyButton value={children} />
    </div>
  );
};

export default CodeBlock;
