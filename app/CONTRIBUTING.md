# Bloom Portal Contributing Guidelines

This is a living document.  See ticket [BLOOM-1641](https://jira.firstfoundry.net/browse/BLOOM-1641) for details.

# Getting Started

Before contributing to bloom-portal repository, please review the following documents.

- [README](./README.md) - project setup instructions and useful information
- [Frontend Resources](https://jira.firstfoundry.net/wiki/pages/viewpage.action?spaceKey=FF&title=Frontend+Web+Developer+Resources) - guidelines, good practices, and additional resources for frontend developers; useful for all frontend projects.
- [Bloom Portal Onboarding](https://jira.firstfoundry.net/wiki/pages/viewpage.action?spaceKey=BLOOM&title=Portal+Onboarding+Information) - bloom-portal specific information for people new to project.

# Code of Conduct

While working on bloom-portal (or any team-based project at FF), it's important to be considerate of fellow teammates, project stakeholders, and customers (i.e. everyone involved!).  In order to provide a welcoming environment that encourages continual learning and quality work, we should adhere to our code of conduct:

TODO: Until we have a FF policy document, use code of conduct from JS Foundation as guideline.
https://js.foundation/community/code-of-conduct

If you have any issues or need to report a violation, please email Sam Williams (sam.williams@firstfoundry.co) and Rob Sampson (rob@firstfoundry.co).

# Project Hygiene

See: https://jira.firstfoundry.net/wiki/display/FF/Frontend+Web+Developer+Resources#FrontendWebDeveloperResources-FrontendProjectHygiene,Testing,&CodeReviewResponsibilities

As we grow and make updates to project code & dependencies, our process and conventions can adapt.

## Linting & Static Analysis

- We use [`eslint`](https://eslint.org/) for project code/style linting and other automated static analysis checks for CI.
- We extend the [`eslint-config-airbnb`](https://www.npmjs.com/package/eslint-config-airbnb) linting rules.
- Prefer to use default rules when extending any default/opinionated ESLint config.  Otherwise, discuss changes to configuration in Slack and PRs to ensure team buy-in.
- Our goal with linting (and/or code formatting) is to reduce mental overhead for developers while automating verification of stylistic details. This helps facilitate code reviews, avoids unnecessary merge conflicts, and generally improves developer experience over time.
- We've discussed future updates to TypeScript, but we currently use [`prop-types`](https://github.com/facebook/prop-types) to dynamically type React Component props.  ESlint is generally setup to enforce good practices.
- We use [`eslint-plugin-graphql`](https://github.com/apollographql/eslint-plugin-graphql) to validate our GQL code (Queries, Mutations, Subscriptions). See [`README.md`](./README.md) comment on `yarn schema` script for more information.
- If you would like to propose a change to linting rules, discuss alternate "default" configurations, or have a question about the existing configuration, feel free to open a PR or discuss in "bloom-portal" Slack channel.
- When making lint rule changes (especially while performing dependency upgrades or removing custom config overrides), try to isolate a single rule change to 1 PR (unless changes are small or low risk of merge conflict). When changing rules, we're often required to change legacy code to match new configuration, so good to be careful and work one step at a time.

## Merging and Backmerging

- Please review the [Merging guidelines](https://jira.firstfoundry.net/wiki/display/BLOOM/Merging+and+Backmerging+in+Bloom) carefully before merging or backmerging.

## Code (Peer) Reviews

- As we scale our team and project, code review standards can adapt to meet our needs.  Changes to process, standards and conventions are documented here.  All team members have a say, and in cases of disagreement we should aim for "team majority buy-in." Reference the [bloom portal immortal ticket](https://jira.firstfoundry.net/browse/BLOOM-1452) when creating PRs to change this document, or other non-code affecting changes.
- Code reviews should be treated as collaborative process.  Our CI process enforces some type of peer review before merging pull requests into `master` branch (in addition to static analysis checks and automated tests).
- While code reviews provide ways to facilitate teamwork and share knowledge, at the end of the day they are not intended to spread the burden of accountability - if you don't feel confident that your code is tested and well reviewed, you shouldn't merge it just because the PR got approved.  Ask for help when you need it, even you just need a [rubber duck](https://rubberduckdebugging.com/) :)
- As humans, it's not always comfortable to ask questions out in the open on PRs like this, or to give and receive constructive criticism.  However, as long as our project and personal goals are aligned, it's the best way for everyone to learn from each other and share information across team to help avoid siloing of knowledge.
- Ensuring that we have multiple sets of eyes on a change in repository can help reduce the occurrence of bugs, spot improvement & teaching opportunities, or discuss alternate implementations to help with project maintenance. 
- When addressing a task, provide the link to the Jira Ticket in the PR description. (TODO: some discussion has happened around other task management tools, like Trello or Clubhouse... not sure if that would effect this?)
- Providing relevant documentation links in PR description helps to reduce mental overhead for team members and reviewers.
- For UI/UX-heavy PRs, include screenshots and/or animated screen captures of your test case(s) (using something like [licecap](https://www.cockos.com/licecap/)). This helps to provide context for reviewers.
- It's often helpful to briefly annotate your own code or ask for feedback on implementation/design on the PR before reviewers take a look.  This helps guide reviewers towards areas of code that may need extra attention, or help others provide feedback or ideas for improvement.
- Try to leave PRs open long enough for team to review and discuss. In turn, aim to review each others code daily (as time permits) so that we can keep things moving and nothing grows too stale.
- If you have a PR that has been sitting for a day or two (or more) and need a review (or re-review), use `bloom-portal` slack channel to remind team.  If not immediately, someone will see and can hop in to help.
- If requesting code changes or responding to requested code changes, include a numbered list of each request/response.

### Label Usage

- Needs Review - The PR needs another developer to add a review (i.e. approve or reject/request changes on the PR)
  - Added by the PR author when opening the PR for the first time, or making change requests
  - Removed by a PR reviewer if they are adding the Change request label and the PR does not require additional review (e.g. if the PR has the Second Look label and has only been reviewed by 1 developer)
- Change Requested - The PR has pending changes requested by a reviewer
  - Added by a PR reviewer of the PR when they would like the author to make changes requested in their review
  - Removed by the PR author if they have made all Change Requests
- Approved - The PR has been Approved, and contains no pending change requests
  - Added by a PR reviewer if they are approving the PR and there are no other pending change requests from other reviewers 
- Second Look - The PR should have 2 reviewers approve the PR before it is officially approved
  - Added by the PR author if they wish to have 2 reviews
  - Added by a PR reviewer if they have reviewed or plan to review the PR and would like another developer to review it also
- Optional Suggestions - There are 1 or more optional suggestions on the PR to consider
  - Added by a PR reviewer if they have left optional suggestions on the PR
- HOLD Merge - Do not merge the PR until this label is removed (even if the PR has been approved)
- Work in Progress - The PR is not for a formal ready for review, and is a work in progress.  
  - Added by the PR author to share progress on the branch and/or invite discussion.
  - Added by the PR author because the PR was made prematurely and the author has realized there is still more work to be implemented before it is ready to be reviewed.

## Testing

TODO: In progress, discuss! :)

As frontend projects mature, it can be helpful to enforce some rules surrounding automated tests and reusable code.  We should never "write tests for the sake of having tests," but realize that they can become a really powerful tool for ensuring stability of service while allowing for continual modification and improvement of the product.

We're currently looking to expand our unit tests for code under `/src/utils` at the moment.  These utilities are often reused, so small changes to them can sometimes affect the application unexpectedly.  By working towards covering these methods with unit tests, it allows team members to not only feel confident that the code works as described, but can be more easily refactored in future to accommodate needs of project if needed.

Code under `/src/store` should usually be unit tested.  This code houses our redux store implementation, so if unfamiliar about how to write tests for redux reducers, action creators, selectors, or middleware, ask for help :).  A useful utility we've written that can help write tests for basic redux module code is [`reduceStates`](https://github.com/firstfoundry/redux-foundry/blob/master/API.md#exp_module_core--reduceStates) from our internal `redux-foundry` libray of reusable redux/react reducers and other utils.

We would also like to expand upon Component unit tests (*.spec.js files) for code under `src/components/common`. Unit & Integration testing for these components can sometimes grow complex, so we should usually start with the basic, most useful tests, and expand upon them when encountering bugs or refactoring.

A good first test for any "stateless, presentational" common component is a _"does it render given expected (or default) props?"_ test. You should use enzyme's [Shallow Rendering API](https://airbnb.io/enzyme/docs/api/shallow.html) util method for these.

A good second round of tests for any "stateless, presentational" common component is a [snapshot test](https://jestjs.io/docs/en/snapshot-testing).  These can help guard against unexpected style, markup, or layout changes, especially for components where design isn't expected to change often.

As we go, we can consider expanding upon tests as needed for more complex stateful components, app reusable HOCs & Hooks, feature specific HOCs & Hooks, redux code, apollo links, etc. We can also use enzyme's [Full Rendering API](https://airbnb.io/enzyme/docs/api/mount.html) for Component based integration tests.  However, in order to do that, there will likely be some required refactor tasks and npm upgrades as well.  For now we're mainly focused on the lowest cost/effort UI testing techniques as we move out of pre-MVP/prototype phase and towards early alpha stages.

If you are familiar with (or would like to practice) TDD, feel free to use as you see fit :).  I've found TDD can be most helpful for redux or other non-visual-component-based code, but can also sometimes be helpful for reusable component design.

TODO: Our integration and e2e testing systems still need some more work before we begin to really expand or rely upon those beyond the basics.

TODO: discuss "test routes" and adding documentative testing fixtures for things like 3rd party library integrations or in-progress features?

# Project Conventions

The following rules are "good practice" to follow for bloom-portal code.

TODO: Find a good React/GQL/Apollo style-guide from Open Source community to use as general guideline or starting point?

## Using "TODO" Comments

Writing TODO comments for yourself and teammates can help serve as reminder of some tech and/or design debt we may be adding to the project, but don't want to break workflow on current task or don't have enough information to make an implementation decision. Ideally, we'd like to remove these before the PR is merged, but not always reasonable to do so if work is too far out of scope of current task.

TODO: Discuss... TODOs! :)

## 3rd Party Libraries (npm)

- When adding or upgrading new dependencies, try to isolate the `package.json` and `yarn.lock` changes into a single PR. Sometimes, updating one dependency may require an upgrade for others or altering project code, so try to do the minimum work necessary to perform the upgrade, before creating new PRs that utilize new functionality.
- When adding a new dependency, we should discuss in PR to make sure it satisfies design requirements and whether or not we need it.  Adding dependencies always incurs some amount of tech and/or design debt, same as custom code.
- We should make sure to do our research and experimentation before adding a new dependency.  It's helpful to determine what other options are available and if a custom solution would be simpler or better suited for our use-case(s).
- We should periodically check for updates for 3rd party dependencies (especially ones we use heavily). Good practice is to try to keep dependencies reasonably up-to-date and get in the habit of upgrading fairly often.  It's good to be able to easily upgrade for bug fixes, security patches and other improvements. The further out of date we get the harder it becomes to upgrade when needed.
- We should also periodically "prune" our dependencies (as time permits) if we are no longer or unnecessarily using some.
- For MAJOR version npm upgrades (especially for core libs like React, Apollo, styled-components, linters, type systems, etc) we should discuss with team as needed in slack and meetings.  Plan on allowing additional time for code review and regression testing after performing upgrade.
- For MINOR or PATCH version changes, up to team discretion as to when to upgrade (unless proven problematic during developer testing).  These are usually lower risk, and mainly effect bug/security fixes or quality of life improvements for devs.
- For ANY npm upgrade, it's helpful to remind team to `yarn install` in slack after they pull in latest once your changes are merged into master branch.

## Modules

- Every JS file and folder under `/src` folder represents an [ES Module](http://exploringjs.com/es6/ch_modules.html).
- By convention, we often create a new module as a single file, and define default and/or named exports for use by other modules. As a project and its modules grow large, it helps to refactor code and split functionality across multiple files to separate concerns, reduce duplication, facilitate code reviews & collaboration, and promote testability & reusability.
- When creating a module _folder_, use an `index.js` file to define the module's [public interface](https://alligator.io/react/index-js-public-interfaces/). Bloom portal leverages [react-scripts](https://www.npmjs.com/package/react-scripts), which is setup to reference `index.js` when importing from a module folder's root location.  This helps to promote unit testing within a module and integration testing as a whole.  It also helps team members to know what functionality is intended to be used by external modules.
- Good practice is to simplify and encapsulate all necessary functionality needed by external modules to your module's public interface (and hide the rest).  Internal module exports not re-exported by public interface (or otherwise used by `index.js`) should only be used for debugging and testing purposes.

**NOTE:**
There's an issue with Webpack devserver when we convert a file into a module folder of the same name (e.g. `/Foo.js` -> `/Foo`).  Webpack's bundler and hot-loader has trouble determining the underlying change to the file system.  We're still looking into a nice solution... one option may be to import explicitly with full path (i.e. `/Foo/index.js`) instead of using [node convention](https://nodejs.org/api/modules.html#modules_folders_as_modules).  If we to do this as a refactor step and run into an error, the easy fix is to stop devserver (e.g. `ctrl-c`) and restart (`yarn start`).

## Mockups and Design Tools

### Zeplin
https://zeplin.io/

Original portal mockups exist in Zeplin.

TODO: Need someone more familiar with this to flesh this section out :).  See John for details.

### Storybook
https://storybook.js.org/

TODO: I was thinking of trying some experiments with "storybook" or other similar designer-friendly tools.  We don't use this currently, but jotting note here in case anyone wants to try out latest version (v5).

## React
https://reactjs.org/

### React HOCs
https://reactjs.org/docs/higher-order-components.html

**In most situations, use the `with*` naming convention when defining a HOC:**
```
// e.g.
const withMyHigherOrderComponent = /* ... */
```
_**Why?** Helps for code/file scanning and understanding of purpose._

**Use `compose` method (from redux, apollo or recompose libs) when composing HOCs to create new ones (e.g.)**
```javascript
// e.g.
import { compose, withState, withProps } from 'recompose'
const withMyStuff = compose(
  withState('foo', 'setFoo', null),
  withProps(({ foo }) => ({ bar: foo || 'bar' }))
)
```
_**Why?** Helps promote consistency across module files._

### React Hooks
https://reactjs.org/docs/hooks-reference.html

**Use `use*` naming convention when defining a Hook:**
```javascript
// e.g.
const useMyHook = /* ... */
```
_**Why?** Helps for code/file scanning and understanding of purpose._

### prop-types

TODO: discuss conventions for PropTypes? Or just rely on AirBnB default lint configuration?

## Redux
https://redux.js.org/

This project uses Redux for a few things (auth token, state-sync to localStorage, global app features, etc). Otherwise, global server data cache is managed by Apollo. For information on the redux code and organization, see the following document:
https://jira.firstfoundry.net/wiki/pages/viewpage.action?pageId=13697489

## Apollo (react-apollo)
https://www.apollographql.com/docs/react/

**Prefer use of `graphql` HOC from `react-apollo`, over `Query`, `Mutation`, or `Subscription` Components.**
```javascript
// e.g.
import { graphql } from 'react-apollo'
```
_**Why?** Helps promote consistency across module files. Helps facilitate future migration to React Hooks._
