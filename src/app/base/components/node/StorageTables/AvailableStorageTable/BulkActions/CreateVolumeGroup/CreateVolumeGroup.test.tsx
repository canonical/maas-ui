```
import { render, screen } from 'testing/utils';
import configureStore from 'redux-mock-store';

import CreateVolumeGroup from './CreateVolumeGroup';

import { DiskTypes } from 'app/store/types/enum';
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from 'testing/factories';
import { submitFormikForm } from 'testing/utils';

const mockStore = configureStore();

describe('CreateVolumeGroup', () => {
  it('sets the initial name correctly', () => {
    const vgs = [
      diskFactory({ type: DiskTypes.VOLUME_GROUP }),
      diskFactory({ type: DiskTypes.VOLUME_GROUP }),
    ];
    const physicalDisk = diskFactory({
      partitions: null,
      type: DiskTypes.PHYSICAL,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [...vgs, physicalDisk],
            system_id: 'abc123',
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CreateVolumeGroup
        closeForm={jest.fn()}
        selected={[physicalDisk]}
        systemId='abc123'
      />,
      { route: '/machine', store },
    );

    // Two volume groups already exist so the next one should be vg2
    expect(screen.getByLabelText('vg2').value).toBe('vg2');
  });

  it('shows the details of the selected storage devices', () => {
    const [selectedDisk, selectedPartition] = [
      diskFactory({
        name: 'floppy',
        partitions: null,
        type: DiskTypes.PHYSICAL,
      }),
      partitionFactory({ filesystem: null, name: 'flippy' }),
    ];
    const disks = [
      selectedDisk,
      diskFactory({ partitions: [selectedPartition] }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: disks, system_id: 'abc123' })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CreateVolumeGroup
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId='abc123'
      />,
      { route: '/machine', store },
    );

    expect(screen.getAllByRole('row').length).toBe(2);
    expect(screen.getByText(new RegExp(selectedDisk.name, 'i')));
    expect(screen.getByText(new RegExp(selectedPartition.name, 'i')));
  });

  it('correctly dispatches an action to create a volume group', () => {
    const [selectedDisk, selectedPartition] = [
      diskFactory({ partitions: null, type: DiskTypes.PHYSICAL }),
      partitionFactory({ filesystem: null }),
    ];
    const disks = [
      selectedDisk,
      diskFactory({ partitions: [selectedPartition] }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: disks, system_id: 'abc123' })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CreateVolumeGroup
        closeForm={jest.fn()}
        selected={[selectedDisk, selectedPartition]}
        systemId='abc123'
      />,
      { route: '/machine', store },
    );

    submitFormikForm(screen, {
      name: 'vg1',
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === 'machine/createVolumeGroup'),
    ).toEqual({
      meta: {
        method: 'create_volume_group',
        model: 'machine',
      },
      payload: {
        params: {
          block_devices: [selectedDisk.id],
          name: 'vg1',
          partitions: [selectedPartition.id],
          system_id: 'abc123',
        },
      },
      type: 'machine/createVolumeGroup',
    });
  });
});
```;
