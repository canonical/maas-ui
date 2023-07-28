import classNames from "classnames";

import DoughnutChart from "app/base/components/DoughnutChart";
import { COLOURS } from "app/base/constants";
import { memoryWithUnit } from "app/kvm/utils";

export type Props = {
  dynamicLayout?: boolean;
  generalAllocated: number; // B
  generalFree: number; // B
  generalOther?: number; // B
  hugepagesAllocated?: number; // B
  hugepagesFree?: number; // B
  hugepagesOther?: number; // B
  pageSize?: number; // B
};

const getTooltipSubstring = (general: number, hugepages: number) =>
  `${memoryWithUnit(general)} general${
    hugepages > 0 ? ` + ${memoryWithUnit(hugepages)} hugepages` : ""
  }`;

const RamResources = ({
  dynamicLayout = false,
  generalAllocated,
  generalFree,
  generalOther = 0,
  hugepagesAllocated = 0,
  hugepagesFree = 0,
  hugepagesOther = 0,
  pageSize = 0,
}: Props): JSX.Element => {
  const totalGeneral = generalAllocated + generalFree + generalOther;
  const totalHugepages = hugepagesAllocated + hugepagesFree + hugepagesOther;
  const totalMemory = totalGeneral + totalHugepages;
  const overCommitted = generalFree < 0 || hugepagesFree < 0;
  const showOthers = generalOther > 0 || hugepagesOther > 0;
  const showHugepages = totalHugepages > 0;

  return (
    <div
      aria-label="ram resources"
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
          segments={
            overCommitted
              ? [
                  {
                    color: COLOURS.CAUTION,
                    value: 1,
                  },
                ]
              : [
                  {
                    color: COLOURS.LINK,
                    tooltip: `Allocated: ${getTooltipSubstring(
                      generalAllocated,
                      hugepagesAllocated
                    )}`,
                    value: generalAllocated + hugepagesAllocated,
                  },
                  ...(showOthers
                    ? [
                        {
                          color: COLOURS.POSITIVE,
                          tooltip: `Others: ${getTooltipSubstring(
                            generalOther,
                            hugepagesOther
                          )}`,
                          value: generalOther + hugepagesOther,
                        },
                      ]
                    : []),
                  {
                    color: COLOURS.LINK_FADED,
                    tooltip: `Free: ${getTooltipSubstring(
                      generalFree,
                      hugepagesFree
                    )}`,
                    value: generalFree + hugepagesFree,
                  },
                ]
          }
          size={96}
        />
      </div>
      <div className="ram-resources__table-container">
        <table
          aria-label="ram resources table"
          className="ram-resources__table"
        >
          <thead>
            <tr>
              <th></th>
              <th className="u-align--right u-text--light u-truncate">
                Allocated
                <span className="u-nudge-right--small">
                  <i className="p-circle--link"></i>
                </span>
              </th>
              {showOthers && (
                <th
                  className="u-align--right u-text--light u-truncate"
                  data-testid="others-col"
                >
                  Others
                  <span className="u-nudge-right--small">
                    <i className="p-circle--positive"></i>
                  </span>
                </th>
              )}
              <th className="u-align--right u-text--light u-truncate">
                Free
                <span className="u-nudge-right--small">
                  <i className="p-circle--link-faded"></i>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>General</td>
              <td className="u-align--right">
                <span className="u-nudge-left">
                  {memoryWithUnit(generalAllocated)}
                </span>
              </td>
              {showOthers && (
                <td className="u-align--right">
                  <span className="u-nudge-left">
                    {memoryWithUnit(generalOther)}
                  </span>
                </td>
              )}
              <td className="u-align--right">
                <span className="u-nudge-left">
                  {memoryWithUnit(generalFree)}
                </span>
              </td>
            </tr>
            {showHugepages && (
              <tr data-testid="hugepages-data">
                <td>
                  Hugepage
                  {pageSize > 0 && (
                    <>
                      <br />
                      <strong
                        className="p-text--x-small u-text--light"
                        data-testid="page-size"
                      >
                        {`(Size: ${memoryWithUnit(pageSize)})`}
                      </strong>
                    </>
                  )}
                </td>
                <td className="u-align--right">
                  <span className="u-nudge-left">
                    {memoryWithUnit(hugepagesAllocated)}
                  </span>
                </td>
                {showOthers && (
                  <td className="u-align--right">
                    <span className="u-nudge-left">
                      {memoryWithUnit(hugepagesOther)}
                    </span>
                  </td>
                )}
                <td className="u-align--right">
                  <span className="u-nudge-left">
                    {memoryWithUnit(hugepagesFree)}
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
