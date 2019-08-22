## Select

```jsx
<Select
  name="exampleSelect"
  id="exampleSelect2"
  defaultValue=""
  options={[
    { value: "", disabled: "disabled", label: "Select an option" },
    { value: "1", label: "Cosmic Cuttlefish" },
    { value: "2", label: "Bionic Beaver" },
    { value: "3", label: "Xenial Xerus" }
  ]}
  label="Ubuntu releases"
/>
```

## Select multiple

```jsx
<Select
  name="exampleSelectMulti"
  id="exampleSelectMulti2"
  options={[
    { value: "", disabled: "disabled", label: "Select..." },
    { value: "1", label: "Cosmic Cuttlefish" },
    { value: "2", label: "Bionic Beaver" },
    { value: "3", label: "Xenial Xerus" }
  ]}
  label="Ubuntu releases"
  multiple={true}
/>
```
