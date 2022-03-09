import styled from "@emotion/styled";

import { MoveRobotButton, TurnLeftButton, TurnRightButton } from "./Buttons";

const ButtonControlFlex = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 1.5rem 0;
`;

export const ButtonControls = () => {
  return (
    <>
      <ButtonControlFlex>
        <TurnLeftButton />
        <MoveRobotButton />
        <TurnRightButton />
      </ButtonControlFlex>
    </>
  );
};

export default ButtonControls;
