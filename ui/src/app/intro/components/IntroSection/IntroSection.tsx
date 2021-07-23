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
  closeIntro?: boolean;
  complete?: boolean;
  errors?: APIError;
  loading?: boolean;
  titleLink?: ReactNode;
  windowTitle?: string;
} & SectionProps;

const IntroSection = ({
  children,
  closeIntro,
  complete,
  errors,
  loading,
  titleLink,
  windowTitle,
  ...props
}: Props): JSX.Element => {
  const errorMessage = formatErrors(errors);
  const exitURL = useExitURL();

  useWindowTitle(windowTitle ? `Welcome ${windowTitle}` : "Welcome");

  if (loading) {
    return <Spinner />;
  }

  if (closeIntro) {
    return <Redirect to={exitURL} />;
  }

  return (
    <Section {...props}>
      {errorMessage && (
        <Notification type="negative" status="Error:">
          {errorMessage}
        </Notification>
      )}
      {children}
    </Section>
  );
};

export default IntroSection;
