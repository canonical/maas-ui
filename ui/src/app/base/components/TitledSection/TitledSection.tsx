import type { ReactNode } from "react";

import { Strip } from "@canonical/react-components";
import type { PropsWithSpread, StripProps } from "@canonical/react-components";

import { useId } from "app/base/hooks/base";

type Props = PropsWithSpread<
  {
    children?: ReactNode;
    title: ReactNode;
  },
  StripProps
>;

const TitledSection = ({ children, title, ...props }: Props): JSX.Element => {
  const id = useId();
  return (
    <Strip
      shallow
      element="section"
      aria-labelledby={id}
      data-testid="titled-section"
      {...props}
    >
      <h2 id={id} className="p-heading--4">
        {title}
      </h2>
      {children}
    </Strip>
  );
};

export default TitledSection;
