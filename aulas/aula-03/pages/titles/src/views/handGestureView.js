export default class HandGestureView {
  #canvasHands = document.querySelector('#hands')
  #canvasContext = this.#canvasHands.getContext('2d');
  #fingerLookupIndexes

  constructor({ fingerLookupIndexes }) {
    this.#canvasHands.width = globalThis.screen.availWidth
    this.#canvasHands.height = globalThis.screen.availHeight
    this.#fingerLookupIndexes = fingerLookupIndexes
  }

  clear() {
    this.#canvasContext.clearRect(0, 0, this.#canvasHands.width, this.#canvasHands.height)
  }

  drawResults(hands) {

    for (const { keypoints, handedness } of hands) {

      if (!keypoints) continue

      this.#canvasContext.fillStyle = handedness === "Left" ? "green" : "red"
      this.#canvasContext.strokeStyle = "white"
      this.#canvasContext.lineWidth = 8
      this.#canvasContext.lineJoin = "round"

      // Juntas
      this.#drawJoints(keypoints)
      // Dedos
      this.#drawFingerAndHoverElements(keypoints)

    }

  }

  #drawFingerAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookupIndexes)

    for (const finger of fingers) {
      const points = this.#fingerLookupIndexes[finger].map(index => keypoints[index])
      const region = new Path2D()
      // [0] é a palma da mão

      const [{ x, y }] = points
      region.moveTo(x, y)
      for (const point of points) {
        region.lineTo(point.x, point.y)
      }
      this.#canvasContext.stroke(region)
    }
  }

  #drawJoints(keypoints) {
    for (const { x, y } of keypoints) {

      console.log(x, y)
      this.#canvasContext.beginPath()
      const newX = x - 2
      const newY = y - 2
      const radius = 3
      const startAngle = 0
      const endAngle = Math.PI * 2

      this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle)
      this.#canvasContext.fill()

    }
  }

  loop(fn) {
    requestAnimationFrame(fn)
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: "smooth"
    })
  }

}