import { useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import TableDeleteConfirm from "app/base/components/TableDeleteConfirm";
import type { ImageValue } from "app/images/types";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import type { BootResource } from "app/store/bootresource/types";
import { BootResourceAction } from "app/store/bootresource/types";
import { splitResourceName } from "app/store/bootresource/utils";

type Props = {
  closeForm: () => void;
  resource: BootResource;
};

const DeleteImageConfirm = ({
  closeForm,
  resource,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const saving = useSelector(bootResourceSelectors.deletingImage);
  const previousSaving = usePrevious(saving);
  const eventErrors = useSelector(bootResourceSelectors.eventErrors);
  const { setFieldValue, values } =
    useFormikContext<{ images: ImageValue[] }>();
  const error = eventErrors.find(
    (error) => error.event === BootResourceAction.DELETE_IMAGE
  )?.error;
  const saved = previousSaving && !saving && !error;

  useEffect(() => {
    return () => {
      dispatch(bootResourceActions.cleanup());
    };
  }, [dispatch]);

  return (
    <TableDeleteConfirm
      deleted={saved}
      deleting={saving}
      errors={error}
      message="Are you sure you want to delete this image?"
      onClose={closeForm}
      onConfirm={() => {
        dispatch(bootResourceActions.cleanup());
        dispatch(bootResourceActions.deleteImage({ id: resource.id }));
      }}
      onSuccess={() => {
        const { os, release } = splitResourceName(resource.name);
        const newImages = values.images.filter(
          (image) =>
            !(
              image.os === os &&
              image.release === release &&
              image.arch === resource.arch
            )
        );
        setFieldValue("images", newImages);
      }}
      sidebar={false}
    />
  );
};

export default DeleteImageConfirm;
