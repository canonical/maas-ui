### Default

```jsx
<Notification close={() => {}}>
  We use cookies to improve your experience. By your continued use of this site
  you accept such use.
</Notification>
```

### Caution

```jsx
<Notification type="caution" status="Blocked:">
  Custom storage configuration is only supported on Ubuntu, CentOS and RHEL.
</Notification>
```

### Negative

```jsx
<Notification type="negative" status="Error:">
  Node must be connected to a network.
</Notification>
```

### Positive

```jsx
<Notification type="positive" status="Success:">
  Code successfully reformatted.
</Notification>
```

### Information

```jsx
<Notification type="information" status="Information:">
  Anyone with access can view your invited users.
</Notification>
```
