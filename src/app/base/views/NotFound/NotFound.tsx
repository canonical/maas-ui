import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";

type Props = {
  includeSection?: boolean;
};

export enum Label {
  Title = "Error: Page not found.",
}

const NotFound = ({ includeSection = false }: Props): JSX.Element => {
  useWindowTitle(Label.Title);
  const message = `The requested URL ${window.location.pathname} was not found on this server.`;
  if (includeSection) {
    return (
      <Section header={Label.Title} aria-label={Label.Title}>
        <h2 className="p-heading--4">{message}</h2>
      </Section>
    );
  }
  return (
    <div aria-label={Label.Title}>
      <h2 className="p-heading--4">{Label.Title}</h2>
      <p>{message}</p>
    </div>
  );
};

export default NotFound;
