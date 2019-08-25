### Default

```jsx
<Card title="We'd love to have you join us as a partner.">
  If you are an independent software vendor or bundle author, it's easy to
  apply. You can find out more below.
</Card>
```

### Header

```jsx
<Card
  title="Raspberry Pi2 and Pi3"
  thumbnail="https://assets.ubuntu.com/v1/dca2e4c4-raspberry-logo.png"
>
  For fun, for education and for profit, the RPi makes device development
  personal and entertaining. With support for both the Pi2 and the new Pi3,
  Ubuntu Core supports the world’s most beloved board.
</Card>
```

### Highlighted

```jsx
<Card title="We'd love to have you join us as a partner." highlighted>
  If you are an independent software vendor or bundle author, it's easy to
  apply. You can find out more below.
</Card>
```

### Overlay

```jsx
import Row from "../Row";
import Col from "../Col";
<section
  className="p-strip--image is-light"
  style={{
    backgroundImage:
      "url('https://assets.ubuntu.com/v1/0a98afcd-screenshot_desktop.jpg')"
  }}
>
  <Row>
    <Col size="6" emptyLarge="7">
      <Card title="Web browsing" overlay>
        Renowned for speed and security, Ubuntu and Firefox make browsing the
        web a pleasure again. Ubuntu also includes Chrome, Opera and other
        browsers that can be installed from the Ubuntu Software Centre.
      </Card>
    </Col>
  </Row>
</section>;
```
