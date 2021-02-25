import Two from "./vendor/two.js"

// import Two from "two.js"

const wrapper = document.getElementById("js-background-animation")

const settings = {
  type: Two.Types.svg,
  autostart: true,
  width: wrapper.offsetWidth,
  height: wrapper.offsetHeight,
}

const two = new Two(settings).appendTo(wrapper)

window.addEventListener("resize", () => {
  const canvas = wrapper.querySelector("svg").getBoundingClientRect()
  if (canvas.width !== wrapper.offsetWidth || canvas.height !== wrapper.offsetHeight) {
    two.renderer.setSize(wrapper.offsetWidth, wrapper.offsetHeight)
  }
})

// ===============
//  drawing
// ===============

var rect = two.makeRectangle(two.width / 2, two.height / 2, 50, 50);
rect.fill = "lightgreen"
rect.stroke = null

two.bind("resize", () => {
  rect.translation.x = two.width / 2
  rect.translation.y = two.height / 2
})

two.bind("update", function () {
  rect.rotation += 0.01;
});


