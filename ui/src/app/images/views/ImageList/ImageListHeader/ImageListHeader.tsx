import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "app/base/components/SectionHeader";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";

const ImageListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const polling = useSelector(bootResourceSelectors.polling);

  useEffect(() => {
    dispatch(bootResourceActions.poll());
  }, [dispatch]);

  return <SectionHeader loading={polling} title="Images" />;
};

export default ImageListHeader;
