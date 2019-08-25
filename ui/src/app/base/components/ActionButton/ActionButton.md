### Default

```jsx
<ActionButton appearance="positive">Click me!</ActionButton>
```

### Loading

```jsx
<ActionButton appearance="positive" loading>
  Click me!
</ActionButton>
```

### Success

```jsx
initialState = { success: false };
<>
  <ActionButton
    appearance="positive"
    loading={!state.success}
    success={state.success}
    success
  >
    Click me!
  </ActionButton>
  <ActionButton onClick={() => setState({ success: true })}>
    Click this button to transition to success state
  </ActionButton>
</>;
```
