import Two from "./vendor/two.js"

const SPEED = 0.005
const DELAY = 1500
const INITIAL_DELAY = 3000
const CIRCLE_RADIUS = 200

const COLORS = [
  "#fea3aa",
  "#f8b88b",
  "#faf884",
  "#baed91",
  "#b2cefe",
  "#f2a2e8",
]

//#region setup

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

//#endregion

//#region lib

function random_color() {
  let i = random_int_exclusive(0, COLORS.length)
  return COLORS[i]
}

/**
 * Coordinate pair with helper methods for generating a random position and for converting between
 * screen positions and a localized coordinate space (x axis centered on the page). Coords have to
 * be stored in the "local" system because of page resizing.
 * 
 * (depends on global Two object)
 */
class Position {

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static randomScreenPosition() {
    let x_start = window.scrollX
    let x_end = x_start + window.innerWidth
    let y_start = window.scrollY
    let y_end = y_start + window.innerHeight

    let x = random_int_inclusive(x_start, x_end)
    let y = random_int_inclusive(y_start, y_end)

    return this.fromScreenPosition(x, y)
  }

  static fromScreenPosition(x, y) {
    let local_x = x - (two.width / 2)
    return new Position(local_x, y)
  }

  get screen_x() {
    return (two.width / 2) + this.x
  }

  get screen_y() {
    return this.y
  }
}

/**
 * (depends on global Two object)
 */
class AnimatedCircle {

  constructor(position, color, radius = CIRCLE_RADIUS, animation_speed = SPEED) {
    this.animation_speed = animation_speed
    this.position = position

    this.shape = two.makeCircle(position.screen_x, position.screen_y, radius)
    this.shape.scale = 0
    this.shape.fill = color
    this.shape.noStroke()
  }

  /**
   * Create a new Animated circle at a random position with a random color
   * @returns AnimatedCircle instance
   */
  static random() {
    let position = Position.randomScreenPosition()
    let color = random_color()
    return new AnimatedCircle(position, color)
  }

  animate() {
    if (this.shape.scale < 1) {
      this.shape.scale += 1 * this.animation_speed
    }
    if (this.shape.opacity > 0) {
      this.shape.opacity -= (3 / 4) * this.animation_speed
    }
  }

  get is_done() {
    return this.shape.scale >= 1 && this.shape.opacity <= 0
  }

  updatePosition() {
    this.shape.translation.x = this.position.screen_x
    this.shape.translation.y = this.position.screen_y
  }

  destroy() {
    two.remove(this.shape)
  }

}

//#endregion

//#region animation

let current = null
setTimeout(() => current = AnimatedCircle.random(), INITIAL_DELAY)

two.bind("resize", () => {
  current.updatePosition()
})

two.bind("update", function () {
  if (current == null) return

  if (current.is_done) {
    current.destroy()
    current = null
    setTimeout(() => current = AnimatedCircle.random(), DELAY)
  } else {
    current.animate()
  }
})

//#endregion

//#region helpers

function random_int_inclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random_int_exclusive(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//#endregion

