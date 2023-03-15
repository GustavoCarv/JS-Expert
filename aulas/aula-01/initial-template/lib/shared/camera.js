export default class Camera {
    constructor() {
        this.video = document.createElement('video')
    }


    static async init() {

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(`Browser API navigator.mediaDevices.getUserMedia not available`)
        }

        const videoConfig = {
            audio: false,
            video: {
                width: globalThis.screen.availWidth,
                height: globalThis.screen.availHeight
            },
            frameRate: {
                ideal: 60
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

        const camera = new Camera();
        
        camera.video.srcObject = stream;

        // For debugging
        /*         camera.video.height = 600
        camera.video.width = 960

        document.body.append(camera.video) */

        // Aguarda a camera
        await new Promise((resolve) => {
            camera.video.onloadedmetadata = () => {
                resolve(camera.video)
            }
        })

        camera.video.play()

        return camera
    }
}