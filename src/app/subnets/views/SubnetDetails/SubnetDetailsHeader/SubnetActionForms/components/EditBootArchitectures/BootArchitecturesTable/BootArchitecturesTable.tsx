import { MainTable } from "@canonical/react-components";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { FormValues } from "../EditBootArchitectures";

import RowCheckbox from "app/base/components/RowCheckbox";
import { knownBootArchitectures as knownBootArchitecturesSelectors } from "app/store/general/selectors";
import type { KnownBootArchitecture } from "app/store/general/types";

export enum Headers {
  BootloaderArch = "Bootloader architecture",
  BootMethod = "BIOS boot method",
  Name = "Name",
  Octet = "Architecture octet",
  Protocol = "Protocol",
}

export const BootArchitecturesTable = (): JSX.Element => {
  const {
    setFieldValue,
    values: { disabled_boot_architectures },
  } = useFormikContext<FormValues>();
  const knownBootArchitectures = useSelector(
    knownBootArchitecturesSelectors.get
  );

  const isChecked = (bootArchName: KnownBootArchitecture["name"]) =>
    !disabled_boot_architectures.includes(bootArchName);

  const handleArchChange = (bootArchName: KnownBootArchitecture["name"]) => {
    setFieldValue(
      "disabled_boot_architectures",
      isChecked(bootArchName)
        ? [...disabled_boot_architectures, bootArchName]
        : disabled_boot_architectures.filter((item) => item !== bootArchName)
    );
  };

  return (
    <MainTable
      className="boot-architectures-table"
      defaultSort="name"
      defaultSortDirection="ascending"
      headers={[
        {
          className: "name-col",
          content: Headers.Name,
          sortKey: "name",
        },
        {
          className: "bios-boot-col",
          content: Headers.BootMethod,
          sortKey: "bios_boot_method",
        },
        {
          className: "bootloader-col",
          content: Headers.BootloaderArch,
          sortKey: "bootloader_arches",
        },
        {
          className: "protocol-col",
          content: Headers.Protocol,
          sortKey: "protocol",
        },
        {
          className: "octet-col",
          content: Headers.Octet,
          sortKey: "arch_octet",
        },
      ]}
      responsive
      rows={knownBootArchitectures.map((bootArch) => {
        const {
          arch_octet,
          bios_boot_method,
          bootloader_arches,
          name,
          protocol,
        } = bootArch;
        return {
          className: classNames("boot-architectures-table__row", {
            "is-selected": isChecked(name),
          }),
          columns: [
            {
              "aria-label": Headers.Name,
              content: (
                <RowCheckbox
                  checkSelected={isChecked}
                  handleRowCheckbox={handleArchChange}
                  inputLabel={name}
                  item={name}
                  items={disabled_boot_architectures}
                />
              ),
            },
            {
              "aria-label": Headers.BootMethod,
              content: bios_boot_method,
            },
            {
              "aria-label": Headers.BootloaderArch,
              content: bootloader_arches || "—",
            },
            {
              "aria-label": Headers.Protocol,
              content: protocol,
            },
            {
              "aria-label": Headers.Octet,
              content: arch_octet || "—",
            },
          ],
          sortData: {
            arch_octet,
            bios_boot_method,
            bootloader_arches,
            name,
            protocol,
          },
        };
      })}
      sortable
    />
  );
};

export default BootArchitecturesTable;
