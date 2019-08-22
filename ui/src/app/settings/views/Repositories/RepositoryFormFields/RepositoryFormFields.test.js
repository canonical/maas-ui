import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import RepositoryFormFields from "./RepositoryFormFields";

const mockStore = configureStore();

describe("RepositoryFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    arches: ["i386", "amd64"],
    components: "",
    default: false,
    disable_sources: false,
    disabled_components: [],
    disabled_pockets: [],
    distributions: "",
    enabled: true,
    key: "",
    name: "",
    url: ""
  };

  beforeEach(() => {
    baseFormikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      initialValues: { ...baseValues },
      setStatus: jest.fn(),
      touched: {},
      values: { ...baseValues }
    };
    initialState = {
      general: {
        componentsToDisable: {
          data: [],
          loaded: true,
          loading: false
        },
        knownArchitectures: {
          data: [],
          loaded: true,
          loading: false
        },
        pocketsToDisable: {
          data: [],
          loaded: true,
          loading: false
        }
      },
      packagerepository: {
        errors: {},
        loading: false,
        loaded: true,
        saved: false,
        saving: false,
        items: [
          {
            id: 1,
            created: "Fri, 23 Aug. 2019 09:17:44",
            updated: "Fri, 23 Aug. 2019 09:17:44",
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            distributions: [],
            disabled_pockets: ["security"],
            disabled_components: ["universe", "restricted"],
            disable_sources: true,
            components: [],
            arches: ["amd64", "i386"],
            key: "",
            default: true,
            enabled: true
          },
          {
            id: 2,
            created: "Fri, 23 Aug. 2019 09:17:44",
            updated: "Fri, 23 Aug. 2019 09:17:44",
            name: "ports_archive",
            url: "http://ports.ubuntu.com/ubuntu-ports",
            distributions: [],
            disabled_pockets: [],
            disabled_components: [],
            disable_sources: true,
            components: [],
            arches: ["armhf", "arm64", "ppc64el", "s390x"],
            key: "",
            default: false,
            enabled: true
          }
        ]
      }
    };
  });

  it("displays disitribution and component inputs if type is repository", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };

    let wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );
    expect(wrapper.find("input[name='distributions']").exists()).toBe(true);
    expect(wrapper.find("input[name='components']").exists()).toBe(true);

    wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="ppa" />
      </Provider>
    );
    expect(wrapper.find("input[name='distributions']").exists()).toBe(false);
    expect(wrapper.find("input[name='components']").exists()).toBe(false);
  });

  it("displays disabled pockets checkboxes if repository is default", () => {
    const state = { ...initialState };
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.default = false;
    formikProps.values.disabled_pockets = ["updates"];

    let wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );
    expect(wrapper.find("Input[name='disabled_pockets']").length).toBe(0);

    formikProps.values.default = true;
    wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );
    expect(wrapper.find("Input[name='disabled_pockets']").length).toBe(3);
  });

  it("displays disabled components checkboxes if repository is default", () => {
    const state = { ...initialState };
    state.general.componentsToDisable.data = [
      "restricted",
      "universe",
      "multiverse"
    ];
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.default = false;
    formikProps.values.disabled_components = ["universe"];

    let wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );
    expect(wrapper.find("Input[name='disabled_components']").length).toBe(0);

    formikProps.values.default = true;
    wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );
    expect(wrapper.find("Input[name='disabled_components']").length).toBe(3);
  });

  it("correctly reflects repository name", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.name = "repo-name";

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(wrapper.find("Input[name='name']").props().value).toBe("repo-name");
  });

  it("correctly reflects repository url", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.url = "fake.url";

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(wrapper.find("Input[name='url']").props().value).toBe("fake.url");
  });

  it("correctly reflects repository key", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.key = "fake-key";

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(wrapper.find("Textarea[name='key']").props().value).toBe("fake-key");
  });

  it("correctly reflects repository enabled state", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.enabled = false;

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(
      wrapper
        .find("Input[name='enabled']")
        .at(0)
        .props().checked
    ).toBe(false);
  });

  it("correctly reflects repository disable_sources state by displaying the inverse", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.disable_sources = false;

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(
      wrapper
        .find("Input[name='disable_sources']")
        .at(0)
        .props().checked
    ).toBe(true);
  });

  it("correctly reflects repository arches", () => {
    const state = { ...initialState };
    state.general.knownArchitectures.data = ["amd64", "i386", "ppc64el"];
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.arches = ["amd64", "ppc64el"];

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(wrapper.find("Input[name='arches']").length).toBe(3);
    expect(wrapper.find("Input[value='amd64']").props().checked).toBe(true);
    expect(wrapper.find("Input[value='i386']").props().checked).toBe(false);
    expect(wrapper.find("Input[value='ppc64el']").props().checked).toBe(true);
  });

  it("correctly reflects repository disabled_pockets", () => {
    const state = { ...initialState };
    state.general.pocketsToDisable.data = ["updates", "security", "backports"];
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.default = true;
    formikProps.values.disabled_pockets = ["updates"];

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(wrapper.find("Input[value='updates']").props().checked).toBe(true);
    expect(wrapper.find("Input[value='security']").props().checked).toBe(false);
    expect(wrapper.find("Input[value='backports']").props().checked).toBe(
      false
    );
  });

  it("correctly reflects repository disabled_components", () => {
    const state = { ...initialState };
    state.general.componentsToDisable.data = [
      "restricted",
      "universe",
      "multiverse"
    ];
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    formikProps.values.default = true;
    formikProps.values.disabled_components = ["universe"];

    const wrapper = mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(wrapper.find("Input[value='restricted']").props().checked).toBe(
      false
    );
    expect(wrapper.find("Input[value='universe']").props().checked).toBe(true);
    expect(wrapper.find("Input[value='multiverse']").props().checked).toBe(
      false
    );
  });

  it("can set error status", () => {
    const state = { ...initialState };
    state.packagerepository.errors = {
      name: ["Name already exists"]
    };
    const store = mockStore(state);
    const formikProps = { ...baseFormikProps };
    mount(
      <Provider store={store}>
        <RepositoryFormFields formikProps={formikProps} type="repository" />
      </Provider>
    );

    expect(formikProps.setStatus).toHaveBeenCalled();
  });
});
