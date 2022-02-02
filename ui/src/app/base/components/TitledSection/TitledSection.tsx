import React from "react";
import type { ReactNode } from "react";

import { Strip } from "@canonical/react-components";
import type {
  PropsWithSpread,
  StripProps,
  Headings,
} from "@canonical/react-components";

import VisuallyHidden from "../VisuallyHidden";

import { useId } from "app/base/hooks/base";

type Props = PropsWithSpread<
  {
    buttons?: ReactNode;
    children?: ReactNode;
    headingElement?: Headings;
    headingClassName?: string;
    headingVisuallyHidden?: boolean;
    title: ReactNode;
  },
  StripProps
>;

type HeadingProps = {
  element: Headings;
  className?: string;
  id: string;
  children: ReactNode;
};

const Heading = ({ element, id, className, children }: HeadingProps) =>
  React.createElement(
    element,
    {
      id,
      className,
    },
    children
  );

const TitledSection = ({
  buttons,
  children,
  title,
  headingElement = "h2",
  headingClassName = "p-heading--4",
  headingVisuallyHidden, // hide the title visually (visibly hidden but still accessible)
  ...props
}: Props): JSX.Element => {
  const id = useId();
  const heading = (
    <Heading element={headingElement} id={id} className={headingClassName}>
      {title}
    </Heading>
  );
  const titleElement = headingVisuallyHidden ? (
    <VisuallyHidden>{heading}</VisuallyHidden>
  ) : (
    heading
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
