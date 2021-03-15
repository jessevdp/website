import Two from "./vendor/two.js"

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

class Circle {

  constructor(two) {
    this.x = 0
    this.y = 0

    this.two = two
    this.shape = two.makeCircle(this.x, this.y, 200)
    this.shape.scale = 0 
    this.shape.fill = "coral"
    this.shape.noStroke()
  }

  animate() {
    let speed = 0.0075

    if (this.shape.scale < 1) {
      this.shape.scale += 1 * speed
    }
    if (this.shape.opacity > 0) {
      this.shape.opacity -= (3/4) * speed 
    }
  }

  reset() {
    this.shape.scale = 0
    this.shape.opacity = 1
  }

  isDone() {
    return this.shape.scale >= 1 && this.shape.opacity <= 0
  }

  reposition() {
    this.shape.translation.y = this.y
    this.shape.translation.x = (this.two.width / 2) + this.x
  }

}

var c = new Circle(two)
c.x = -250
c.y = 250
c.reposition()

//var circle = two.makeCircle(two.width / 2, two.height / 2, 200)
//circle.scale = 0 
//circle.fill = "lightgreen"
//circle.noStroke()
//
two.bind("resize", () => {
//  circle.translation.x = two.width / 2
//  circle.translation.y = two.height / 2
  c.reposition()
})

two.bind("update", function () {
//  if (circle.scale < 1) {
//    circle.scale += 0.01
//  }
//  if (circle.opacity > 0) { 
//    circle.opacity -= 0.0075
//  } 
//  if (circle.scale >= 1 && circle.opacity <= 0) {
//    circle.scale = 0
//    circle.opacity = 1
//  }
  if (c.isDone()) {
    c.reset()
    return
  }
  c.animate()
})

