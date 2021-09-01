import { FunctionalComponent, Fragment, h } from "preact";
import { Link } from "preact-router/match";
import style from "./style.css";

const Header: FunctionalComponent = () => {
  return (
    <Fragment>
      <header class={style.header}>
        <h1>Stopwatch</h1>
        <nav>
          <Link activeClassName={style.active} href="/">
            Home
          </Link>
          <Link activeClassName={style.active} href="/profile">
            Me
          </Link>
          <Link activeClassName={style.active} href="/profile/john">
            John
          </Link>
        </nav>
      </header>
      <div class={style.contentSpacing} />
    </Fragment>
  );
};

export default Header;
