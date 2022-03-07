import React from "react";
import logo from "./logo.svg";
import "./App.css";
import GameProvider from "./GameContext/GameProvider";
import Board from "./Components/Board";
import InputTextArea from './Components/InputTextArea'; 
import ReportLog from './Components/ReportLog';
function App() {
  return (
    <div className="App">
      <GameProvider>
        <Board/>
        <InputTextArea/>
        <ReportLog/>
      </GameProvider>
    </div>
  );
}

export default App;
