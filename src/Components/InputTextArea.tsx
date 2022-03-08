import React, { useState, useContext, useCallback } from "react";
import { GameDispatchContext } from "../GameContext/GameProvider";
export const InputTextArea = () => {
  const { processCommand } = useContext(GameDispatchContext);
  const [textValue, setTextValue] = useState<string>("");
  const handleTextValue: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    const value = event.target.value;
    setTextValue(value);
  };
  const handleSubmit = useCallback(() => {
    const lines = textValue.split("\n");
    processCommand(lines[0]);
    setTextValue(lines.slice(1).join("\n"));
  }, [processCommand, textValue]);
  return (
    <div>
      <textarea onChange={handleTextValue} value={textValue} />
      <button onClick={handleSubmit}>Submit Next Line</button>
    </div>
  );
};

export default InputTextArea;
