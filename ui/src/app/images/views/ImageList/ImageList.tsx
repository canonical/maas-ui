import { useEffect } from "react";

import { useDispatch } from "react-redux";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import { actions as bootResourceActions } from "app/store/bootresource";

const ImagesList = (): JSX.Element => {
  const dispatch = useDispatch();
  useWindowTitle("Images");

  useEffect(() => {
    dispatch(bootResourceActions.poll());
  }, [dispatch]);

  return (
    <Section header="Images" headerClassName="u-no-padding--bottom">
      Images
    </Section>
  );
};

export default ImagesList;
