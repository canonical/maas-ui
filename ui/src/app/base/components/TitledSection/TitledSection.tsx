import type { ReactNode } from "react";

import { Strip } from "@canonical/react-components";
import type { PropsWithSpread, StripProps } from "@canonical/react-components";

import { useId } from "app/base/hooks/base";

type Props = PropsWithSpread<
  {
    buttons?: ReactNode;
    children?: ReactNode;
    title: ReactNode;
  },
  StripProps
>;

const TitledSection = ({
  buttons,
  children,
  title,
  ...props
}: Props): JSX.Element => {
  const id = useId();
  const titleElement = (
    <h2 id={id} className="p-heading--4">
      {title}
    </h2>
  );
  return (
    <Strip
      shallow
      element="section"
      aria-labelledby={id}
      data-testid="titled-section"
      {...props}
    >
      {buttons ? (
        <div className="u-flex--between">
          {titleElement}
          <div>{buttons}</div>
        </div>
      ) : (
        titleElement
      )}
      {children}
    </Strip>
  );
};

export default TitledSection;
