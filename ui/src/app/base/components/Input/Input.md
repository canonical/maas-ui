## Text input

```jsx
<Input
  type="text"
  id="exampleTextInput2"
  placeholder="example@canonical.com"
  label="Email address"
/>
```

## Stacked

```jsx
<Input
  type="text"
  id="exampleTextInput3"
  placeholder="example@canonical.com"
  stacked={true}
  label="Email address"
/>
```

## Disabled

```jsx
<Input
  type="text"
  id="exampleTextInput4"
  placeholder="example@canonical.com"
  disabled={true}
  label="Email address"
/>
```

## Error

```jsx
<Input
  type="text"
  id="exampleTextInput5"
  placeholder="example@canonical.com"
  error="This field is required."
  label="Email address"
/>
```

## Success

```jsx
<Input
  type="text"
  id="exampleTextInput6"
  placeholder="example@canonical.com"
  success="Verified."
  label="Email address"
/>
```

## Caution

```jsx
<Input
  type="text"
  id="exampleTextInput7"
  placeholder="example@canonical.com"
  caution="No validation is performed in preview mode."
  label="Email address"
/>
```

## Required

```jsx
<Input
  type="text"
  id="exampleTextInput8"
  placeholder="example@canonical.com"
  required={true}
  label="Email address"
/>
```

## Checkbox

```jsx
<Input
  type="checkbox"
  id="checkExample12"
  defaultChecked={true}
  label="HTML"
/>
<Input type="checkbox" id="checkExample22" label="CSS" />
<Input type="checkbox" id="checkExample32" disabled="disabled" label="PHP" />
```

## Radio button

```jsx
<Input
  label="Linux"
  type="radio"
  name="RadioOptions"
  id="Radio12"
  defaultValue="option1"
  defaultChecked={true}
/>
<Input
  label="Mac OS"
  type="radio"
  name="RadioOptions"
  id="Radio22"
  defaultValue="option2"
/>
<Input
  label="Windows"
  type="radio"
  name="RadioOptions"
  id="Radio42"
  defaultValue="option4"
  disabled="disabled"
/>
```
