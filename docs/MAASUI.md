# MAAS UI

## Content
  - [Usability](#usability)
  - [Code structure](#code-structure)
  - [React](#react)
    - [Hooks](#hooks)
    - [Components](#components)
      - [Forms](#forms)
    - [Vanilla components](#vanilla-components)
    - [Redux](#redux)
      - [Redux Toolkit](#redux-toolkit)
      - [Reselect](#reselect)
      - [Redux-Saga](#redux-saga)
    - [TypeScript](#typeScript)
      - [TSFixMe](#tsfixme)
    - [Testing](#testing)
      - [Test attributes (OUTDATED)](#test-attributes)
      - [Model factories](#model-factories)
    - [Coding style](#coding-style)
      - [ES6](#es6)
      - [Prettier](#prettier)
  - [Proxy](#proxy)
  - [End-to-end](#end-to-end)
    - [Cypress](#cypress)
    - [Playwright](#playwright)

## Usability

Our unofficial policy on responsive design in MAAS-UI is that everything should be clearly visible on all screen sizes, but it doesn't necessarily have to be the most visually appealing on small screens.
Only a small percentage of users interact with the MAAS client on mobile devices, but it's not uncommon for people to use it on one half of their monitor viewport.

## Code structure

The high-level interactions between the React side of the frontend and the API are illustrated below.

![code-structure](https://user-images.githubusercontent.com/47540149/214085014-a48a1645-afb0-434b-b5e9-07ae798c571a.png)


## React

### Hooks

We use React >v17.0.0 which has support for [React hooks](https://reactjs.org/docs/hooks-intro.html). While it’s still possible to write components using the class syntax, all new components should be function components that use state hooks where appropriate.

### Components

Components should be created with TypeScript and MAAS-UI does not use class components, instead it uses function components.

The app directories are split by top level nav items e.g. /machines corresponds to \`[app/machines](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/machines)\`. Components that are reusable or shared between pages live in \`[app/base](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/base)\`.

Each of these directories contain a `./components` and `./views` directory.

Views are components that relate to a sub url (e.g. /machine/:id would point to [app/machines/views/MachineDetails](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/machines/views/MachineDetails)). Contained within the view directories are any additional components, forms etc. related to the view.

Components that are shared between multiple views (within the same top level route) live in `./components`. Consider if that component might be used by other areas of the app, and if it will then it should live in \`[app/base/components](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/base/components)\`.

#### Forms

We use a set of components, such as FormikForm, FormikField for building forms which are built on top of [Formik](https://github.com/jaredpalmer/formik).

### Vanilla components

Many of the Vanilla components have React implementations which you can find in the [react-components](https://github.com/canonical-web-and-design/react-components/) project. There are [online docs](https://canonical-web-and-design.github.io/react-components/) for these components.

If you need a vanilla component that does not already exist, first implement it in MAAS-UI and then propose it to the react-components repo.

### Redux

We use [Redux](https://redux.js.org/introduction/getting-started) as our state-management tool. To put it briefly, Redux is responsible for storing all the app-wide state (in the “store”) and provides a predictable methodology for changing that state. The normal flow is this: an action is dispatched, and as a consequence, some state is changed via a reducer function. Actions can be dispatched directly by the user from the UI, or elsewhere (e.g. a server).

![redux](https://user-images.githubusercontent.com/47540149/214085476-46535bee-cc9d-407e-a569-90014ab7f7b2.png)

We also use some libraries/middleware to help with certain functions:

- [Redux Toolkit](https://redux-toolkit.js.org/), for reducing the boilerplate that usually comes with Redux projects.
- [Reselect](https://github.com/reduxjs/reselect), for computing and retrieving derived data from the Redux store.
- [Redux-Saga](https://redux-saga.js.org/), for handling actions which lead to side effects (e.g. async API calls).

#### Redux Toolkit

MAAS-UI uses [Redux Toolkit](https://redux-toolkit.js.org/) to create actions and reducers for each MAAS model.

The [store directory](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/store) (roughly) follows the [“ducks” pattern](https://github.com/erikras/ducks-modular-redux) so that everything for a model (actions, reducers, selectors, types and utils) are together. The folder names in the store directory correspond to a model’s name as given in the websocket handlers, which is also used to name each “slice” (top level key) of the Redux state. Slices are set up in each model’s slice.ts files using [createSlice](https://redux-toolkit.js.org/api/createSlice), which defines the actions and reducers for the model.

For example, the directory at [ui/src/app/store/subnet](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/store/subnet) contains the slice for the subnet model (which defines the subnet action creators and reducers), the subnet selectors, types for the subnet model itself as well as the actions, and any utils that are intrinsically tied to the subnet model. The subnet reducers reduce the state in rootState.subnet, and the websocket methods should all be prefixed with “subnet”.

#### Reselect

When data needs to be retrieved from the store it is done through a selector. These selectors are created with [Reselect](https://github.com/reduxjs/reselect) and live within the model’s directory in the [store](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/store).

#### Redux-Saga

Redux-Saga acts as middleware between actions and reducers, allowing Redux actions to be understood by the MAAS server, and MAAS server responses to be understood by Redux. We use Redux-Saga for all of our asynchronous (HTTP and websocket) calls.

A common flow is this: an action is dispatched from a component to fetch some data, a saga intercepts that action and transforms it into a websocket message to send to the MAAS server, the saga waits until the server responds and then dispatches an action based on the response (e.g. data or error message).

The saga files can be found in [ui/src/app/base/sagas](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/app/base/sagas).

![redux-saga](https://user-images.githubusercontent.com/47540149/214086167-45b4b87a-b71d-400f-93d1-997d99681fd9.png)

### TypeScript

#### TSFixMe

There may occasionally be times where you can’t type something. In those cases you might be able to use \`any\` to handle all types. However, our linter will not let you use \`any\` directly.

We have an alias of \`any\` named: \`TSFixMe\` that you can use (it can be imported from `app/base/types`), this also helps us to recognise this is a type that needs updating in the future.

You should avoid using \`TSFixMe\` unless you really get stuck.

### Testing

As a general rule, we concentrate on user-centric testing and avoid testing implementation details. For that reason usage of test attributes such as `data-testid` should be avoided. Any occurrence of such will usually be for historical reasons.

#### Test attributes

**Note: This is an OUTDATED practice**

It is very easy to write a component test that is too general or too specific with its component selectors. Both of these cases result in fragile tests. To this end MAAS-UI uses `data-testid` attributes to provide a convenient method of finding a component.

The attribute can be applied to any component or element:

```html
<Col data-testid="content" size={7}>Content</Col>
```

Which can then be used within a test:

```javascript
expect(wrapper.find("[data-testid='content']").text()).toBe(“Content”);
```

#### Model factories

To make it easier to interact with the API models and Redux state there are factories for every model and state in [ui/src/testing/factories](https://github.com/canonical-web-and-design/maas-ui/tree/master/ui/src/testing/factories).

Factories can be combined and should only define the states required for a specific test:

```javascript
machineStateFactory({
  items: [machineFactory({ system_id: "abc123" })],
  loading: true,
});
```

### Coding style

There are many helpful tips on the web team’s [practices](https://canonical-web-and-design.github.io/practices/coding/javascript.html) page.

#### ES6

Where possible the es6 style for functions, variables etc. is preferred.

#### Prettier

MAAS-UI uses [Prettier](https://prettier.io/) for formatting. You may wish to set up your IDE to format using Prettier on save.

## Proxy

In production MAAS is served by the region controller and has no support for external authentication to the WebSocket API. To get around this, and to prevent CORS issues, the WebSocket is proxied from a local [Express proxy](https://github.com/canonical-web-and-design/maas-ui/tree/master/proxy) to an external MAAS.

You can [configure](https://github.com/canonical-web-and-design/maas-ui/blob/master/HACKING.md#edit-local-config) which MAAS you want to use with your local UI.

Note: the proxy is only used for local development and plays no part when the UI is served by MAAS.

## End-to-end

### Cypress

Most end-to-end tests are performed using [Cypress](https://www.cypress.io/). The tests are currently minimal, comprising mainly simple smoke tests that check basic functionality. The tests are performed any time a branch on the upstream repo is updated, such as when a forked PR is merged into main.

The Cypress tests run in an Ubuntu VM spun up via GitHub Actions. The relevant MAAS snap is installed on the VM, for example latest/edge in the main branch, and then Cypress tests run against this production version. The primary issue with this approach is that the changes in a PR might not make it into the snap until long after it’s merged, so it’s not until a Cypress test breaks that we can update it to match new changes to the UI. This is something we hope to address soon.

### Playwright

We use [playwright](https://playwright.dev/) for additional end-to-end testing of websocket requests, e.g. in [machines.spec.ts](https://github.com/canonical/maas-ui/blob/main/tests/machines.spec.ts).
