// When styles tend to get complex, I tend to outsource them to a seperate file.
// Otherwise, there's value in keeping a component and it's associated component in the same file.
import styled from "@emotion/styled";

import { IconButton } from "@chakra-ui/react";

export const StyledBoardContainer = styled.div`
  background-color: #eeeeee;
  display: block;
  padding: 3rem;
  margin: auto;
  background: rgb(34, 193, 195);
  background: linear-gradient(
    323deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(253, 187, 45, 1) 100%
  );
  border-radius: 3rem;
`;

export const StyledRow = styled.div`
  width: 300px;
`;
export const StyledCell = styled.div<{
  isRobot: boolean;
  live: boolean;
  isRobotPlacement: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: ${(props) => {
    if (props.isRobot) {
      return `3px solid gold`;
    } else if (!props.live) {
      return `3px dashed black`;
    }
    return `1px solid #888888`;
  }};
  color: ${(props) => (props.live ? "black" : "white")};
  background: ${(props) =>
    props.live ? "rgba(255,400,247,1)" : "rgba(2,0,36,1)"};
  background: ${(props) => {
    if (props.isRobot && props.live) {
      return "white";
    }
    return props.live ? "#CCCCCC" : "#888888";
  }};
  cursor: ${(props) => {
    if (props.isRobotPlacement && !props.live) {
      return props.live ? "grab" : "not-allowed";
    }
    return "cell";
  }};
`;
export const StyledInstructions = styled.div`
  width: 100%;
  text-align: center;
`;

export const StyledPlaceAndDirection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0;
`;

export const StyledDirectionGrid = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas:
    "header header header"
    ". NORTH ."
    "WEST . EAST"
    ". SOUTH .";
`;

export const StyledDirectionalHeader = styled.div`
  grid-area: header;
  text-align: center;
`;

export const StyledDirectionButton = styled(IconButton)<{ value: string }>`
  grid-area: ${(props) => props.value};
`;
