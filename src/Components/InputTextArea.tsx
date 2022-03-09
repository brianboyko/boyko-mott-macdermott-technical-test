import React, { useState, useContext, useCallback } from "react";
import { GameDispatchContext } from "../GameContext/GameProvider";
import { Textarea, Button } from "@chakra-ui/react";
import styled from "@emotion/styled";

const StyledInputContainer = styled.div`
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const StyledTextArea = styled(Textarea)``;

export const InputTextArea = () => {
  const { processCommand } = useContext(GameDispatchContext);
  const [textValue, setTextValue] = useState<string>("");
  const handleTextValue: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    const value = event.target.value;
    setTextValue(value.toUpperCase());
  };
  const handleSubmit = useCallback(
    (isAll: boolean) => () => {
      const lines = textValue.split("\n");
      if (!isAll) {
        processCommand(lines[0]);
        setTextValue(lines.slice(1).join("\n"));
      } else {
        for (const line of lines) {
          processCommand(line);
        }
        setTextValue("");
      }
    },
    [processCommand, textValue]
  );
  return (
    <StyledInputContainer>
      <div>Manual Controls</div>
      <StyledTextArea
        className="code-like"
        onChange={handleTextValue}
        value={textValue}
      />
      <Button colorScheme="blue" onClick={handleSubmit(false)}>
        Submit Next Line
      </Button>
    </StyledInputContainer>
  );
};

export default InputTextArea;
