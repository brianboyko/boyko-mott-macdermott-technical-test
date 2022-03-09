import React from "react";
import GameProvider from "./GameContext/GameProvider";
import Board from "./Components/Board";
import InputTextArea from "./Components/InputTextArea";
import ReportLog from "./Components/ReportLog";
import ButtonControls from "./Components/ui/ButtonControls";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <GameProvider>
          <Board />
          <InputTextArea />
          <ReportLog />
          <ButtonControls />
        </GameProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
