<p align="center">
	<img src="https://user-images.githubusercontent.com/30529572/92081025-fabe6f00-edb1-11ea-9169-4a8a61a5dd45.png" alt="user"/>
	<h2 align="center"> 🐧PiPo ~ Post In Post Out web backend</h2>
	<h4 align="center">This is a service to create your personalized scrapbook.<h4>
</p>

![Tests](https://github.com/GDGVIT/node-template/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/GDGVIT/node-template/branch/master/graph/badge.svg)](https://codecov.io/gh/GDGVIT/node-template)
[![GitHub Super-Linter](https://github.com/GDGVIT/node-template/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

<p align="center">An online scrapbook website where the user chooses a challenge and tries to maintain the streak for the number of days the challenge specifies. Upon completing the challenge the user earns the badge which will be displayed in the user's profile. Incase the user loses the streak the user can reclaim it by spending points for that day and in order to obtain points the user has to challenge other users to a contest of their choice and the winner will be decided by the public.</p>

<p align="center">This repository is under development.</p>

## Functionalities and routes

Ver 1:

- [x]  Auth route (name, email)
    - [x]  Post(signup)
    - [x]  Post(login)
- [x]  Posts route
    - [x]  Get all users + recent posts route(sorted by points)
- [x]  User route (username, name, email, completed badges[badgeName], in-progress badges, followers, following, friends)
    - [x]  Get details
- [x]  Users route
    - [x]  Get all posts for a user (sorted by date/time)

---

- [x]  Badge
    - [x]  (deprecated route) Create a badge
    - [x]  Join a badge ( user-badge )
    - [x]  Create a post (route change)
- [x]  Get posts for a badge
    - [x]  Get request
- [x]  Post a post
    - [x]  Post request

---

Ver 2:

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

<!-- ## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```

Alternatively, you can deploy your own copy of the app using the web-based flow:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
 -->

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
<a href = "https://github.com/Pragati1610"><img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="github"/></a>
<a href = "https://www.linkedin.com/in/pragati-bhattad-53a849198/">
<img src = "http://www.iconninja.com/files/863/607/751/network-linkedin-social-connection-circular-circle-media-icon.svg" width="36" height="36" alt="linkedin"/>
</a>
</p>
</td>
</tr>
</table>

<p align="center">
	Made with :heart: by <a href="https://dscvit.com">DSC VIT</a>
</p>
