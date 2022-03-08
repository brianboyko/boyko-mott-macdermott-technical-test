import React, { useContext, useMemo } from "react";
import { GameStateContext } from "../GameContext/GameProvider";

// we don't want rerender whenever the state changes,
// only when the state.log changes.
const useMemoizedReportLog = () => {
  const state = useContext(GameStateContext);
  return useMemo(() => ({ log: state.log }), [state.log]);
};
export const ReportLog = () => {
  const { log } = useMemoizedReportLog();
  return (
    <ul>
      {log.map((entry, index) => (
        <li key={`LOG-${index}`}>{entry}</li>
      ))}
    </ul>
  );
};

export default ReportLog;
