import { Select } from "@canonical/react-components";

const methods = [
  "controller.list",
  "device.list",
  "machine.list",
  "device.list",
];

const scenarios = ["default", "noMachines"];

const DevTools = (): JSX.Element => {
  const handleSend = (method: string, payload?: unknown) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.MAAS_DEVTOOLS.send(method, payload ? payload : null);
  const handleScenarioChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleSend("devtools.set_scenario", event.target.value);
    methods.forEach((method) => handleSend(method));
  };

  return (
    <>
      <Select
        defaultValue="noMachines"
        onChange={handleScenarioChange}
        options={scenarios.map((m) => ({ label: m, value: m }))}
      />
    </>
  );
};

export default DevTools;
