# bloom-portal

Web development project for Bloom Admin Portal

Stack: React, Redux, Apollo, Styled-Components, react-scripts, Babel, Webpack, Jest, ESLint, Nightwatch

## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find its most recent guide version [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

We'd like to remain "un-ejected" from `react-scripts` for as long as it makes sense to do so.  This makes maintenence tasks across projects simpler, and may make an eventual migration to react-scripts [v2](https://github.com/facebook/create-react-app/issues/3815) (or another setup) easier down the road if needed.

## Setup Instructions
1. make sure you have node installed!  see [NVM](#nvm) section for more details
1. install yarn (https://yarnpkg.com/lang/en/docs/install/). On OS X with homebrew:  
  `brew install yarn`
  - In case you encounter the error "brew: command not found" error when trying to execute "brew install yarn" in the Terminal, do the following command below (Reference link: https://github.com/Homebrew/brew/issues/4101):
  `xcode-select --install`
1. clone this repo to an appropriate location on you machine
1. from the root folder of the repository, run the following command to install necessary package dependencies.  
	`yarn install`
1. Copy the /.env.empty as a new /.env file (e.g. `cp ./.env.empty ./.env`)
    - To use the hosted devapi as the api endpoint for your local environment (recommended), change the `REACT_APP_API_ENDPOINT` line in your new `.env` file to:
      `REACT_APP_API_ENDPOINT=https://api.dev0.forge.bloomup.co/graphql`
    - Otherwise edit your .env file and set your environment variables as needed.  For example, with `vi`:
      `vi ./.env`
1. Start the development server by running:  
	`yarn start`
1. once the dev server has finished starting up, open a browser to `http://localhost:2306` to run the app

Port 2306 is the default port for local environment. See [this section](#changing-development-server-address-and-port) for more information about configuring these variables.

## NVM
We generally use [nvm](https://github.com/creationix/nvm) to manage the version of node that portal developers use for the project.  This helps us manage separate node versions on our dev machines for different projects, and offers a way to make sure we all use the same node version that our CI agents use.  See the *.nvmrc* file that specifies the version of node currently used on this project.

You can read about setting up nvm on your machine here:

https://github.com/creationix/nvm#installation

...or for the short install instructions (only tested on osx):

1. make sure you have a ~/.bash_profile file already created.  use `touch ~/.bash_profile` if you don't already have one
1. install nvm:
    ```
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
    ```
1. IMPORTANT! you may need to restart your bash session (restart terminal) for the new `nvm` command to be recognized.
1. in bloom-portal checkout root, run `nvm install` to download & install the proper version of node, if you don't already have it
1. in bloom-portal checkout root, run `nvm use` to use the specified version of node if it is already installed

## Changing development server address and port

You can also change some ENV variables via cmd line, when running `yarn start` or `yarn build`.  For example calling start with current defaults:

```
HTTPS=false HOST=localhost PORT=8095 yarn start
```

For more information on "advanced" ENV configurations, see [this section](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#advanced-configuration) of the create-react-app user guide.

For more information on how custom ENV variables are utilized by `react-scripts` see [this section](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables) of the create-react-app user guide:


## Yarn (npm) Scripts
The most useful commands for normal development work are:

- `yarn start`: starts the webpack devserver to run local development environment
- `yarn test`: runs the test suite in an [optimized watching mode](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#command-line-interface)
- `yarn test:coverage`: runs the test suite _once_ and [includes a coverage report](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#coverage-reporting).
- `yarn lint`: Full code linting with ESLint & Stylelint
- `yarn stylelint`: Only CSS linting
- `yarn build`: runs a production (minified, optimized) build and output to /dist folder. for developers, this is only needed when testing production builds locally or webpack changes... webpack devserver should be used for development in almost all other situations.
- `yarn schema`: fetches the graphql Schema in json format from API server, and writes to `schema.json`.  IMPORTANT: anytime server developers change the schema on api.dev server, a client developer must manually run this command, check the result into a new branch, and post a PR.  This will update our linting rules for development locally once all client developers have merged in this change to local branches.  In future, we may automate this further :)

## Useful links

The following are useful links where you can get more help while working in this codebase:

- [MDN Web Docs](https://developer.mozilla.org/en-US/) - lots of required knowledge is housed here
- [yarn](https://yarnpkg.com/en/) - (current) package dependency management tool
- [npm](https://docs.npmjs.com/) - TODO: in future we may migrate back to npm v6+ & node v8 LTS, away from `yarn`
- [node](https://nodejs.org/en/docs/) - although react-scripts abstracts a lot of this away from our day-to-day, it's always good to know about `node` in a pinch :)
- [React](https://reactjs.org/docs/getting-started.html) - the UI Framework
- [React Developer Tools](https://github.com/facebook/react-devtools)
- [Apollo](https://www.apollographql.com/docs/) - The GQL Framework
- [Apollo Client Devtools (Chrome or Firefox)](https://github.com/apollographql/apollo-client-devtools)
- [Redux](https://redux.js.org/) - application-level client-side state managament.
- [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension)
- [Graph𝑖QL Tool (Bloom Dev API)](https://api.dev.bloom.firstfoundry.net/graphql) Web IDE for exploring/testing GraphQL queries and mutations with the Bloom GraphQL API.
   <details><summary>Setup notes</summary>  
   
   - Before using, you need to log in to the back end  
   - Paste the following query into the left side  

        ```
        mutation loginUser($input:LoginInput!){login(input:$input){authToken{accessToken refreshToken expires}clientMutationId}}
        ```  

   - Expand the `QUERY VARIABLES` (bottom of the page) and enter the following json (update the username and password to a currently available account)  

        ```
        { "input":
          { "email":"user1@example.com",
            "password":"password",
            "clientMutationId":"test-id" }
        }
        ```  

   - Run the query  
   - Copy the `accessToken` value and paste it into the `Auth Token` field at the top of the page  
   - You can now run authed queries against the dev server. Explore [src/gql](src/gql/) for examples  
   - Notice that the Auth Token may expire and need to be re-logged in periodically  
   - Expanding the `History` allows you to ‘star’ queries and re-run them later.  
   </details>
- [GraphQL Voyager](https://apis.guru/graphql-voyager/) ERD style visualizer for GraphQL schema  
   <details><summary>Setup notes</summary>  

   - Open [Graph𝑖QL](https://api.dev.bloom.firstfoundry.net/graphql)  
   - Use the steps above to Log In  
   - Run the following query  

        ```
        query VoyagerIntrospectionQuery{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}
        ```  

   - Copy the result json  
   - Open [GraphQL Voyager](https://apis.guru/graphql-voyager/)  
   - Click “Custom Schema” and paste the introspection json  
   - Click “Change Schema” to render the graph  
   </details>
- [lodash](https://lodash.com/docs) - lots of functional utility methods for JS
- [recompose](https://github.com/acdlite/recompose) - reusable functional utilities for React
- [date-fns](https://date-fns.org/docs) for managing dates and times (faster and leaner than moment)
- [Linear Icons](https://linearicons.com/) - this is our preferred icon library
- [Jest](https://jestjs.io/) - test runner and expectation library
- [enzyme](http://airbnb.io/enzyme/) - react specific unit/integration test utils
- [eslint](https://eslint.org/) - provides linting for project javascript
- [stylelint](https://stylelint.io/) - provides linting for project css (styled-components)
- [JSDoc](http://usejsdoc.org/) - used to document reusable implementations in code
- [First Foundry Wiki (Confluence)](https://jira.firstfoundry.net/wiki/display/BLOOM/Engineering+Home) - company wide engineering documentation
