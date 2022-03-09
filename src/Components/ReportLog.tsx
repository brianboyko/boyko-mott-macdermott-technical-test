import React, { useContext, useMemo } from "react";
import { GameStateContext } from "../GameContext/GameProvider";
import { ReportButton } from "./ui/Buttons";

// we don't want rerender whenever the state changes,
// only when the state.log changes.
const useMemoizedReportLog = () => {
  const state = useContext(GameStateContext);
  return useMemo(() => ({ log: state.log }), [state.log]);
};
export const ReportLog = () => {
  const { log } = useMemoizedReportLog();
  const reversedLog = [...log].reverse();
  return (
    <>
      <ReportButton />
      {log.length ? (
        <>
          <h2>Report Log (Most recent first)</h2>
          <hr />
          {reversedLog.map((entry, index) => (
            <>
              <div key={`LOG-${index}`}>{entry}</div>
              <hr />
            </>
          ))}
        </>
      ) : null}
    </>
  );
};

export default ReportLog;
