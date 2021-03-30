import { useContext, useEffect, useRef } from "react";

import { ContextualMenu, notificationTypes } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { format } from "date-fns";
import fileDownload from "js-file-download";
import { useDispatch, useSelector } from "react-redux";

import { useGetInstallationOutput } from "../hooks";

import FileContext from "app/base/file-context";
import { api } from "app/base/sagas/http";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { actions as messageActions } from "app/store/message";
import type { RootState } from "app/store/root/types";
import scriptResultSelectors from "app/store/scriptresult/selectors";
import { ScriptResultNames } from "app/store/scriptresult/types";
type Props = { systemId: Machine["system_id"] };
export const DownloadMenu = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const installationResults = useSelector((state: RootState) =>
    scriptResultSelectors.getInstallationByMachineId(state, systemId)
  );
  const hasCurtinLog = installationResults?.some(
    ({ name }) => name === ScriptResultNames.CURTIN_LOG
  );
  const installationOutput = useGetInstallationOutput(systemId);
  const getSummaryXmlKey = useRef(nanoid());
  const getSummaryYamlKey = useRef(nanoid());
  const fileContext = useContext(FileContext);
  const summaryXML = fileContext.get(getSummaryXmlKey.current);
  const summaryYAML = fileContext.get(getSummaryYamlKey.current);
  const today = format(new Date(), "yyyy-MM-dd");
  const toggleDisabled =
    !installationOutput?.log && !summaryYAML && !summaryXML;

  useEffect(() => {
    if (machine) {
      // Request the files for this
      dispatch(
        machineActions.getSummaryXml(systemId, getSummaryXmlKey.current)
      );
      dispatch(
        machineActions.getSummaryYaml(systemId, getSummaryYamlKey.current)
      );
    }
  }, [dispatch, systemId, machine]);

  // Clean up the requested files when the component unmounts.
  useEffect(
    () => () => {
      fileContext.remove(getSummaryXmlKey.current);
      fileContext.remove(getSummaryYamlKey.current);
    },
    [fileContext]
  );

  const generateItem = (
    title: string,
    filename: string,
    extension: string,
    testKey: string,
    fileContent?: string | null
  ) => {
    if (!fileContent) {
      // If there is no file then return an empty array so it can be spread.
      return [];
    }
    return [
      {
        children: title,
        "data-test": testKey,
        onClick: () => {
          if (fileContent && machine) {
            fileDownload(
              fileContent,
              `${machine.fqdn}-${filename}-${today}.${extension}`
            );
          }
        },
      },
    ];
  };

  if (!machine) {
    return null;
  }
  return (
    <div>
      <ContextualMenu
        className="download-menu"
        hasToggleIcon
        links={[
          ...generateItem(
            "Machine output (YAML)",
            "machine-output",
            "yaml",
            "machine-output-yaml",
            summaryYAML
          ),
          ...generateItem(
            "Machine output (XML)",
            "machine-output",
            "xml",
            "machine-output-xml",
            summaryXML
          ),
          ...(hasCurtinLog
            ? [
                {
                  children: "curtin-logs.tar",
                  "data-test": "curtin-logs",
                  onClick: () => {
                    api.scriptresults
                      .getCurtinLogsTar(machine.system_id)
                      .then((response) => {
                        fileDownload(
                          response,
                          `${machine.fqdn}-curtin-${today}.tar`
                        );
                      })
                      .catch((error) => {
                        dispatch(
                          messageActions.add(
                            `curtin.tar could not be downloaded: ${error}`,
                            notificationTypes.NEGATIVE
                          )
                        );
                      });
                  },
                },
              ]
            : []),
          ...generateItem(
            "Installation output",
            "installation-output",
            "log",
            "installation-output",
            installationOutput.log
          ),
        ]}
        position="right"
        toggleAppearance="neutral"
        toggleDisabled={toggleDisabled}
        toggleLabel="Download"
      />
    </div>
  );
};

export default DownloadMenu;
