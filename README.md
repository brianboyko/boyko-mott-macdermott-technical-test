# Technical Test - Brian Boyko for Mott MacDermott

## Specifications

Impliment a Toy Robot Game

KEY:
✅ - Done
⚠️ - Partial completion
❌ - Incomplete

- [✅] Create 5x5 board with coordinate system.
  - Bottom left is (1, 1), top right is (5, 5)
- [✅] Solution must respond to the following commands
  - [✅] PLACE_ROBOT {ROW},{COL},{FACING}
    - If there are no robots, place the robot in the coordinates provided
    - If there is already a robot, move the robot from the old to new location
    - If the coordinate or facing value is invalid, noop.
  - [✅] PLACE_WALL {ROW},{COL}
    - If the target location is empty, add a wall
    - The user can add as many walls as they like
    - If the target location is occupied by the robot or another wall, this command is ignored
    - Invalid coordinates are ignored.
  - [✅] REPORT
    - Prints out a report in the form of {ROW},{COL},{FACING}
  - [✅] MOVE
    - Move command moves the robot 1 space forward in the direction it is facing
    - If there are no robots, this is ignored
    - If there is a wall in the way of the robot, this is ignored.
    - If the robot is at the edge of the board, wrap around.
  - [✅] LEFT / RIGHT
    - Turn the robot 90 degrees to it's left or right.
    - If there is no robot, this command is ignored.

## Requirements

- [✅] Solution must use React
- [✅] Solution must use JS/TS
- [⚠️] Solution must include unit tests
- [✅] Solution must handle input
- [⚠️] Solution must be production ready

## Stretch

- [❌] Solution Must Look Good
- [❌] Provide button interface for user to input commands
- [❌] Provide Component Rendering snapshots

# Acknowlegements / Citations

[Robot sprite sheet by "Wayward Martian"](https://forums.rpgmakerweb.com/index.php?threads/skinny-robot-charset-wanted-for-mv.126540/)

---

CRA Directions

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
