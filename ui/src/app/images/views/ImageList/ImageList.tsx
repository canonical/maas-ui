import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";

const ImagesList = (): JSX.Element => {
  useWindowTitle("Images");

  return (
    <Section header="Images" headerClassName="u-no-padding--bottom">
      Images
    </Section>
  );
};

export default ImagesList;
