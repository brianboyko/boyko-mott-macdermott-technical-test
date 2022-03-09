import React from "react";
import GameProvider from "./GameContext/GameProvider";
import Board from "./Components/Board";
import InputTextArea from "./Components/InputTextArea";
import ReportLog from "./Components/ReportLog";
import ButtonControls from "./Components/ui/ButtonControls";
import styled from "@emotion/styled";
import { ChakraProvider } from "@chakra-ui/react";

const StyledGameArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 3rem;
  width: 30rem;
`;
const StyledApp = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

function App() {
  return (
    <ChakraProvider>
      <StyledApp className="App">
        <GameProvider>
          <StyledGameArea>
            <Board />
            <ButtonControls />
            <InputTextArea />
            <ReportLog />
          </StyledGameArea>
        </GameProvider>
      </StyledApp>
    </ChakraProvider>
  );
}

export default App;
