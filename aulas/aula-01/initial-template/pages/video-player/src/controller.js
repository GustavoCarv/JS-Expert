export default class Controller {
    #view
    #worker
    #camera
    #blinkCounter = 0

    constructor({ view, worker, camera }) {
        this.#view = view;
        this.#worker = this.#configureWorker(worker)
        this.#camera = camera;
        this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    }

    static async initialize(deps) {
        const controller = new Controller(deps)

        controller.log('Not detecing eye blink. Click on button to initialize')

        return controller.init()
    }

    #configureWorker(worker) {
        let ready = false

        worker.onmessage = ({data}) => {
            if (data === 'READY') {
                this.#view.enableButton()
                ready = true
                return
            }

            const blinked = data.blinked
            this.#blinkCounter += blinked
            this.#view.togglePlayVideo()
            console.log('blinked', blinked)
        }


        return {
            send(message) {
                if (!ready) return

                worker.postMessage(message)
            }
        }
    }

    async init() {
    }

    loop() {
        const video = this.#camera.video
        const img = this.#view.getVideoFrame(video)
        this.#worker.send(img)
        this.log('detecting eye blink ...')

        setTimeout(() => this.loop(), 100)
    }

    log(text) {
        const times = `    - blikend times: ${this.#blinkCounter}`
        this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ''))
    }

    onBtnStart() {
        this.log("initializing detection...")
        this.#blinkCounter = 0
        this.loop()
    }
}