import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";

const Notfound: FunctionalComponent = () => {
  return (
    <div
      style={{
        padding: "0 5%",
        margin: "100px 0",
      }}
    >
      <h1>Error 404</h1>
      <p>That page doesn&apos;t exist.</p>
      <Link href="/">
        <h4>Back to Home</h4>
      </Link>
    </div>
  );
};

export default Notfound;
