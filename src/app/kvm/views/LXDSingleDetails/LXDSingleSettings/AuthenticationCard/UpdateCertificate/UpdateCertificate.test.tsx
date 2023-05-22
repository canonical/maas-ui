```
import { renderWithBrowserRouter, screen } from 'testing/utils';
import configureStore from 'redux-mock-store';
import UpdateCertificate from './UpdateCertificate';
import { actions as generalActions } from 'app/store/general';
import { actions as podActions } from 'app/store/pod';
import {
  generalState as generalStateFactory,
  generatedCertificate as generatedCertificateFactory,
  generatedCertificateState as generatedCertificateStateFactory,
  podDetails as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from 'testing/factories';
import { submitFormikForm } from 'testing/utils';

const mockStore = configureStore();
jest.mock('react-router-dom-v5-compat', () => ({
  CompatRouter: (props: any) => props.children,
}));

describe('UpdateCertificate', () => {
  let state: RootState;
  let pod: PodDetails;

  beforeEach(() => {
    pod = podFactory({ id: 1, name: 'my-pod' });
    state = rootStateFactory({
      general: generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          data: null,
        }),
      }),
      pod: podStateFactory({
        items: [pod],
        loaded: true,
      }),
    });
  });

  it('can dispatch an action to generate certificate if not providing certificate and key', () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate closeForm={jest.fn()} hasCertificateData pod={pod} />,
      { route: '/kvm/edit', store }
    );

    // Radio should be set to generate certificate by default.
    submitFormikForm(null);

    const expectedAction = generalActions.generateCertificate({ object_name: 'my-pod' });
    const actualActions = store.getActions();
    expect(actualActions.find((action) => action.type === expectedAction.type)).toStrictEqual(expectedAction);
  });

  it('can generate a certificate with a custom object name', () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate
        closeForm={jest.fn()}
        hasCertificateData
        objectName="custom-name"
        pod={pod}
      />,
      {
        route: '/kvm/edit',
        store,
      }
    );
    // Radio should be set to generate certificate by default.
    submitFormikForm(null);

    const expectedAction = generalActions.generateCertificate({ object_name: 'custom-name' });
    const actualActions = store.getActions();
    expect(actualActions.find((action) => action.type === expectedAction.type)).toStrictEqual(expectedAction);
  });

  it('can dispatch an action to update pod with generated certificate and key', async () => {
    const generatedCertificate = generatedCertificateFactory({
      certificate: 'generated-certificate',
      private_key: 'private-key',
    });
    state.general.generatedCertificate.data = generatedCertificate;
    const store = mockStore(state);

    renderWithBrowserRouter(
      <UpdateCertificate closeForm={jest.fn()} hasCertificateData pod={pod} />,
      {
        route: '/kvm/edit',
        store,
      }
    );

    await submitFormikForm(null, { password: 'password' });

    const expectedAction = podActions.update({
      certificate: 'generated-certificate',
      id: pod.id,
      key: 'private-key',
      password: 'password',
      tags: pod.tags.join(','),
    });
    const actualActions = store.getActions();
    expect(actualActions.find((action) => action.type === expectedAction.type)).toStrictEqual(expectedAction);
  });

  it('can dispatch an action to update pod with provided certificate and key', async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate closeForm={jest.fn()} hasCertificateData pod={pod} />,
      {
        route: '/kvm/edit',
        store,
      }
    );

    // Change radio to provide certificate instead of generating one.
    const radio = screen.getByLabelText('Provide Certificate and Key');
    userEvent.click(radio);
    await submitFormikForm(null, { certificate: 'certificate', key: 'key' });

    const expectedAction = podActions.update({
      certificate: 'certificate',
      id: pod.id,
      key: 'key',
      tags: pod.tags.join(','),
    });
    const actualActions = store.getActions();
    expect(actualActions.find((action) => action.type === expectedAction.type)).toStrictEqual(expectedAction);
  });

  it('closes the form on cancel if pod has a certificate', () => {
    const closeForm = jest.fn();

    renderWithBrowserRouter(
      <UpdateCertificate closeForm={closeForm} hasCertificateData pod={pod} />,
      {
        route: '/kvm/edit',
        store: mockStore(state),
      }
    );

    const cancelBtn = screen.getByText(/Cancel/i);
    userEvent.click(cancelBtn);

    expect(closeForm).toHaveBeenCalled();
  });

  it(`clears generated certificate on cancel if pod has no certificate and a
      certificate has been generated`, () => {
    const closeForm = jest.fn();
    state.general.generatedCertificate.data = generatedCertificateFactory();
    const store = mockStore(state);

    renderWithBrowserRouter(
      <UpdateCertificate closeForm={closeForm} hasCertificateData={false} pod={pod} />,
      {
        route: '/kvm/edit',
        store,
      }
    );
    const cancelBtn = screen.getByText(/Cancel/i);
    userEvent.click(cancelBtn);

    const expectedAction = generalActions.clearGeneratedCertificate();
    const actualAction = store.getActions().find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it(`does not show a cancel button if pod has no certificate and no certificate
      has been generated`, () => {
    state.general.generatedCertificate.data = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate closeForm={jest.fn()} hasCertificateData={false} pod={pod} />,
      {
        route: '/kvm/edit',
        store,
      }
    );
    expect(screen.queryByText(/Cancel/i)).toBeNull();
  });
});

```