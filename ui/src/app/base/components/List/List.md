## Default

```jsx
<List items={["Digital signage", "Robotics", "Gateways"]} />
```

## Ticked

```jsx
<List
  items={[
    "Hardware guidance and sizing",
    "Fixed-price deployment",
    "Reference architecture"
  ]}
  ticked={true}
/>
```

## Horizontal divider

```jsx
<List
  items={[
    "Single-command install and upgrade",
    "Postgres database for reliable state",
    "High availability for all services"
  ]}
  divided={true}
/>
```

## Ticked with horizontal divider

```jsx
<List
  items={[
    "Balance compute load in the cloud",
    "Optimise for specific workloads",
    "Assess overcommit ratios"
  ]}
  divided={true}
  ticked={true}
/>
```

## Inline

```jsx
<List items={["Community", "Careers", "Press centre"]} inline={true} />
```

## Middot

```jsx
<List
  items={["Legal information", "Data privacy", "Report a bug on this site"]}
  middot={true}
/>
```

## Vertical stepped

```jsx
<List
  items={[
    {
      title: "Log in to JAAS",
      content:
        "Ensure you have an Ubuntu SSO account before contacting JAAS. Log in to JAAS now."
    },
    {
      title: "Configure a model",
      content:
        'Applications are contained within models and are installed via charms. Configure your model by pressing the "Start a new model" button.'
    },
    {
      title: "Credentials and SSH keys",
      content:
        "After having selected a cloud, a form will appear for submitting your credentials to JAAS. The below resources are available if you need help with gathering credentials."
    }
  ]}
  stepped={true}
/>
<List
  items={[
    {
      title: "Log in to JAAS",
      content:
        "Ensure you have an Ubuntu SSO account before contacting JAAS. Log in to JAAS now.",
      titleElement: "h4"
    },
    {
      title: "Configure a model",
      content:
        'Applications are contained within models and are installed via charms. Configure your model by pressing the "Start a new model" button.',
      titleElement: "h4"
    },
    {
      title: "Credentials and SSH keys",
      content:
        "After having selected a cloud, a form will appear for submitting your credentials to JAAS. The below resources are available if you need help with gathering credentials.",
      titleElement: "h4"
    }
  ]}
  stepped={true}
/>

```

## Horizontal stepped

```jsx
<List
  items={[
    {
      title: "Log in to JAAS",
      content:
        "Ensure you have an Ubuntu SSO account before contacting JAAS. Log in to JAAS now."
    },
    {
      title: "Configure a model",
      content:
        'Applications are contained within models and are installed via charms. Configure your model by pressing the "Start a new model" button.'
    }
  ]}
  stepped={true}
  detailed={true}
/>
```

## Split

```jsx
<List
  items={[
    "Jointly shape the OpenStack architecture",
    "We help you plan your cloud hardware requirements",
    "We build OpenStack in your data center",
    "We operate the cloud to an SLA",
    "Transparent audit, logging, monitoring and management",
    "When your team is ready, we hand over the keys"
  ]}
  divided={true}
  split={true}
  ticked={true}
/>
```
