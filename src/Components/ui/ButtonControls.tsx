import {
  MoveRobotButton,
  TurnLeftButton,
  TurnRightButton,
  ReportButton,
} from "./Buttons";



export const ButtonControls = () => {
  return (
    <>
      <MoveRobotButton />
      <TurnLeftButton />
      <TurnRightButton />
      <ReportButton />
    </>
  );
};

export default ButtonControls;
