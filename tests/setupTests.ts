import * as enzyme from "enzyme";
import Adapter from "enzyme-adapter-preact-pure";

enzyme.configure({
  adapter: new Adapter(),
});
