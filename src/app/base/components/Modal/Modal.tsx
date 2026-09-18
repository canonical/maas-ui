import type { ReactElement } from "react";

import { ContentSection, Placeholder } from "@canonical/maas-react-components";
import { Modal as LibModal } from "@canonical/react-components";

import { useModal } from "@/app/base/modal-context";

const Modal = (): ReactElement | null => {
  const { isOpen, component: Component, closeModal, title, props } = useModal();

  if (!isOpen || !Component) {
    return null;
  }

  return (
    <LibModal close={closeModal} closeOnOutsideClick title={title}>
      <Component {...props} />
    </LibModal>
  );
};

const ModalSkeleton = (): ReactElement => (
  <ContentSection>
    <ContentSection aria-hidden="true" className="modal-skeleton">
      <ContentSection.Content>
        <div className="layout-skeleton__form-description">
          <Placeholder height="1.5rem" variant="block" width="100%" />
          <Placeholder height="1.5rem" variant="block" width="70%" />
        </div>
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            className="layout-skeleton__form-field"
            key={`modal-skeleton-field-${index}`}
          >
            <Placeholder height="1.5rem" variant="block" width="14ch" />
            <Placeholder height="2.5rem" variant="block" width="100%" />
          </div>
        ))}
      </ContentSection.Content>
      <ContentSection.Footer>
        <Placeholder height="2rem" variant="block" width="8ch" />
        <Placeholder height="2rem" variant="block" width="10ch" />
      </ContentSection.Footer>
    </ContentSection>
  </ContentSection>
);

Modal.Skeleton = ModalSkeleton;

export default Modal;
