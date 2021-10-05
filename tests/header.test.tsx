import { h } from "preact";
import Header from "../src/components/Header";
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { shallow } from "enzyme";

describe("Initial Test of the Header", () => {
  test("Header renders 3 nav items", () => {
    const context = shallow(<Header />);
    expect(context.find("h1").text()).toBe("Stopwatch");
    expect(context.find("Link").length).toBe(3);
  });
});
