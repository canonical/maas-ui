import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import { VLANSelect } from '../VLANSelect';

import { screen, renderWithBrowserRouter } from 'testing/utils'
import { rootState as rootStateFactory, vlan as vlanFactory, vlanState as vlanStateFactory } from 'testing/factories';
import { VlanVid } from 'app/store/vlan/types';

const mockStore = configureStore();

describe('VLANSelect', () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      vlan: vlanStateFactory({
        items: [
          vlanFactory({ id: 1, name: 'vlan1', vid: 1, fabric: 3 }),
          vlanFactory({ id: 2, name: 'vlan2', vid: 2, fabric: 4 }),
        ],
        loaded: true,
      }),
    });
  });

  it('shows a spinner if the vlans haven't loaded', () => {
    state.vlan.loaded = false;
    const store = mockStore(state);
    render(renderWithBrowserRouter(
        <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect name='vlan' showSpinnerOnLoad />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('displays the vlan options', () => {
    const store = mockStore(state);
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect name='vlan' />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.getByText(/Select VLAN/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \(vlan1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2 \(vlan2\)/i)).toBeInTheDocument();
  });

  it('can display a default option', () => {
    const store = mockStore(state);
    const defaultOption = {
      label: 'Default',
      value: '99',
    };
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect defaultOption={defaultOption} name='vlan' />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('can hide the default option', () => {
    state.vlan.items = [];
    const store = mockStore(state);
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect defaultOption={null} name='vlan' />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.queryByText(/Select VLAN/i)).toBeNull();
  });

  it('filter the vlans by fabric', () => {
    const store = mockStore(state);
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect fabric={3} name='vlan' />
        </Formik>
      </Provider>, { route: '/machines'}
    ));

    expect(screen.getByText(/Select VLAN/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \(vlan1\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/2 \(vlan2\)/i)).toBeNull();
  });

  it('can not show the default VLAN', () => {
    state.vlan.items = [
      vlanFactory({ id: 1, name: 'vlan1', vid: 0, fabric: 3 }),
      vlanFactory({ id: 2, name: 'vlan2', vid: 2, fabric: 4 }),
    ];
    const store = mockStore(state);
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect includeDefaultVlan={false} name='vlan' />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.getByText(/2 \(vlan2\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Select VLAN/i)).toBeNull();
  });

  it('can generate the vlan names', () => {
    const store = mockStore(state);
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect
            generateName={(vlan) => `name: ${vlan.name}`}
            name='vlan'
          />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.getByText(/name: vlan2/i)).toBeInTheDocument();
    expect(screen.getByText(/name: vlan1/i)).toBeInTheDocument();
  });

  it('orders the vlans by name', () => {
    state.vlan.items = [
      vlanFactory({ id: 1, name: 'vlan1', vid: 21, fabric: 3 }),
      vlanFactory({ id: 2, name: 'vlan2', vid: 2, fabric: 4 }),
    ];
    const store = mockStore(state);
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect name='vlan' />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.getByText(/vlan2/i)).toBeInTheDocument();
    expect(screen.getByText(/vlan1/i)).toBeInTheDocument();
  });

  it('orders untagged vlans to the start', () => {
    state.vlan.items = [
      vlanFactory({ id: 1, name: 'vlan1', vid: 21, fabric: 3 }),
      vlanFactory({ id: 2, vid: VlanVid.UNTAGGED, fabric: 4 }),
    ];
    const store = mockStore(state);
    render(renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{ vlan: '' }} onSubmit={jest.fn()}>
          <VLANSelect name='vlan' />
        </Formik>
      </Provider>, { route: '/machines'}
    ));
    expect(screen.getByText(/untagged/i)).toBeInTheDocument();
    expect(screen.getByText(/vlan1/i)).toBeInTheDocument();
  });
});