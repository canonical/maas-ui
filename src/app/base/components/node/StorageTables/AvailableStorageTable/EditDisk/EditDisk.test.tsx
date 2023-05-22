import { render } from '@testing-library/react';
import { renderWithBrowserRouter, screen, userEvent } from 'testing/utils';

import EditDisk from './EditDisk';

import { DiskTypes } from 'app/store/types/enum';
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  rootState as rootStateFactory,
} from 'testing/factories';
import { submitFormikForm } from 'testing/utils';

describe('EditDisk', () => {
  it('shows filesystem fields if the disk is not the boot disk', () => {
    const disk = diskFactory({ is_boot: false, type: DiskTypes.PHYSICAL });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [disk],
            system_id: 'abc123',
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = configureStore()(state);
    renderWithBrowserRouter(<EditDisk closeExpanded={jest.fn()} disk={disk} systemId="abc123" />, { store });

    expect(screen.getByTestId('filesystem-fields')).toBeInTheDocument();
  });

  it('correctly dispatches an action to edit a disk', async () => {
    const disk = diskFactory({ type: DiskTypes.PHYSICAL });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [disk],
            system_id: 'abc123',
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = configureStore()(state);
    renderWithBrowserRouter(<EditDisk closeExpanded={jest.fn()} disk={disk} systemId="abc123" />, { store });

    userEvent.type(screen.getByPlaceholderText(/tag/i), 'tag1,tag2');
    userEvent.click(screen.getByText(/submit/i));

    expect(
      store.getActions().find((action) => action.type === 'machine/updateDisk')
    ).toEqual({
      meta: {
        method: 'update_disk',
        model: 'machine',
      },
      payload: {
        params: {
          block_id: disk.id,
          system_id: 'abc123',
          tags: ['tag1', 'tag2'],
        },
      },
      type: 'machine/updateDisk',
    });
  });
});
```