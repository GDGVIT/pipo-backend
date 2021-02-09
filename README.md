<p align="center">
	<img src="https://user-images.githubusercontent.com/30529572/92081025-fabe6f00-edb1-11ea-9169-4a8a61a5dd45.png" />
	<h2 align="center">PiPo web backend</h2>
	<h4 align="center">This is a service to create your personalized scrapbook.<h4>
</p>

![Tests](https://github.com/GDGVIT/node-template/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/GDGVIT/node-template/branch/master/graph/badge.svg)](https://codecov.io/gh/GDGVIT/node-template)
[![GitHub Super-Linter](https://github.com/GDGVIT/node-template/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

<p>This repository is under development.</p>

## Functionalities and routes

- [ ]  Auth route (name, email)
    - [ ]  Post(signup)
    - [ ]  Post(login)
- [ ]  Posts route
    - [ ]  Get all users + recent posts route(sorted by points)
- [ ]  User route (username, name, email, completed badges[badgeName], in-progress badges, followers, following, friends)
    - [ ]  Get details
- [ ]  Users route
    - [ ]  Get all posts for a user (sorted by date/time)

---

- [ ]  Badge
    - [ ]  (deprecated route) Create a badge
    - [ ]  Join a badge ( user-badge )
    - [ ]  Create a post (route change)
- [ ]  Get posts for a badge
    - [ ]  Get request
- [ ]  Post a post
    - [ ]  Post request

---

- [ ]  Route for checking time
- [ ]  Challenge
    - [ ]  Post create a challenge
    - [ ]  Send a challenge
    - [ ]  Accept a challenge
    - [ ]  Timer for the challenge
    - [ ]  Complete in the challenge(win/loose), change point structure
- [ ]  Leaderboard
    - [ ]  Get all ongoing and upcoming challenges

---

## Getting started

### Instructions to run

- Pre-requisites
  - Node.js installed with npm enabled, version used during devlopment:
    - Node.js v10.19.0
    - npm v6.14.4
  - An active internet connection to connect to the database - All the npm packages mentioned in the package.json

- Clone the repo

- Command to setup the environment
```bash
npm init
```

- Command to install dependencies
```bash
npm install
```

- Add a .env file with contents as present in the sample .env

- Command to run the server in the development environment
```bash
npm run devStart
# or
npm start
```
Your app should now be running on [localhost:8080](http://localhost:8080/).

## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```

Alternatively, you can deploy your own copy of the app using the web-based flow:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


## Additional Information

- On Linux, UNIX and Mac, running the following command adds ./node_modules/.bin to the path.

  ```bash
  source ./activate
  ```

  This makes it easier to run locally installed command packages.
  This won't be required in many IDEs like Webstorm, but we thought it's a good idea to include it anyway.

- Run all tests using:

  ```bash
  npm test
  ```
## Contributors

<table>
<tr align="center">

<td>
Pragati Bhattad
<p align="center">
<img src = "https://dscvit.com/images/dsc-logo-square.svg" width="150" height="150" alt="Pragati Bhattad">
</p>
<p align="center">
<a href = "https://github.com/Pragati1610"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36"/></a>
<a href = "https://www.linkedin.com/in/pragati-bhattad-53a849198/">
<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36"/>
</a>
</p>
</td>
</tr>
</table>