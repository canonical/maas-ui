import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";

type Props = {
  includeSection?: boolean;
};

const NotFound = ({ includeSection = false }: Props): JSX.Element => {
  const title = "Error: Page not found.";
  useWindowTitle(title);
  const message = `The requested URL ${window.location.pathname} was not found on this server.`;
  if (includeSection) {
    return (
      <Section header={title}>
        <h2 className="p-heading--4">{message}</h2>
      </Section>
    );
  }
  return (
    <>
      <h2 className="p-heading--4">{title}</h2>
      <p>{message}</p>
    </>
  );
};

export default NotFound;
