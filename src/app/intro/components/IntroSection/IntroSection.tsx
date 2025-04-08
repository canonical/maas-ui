import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useNavigate } from "react-router-dom";

import PageContent from "@/app/base/components/PageContent";
import type { Props as PageContentProps } from "@/app/base/components/PageContent/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import type { APIError } from "@/app/base/types";
import { useExitURL } from "@/app/intro/hooks";
import { formatErrors } from "@/app/utils";

type Props = Partial<PageContentProps> & {
  children: ReactNode;
  complete?: boolean;
  errors?: APIError;
  loading?: boolean;
  shouldExitIntro?: boolean;
  titleLink?: ReactNode;
  windowTitle?: string;
};

const IntroSection = ({
  children,
  complete,
  errors,
  loading,
  shouldExitIntro,
  titleLink,
  windowTitle,
  sidePanelContent = null,
  sidePanelTitle = null,
  ...props
}: Props): ReactElement => {
  const navigate = useNavigate();
  const errorMessage = formatErrors(errors);
  const exitURL = useExitURL();

  useWindowTitle(windowTitle ? `Welcome - ${windowTitle}` : "Welcome");

  useEffect(() => {
    if (shouldExitIntro) {
      navigate(exitURL, { replace: true });
    }
  }, [navigate, exitURL, shouldExitIntro]);

  return (
    <PageContent
      sidePanelContent={sidePanelContent}
      sidePanelTitle={sidePanelTitle}
      {...props}
    >
      {errorMessage && (
        <Notification severity="negative" title="Error:">
          {errorMessage}
        </Notification>
      )}
      {loading ? <Spinner text="Loading..." /> : children}
    </PageContent>
  );
};

export default IntroSection;
