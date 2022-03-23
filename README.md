# Technical Test - Carrie-Anne Boyko for Mott MacDermott

Installation:

Development:

```bash
$ npm install
$ npm run start
```

```bash
$ npm install
$ npm install -g serve
$ npm run build
$ serve -s build
```

Either will host the site on http://localhost:3000

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
- [✅] Solution must include unit tests
- [✅] Solution must handle input
- [✅] Solution must be production ready

## Stretch

- [✅] Solution Must Look Good
- [✅] Provide button interface for user to input commands
- [❌] Integration Testing with Cypress or Playwright

## Technical Decisions / Libraries

### Irreducable Requirements

- React - The requirement is to use React.
- Typescript - The requirement is to use either Javascript or Typescript. Typescript was used to enable an easier understanding of the codebase at first glance, as this is a technical assessment.

### Tools

- Scaffolding - Create React App

While I've been enamoured of Next.js as my favorite toolkit right now, the case presented does not present any clear advantages of SSR or Static rendering and does not need a backend API to set up. Because of this, Create React App was a better solution.

If you are interested in seeing a project with Next.JS, please check out [https://github.com/brianboyko/Dept-Technical-Test](Brian Boyko - Dept Technical Test)

- Unit Testing - Jest, @testing-library/react

Jest is the de-facto standard for unit testing, and as it was developed by the same company as React, it's well suited to doing so.

Primary concern was unit testing the game state (src/GameContent/useGame.tsx) specifically because that is the most fragile code due to the mutable state that it manages.

- React Context API

The React Context API was chosen specifically because the amount of state is relatively small and could be handled in a single reducer, rather than needing the full feature set of Redux.

- Immer

Since the state includes a matrix, an immutability library was needed so that React would re-render when changes were made to the deep properties of the matrix. (Normally, changing a deep property of an object or array does not cause a re-render, as React only listens for when the main value changes. In the case of objects, arrays, and other pass-by-reference properties, that's actually the pointer -- yes, JS doesn't _have_ pointers, but it does _use_ pointers.)

- Chakra (UI Library)

As no visual guides were given for the look and feel, adopting a pre-designed UI library seemed like a good choice, rather than re-inventing the wheel. Or the button. Chakra was chosen for it's small library size and simplicity.

Since Chakra uses emotion as a dependency, emotion was chosen for styling rather than styled-components.

- React Icons

A larger icon library with ES6 imports. Chosen to avoid the issues that come with importing SVG elements and styling them after the fact.

### Not In Scope

Downscoping was considered to keep the size of the project reasonable and to ensure a speedy turnaround.

- Integration Testing

Keep in mind that this suite does not include integration testing, as this was not required by the brief, and the project is of limited duration. If you wish to see an example of the use of integration testing (with Cypress), please check out another technical test I've recently taken:

[https://github.com/brianboyko/Dept-Technical-Test](Dept Technical Test - Brian Boyko)

- UI Element Snapshots

A decision not to use snapshots was conscious, as while they can be useful in some limited situations, in practice they just tend to muck up updating the toolchain when one forgets to update the snapshots after a change. But this is so frequent that snapshots are often approved even though they visually may not be correct. This is why I have been moving away from snapshots towards integration testing with Cypress for much of the same purpose.

- Storybook

Usually a good idea, but not scoped in for time requirements.

# Acknowlegements / Citations

[Robot sprite sheet by "Wayward Martian"](https://forums.rpgmakerweb.com/index.php?threads/skinny-robot-charset-wanted-for-mv.126540/)

Some unit tests were having difficulty running; to get help I used Reactiflux Discord, and got help from David M. Foley. Foley is the author of react testing tool [isolate-react](https://github.com/davidmfoley/isolate-react), a tool which I wish I knew about when I started this project.

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
