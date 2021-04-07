import classNames from "classnames";

import DoughnutChart from "app/base/components/DoughnutChart";
import { COLOURS } from "app/base/constants";
import { memoryWithUnit } from "app/kvm/utils";

export type Props = {
  dynamicLayout?: boolean;
  general: {
    allocated: number; // B
    free: number; // B
  };
  hugepages: {
    allocated: number; // B
    free: number; // B
    pageSize?: number;
  };
};

const RamResources = ({
  dynamicLayout = false,
  general,
  hugepages,
}: Props): JSX.Element => {
  const totalGeneral = general.allocated + general.free;
  const totalHugepages = hugepages.allocated + hugepages.free;
  const totalMemory = totalGeneral + totalHugepages;

  return (
    <div
      className={classNames("ram-resources", {
        "ram-resources--dynamic-layout": dynamicLayout,
      })}
    >
      <div className="ram-resources__chart-container">
        <h4 className="p-heading--small">RAM</h4>
        <DoughnutChart
          className="ram-resources__chart"
          label={memoryWithUnit(totalMemory)}
          segmentHoverWidth={18}
          segmentWidth={15}
          segments={[
            {
              color: COLOURS.LINK,
              tooltip: `General allocated ${memoryWithUnit(general.allocated)}`,
              value: general.allocated,
            },
            ...(totalHugepages > 0
              ? [
                  {
                    color: COLOURS.POSITIVE,
                    tooltip: `Hugepage allocated ${memoryWithUnit(
                      hugepages.allocated
                    )}`,
                    value: hugepages.allocated,
                  },
                  {
                    color: COLOURS.POSITIVE_MID,
                    tooltip: `Hugepage free ${memoryWithUnit(hugepages.free)}`,
                    value: hugepages.free,
                  },
                ]
              : []),
            {
              color: COLOURS.LINK_FADED,
              tooltip: `General free ${memoryWithUnit(general.free)}`,
              value: general.free,
            },
          ]}
          size={96}
        />
      </div>
      <div className="ram-resources__table-container">
        <table className="ram-resources__table">
          <thead>
            <tr>
              <th></th>
              <th className="u-align--right u-text--light">
                <span className="u-nudge-left">Allocated</span>
              </th>
              <th className="u-align--right u-text--light">
                <span className="u-nudge-left">Free</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>General</td>
              <td className="u-align--right">
                {memoryWithUnit(general.allocated)}
                <span className="u-nudge-right--small">
                  <i className="p-circle--link"></i>
                </span>
              </td>
              <td className="u-align--right">
                {memoryWithUnit(general.free)}
                <span className="u-nudge-right--small">
                  <i className="p-circle--link-faded"></i>
                </span>
              </td>
            </tr>
            {totalHugepages > 0 && (
              <tr data-test="hugepages-data">
                <td>
                  Hugepage
                  {hugepages.pageSize && (
                    <>
                      <br />
                      <strong
                        className="p-text--x-small u-text--light"
                        data-test="page-size"
                      >
                        {`(Size: ${memoryWithUnit(hugepages.pageSize)})`}
                      </strong>
                    </>
                  )}
                </td>
                <td className="u-align--right">
                  {memoryWithUnit(hugepages.allocated)}
                  <span className="u-nudge-right--small">
                    <i className="p-circle--positive"></i>
                  </span>
                </td>
                <td className="u-align--right">
                  {memoryWithUnit(hugepages.free)}
                  <span className="u-nudge-right--small">
                    <i className="p-circle--positive-faded"></i>
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RamResources;
