import type { ReactNode } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { Redirect } from "react-router";

import Section from "app/base/components/Section";
import type { Props as SectionProps } from "app/base/components/Section/Section";
import { useWindowTitle } from "app/base/hooks";
import type { APIError } from "app/base/types";
import { useExitURL } from "app/intro/hooks";
import { formatErrors } from "app/utils";

type Props = {
  children: ReactNode;
  complete?: boolean;
  errors?: APIError;
  loading?: boolean;
  shouldExitIntro?: boolean;
  titleLink?: ReactNode;
  windowTitle?: string;
} & SectionProps;

const IntroSection = ({
  children,
  complete,
  errors,
  loading,
  shouldExitIntro,
  titleLink,
  windowTitle,
  ...props
}: Props): JSX.Element => {
  const errorMessage = formatErrors(errors);
  const exitURL = useExitURL();

  useWindowTitle(windowTitle ? `Welcome - ${windowTitle}` : "Welcome");

  if (shouldExitIntro) {
    return <Redirect to={exitURL} />;
  }

  return (
    <Section {...props}>
      {errorMessage && (
        <Notification severity="negative" title="Error:">
          {errorMessage}
        </Notification>
      )}
      {loading ? <Spinner text="Loading..." /> : children}
    </Section>
  );
};

export default IntroSection;
