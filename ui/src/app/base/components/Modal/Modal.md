```jsx
// This containing div is only required for the component demo.
<div style={{ height: "100vh", position: "relative" }}>
  <Modal close={() => {}} title="Confirm delete">
    <p>
      Are you sure you want to delete user "Simon"? This action is permanent and
      can not be undone.
    </p>
    <hr />
    <div className="u-align--right">
      <button onClick={() => {}} className="u-no-margin--bottom">
        Cancel
      </button>
      <button className="p-button--negative u-no-margin--bottom">Delete</button>
    </div>
  </Modal>
</div>
```
