const messageElem = document.querySelector('#message');
const videoElem = document.querySelector('video');

let mediaStream = null;

const startGUMButton = document.querySelector('button#start-gum');
startGUMButton.addEventListener('click', async () => {
    startGUMButton.disabled = true;

    // request HD video at natural sensor orientation
    const constraints = {
        video: {
            width: {
                ideal: 1280
            },
            height: {
                ideal: 720
            },
            facingMode: {
                ideal: 'environment'
            }
        },
        audio: false
    }
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElem.srcObject = mediaStream;
        videoElem.load();
    } catch (e) {
        messageElem.innerText = `getUserMedia failed: ${e.name}`;
    }
});

const startStaticButton = document.querySelector('button#start-static');
startStaticButton.addEventListener('click', async () => {
    startStaticButton.disabled = true;
    videoElem.src = 'test_720x1280.mp4';
    videoElem.load();
});

videoElem.addEventListener('loadedmetadata', async () => {
    try {
        await videoElem.play();

        if (mediaStream) {
            const settings = mediaStream.getVideoTracks()[0].getSettings();
            const streamAspect = (settings.width/settings.height).toFixed(2);
            const videoElemAspect = (videoElem.clientWidth/videoElem.clientHeight).toFixed(2);
            messageElem.innerHTML = `Stream: ${settings.width}x${settings.height} (aspect: ${streamAspect})<br>&lt;video&gt; element: ${videoElem.clientWidth}x${videoElem.clientHeight} (aspect: ${videoElemAspect})`;
        } else {
            const videoElemAspect = (videoElem.clientWidth/videoElem.clientHeight).toFixed(2);
            const videoAspect = (videoElem.videoWidth/videoElem.videoHeight).toFixed(2);
            messageElem.innerHTML = `Video size: ${videoElem.videoWidth}x${videoElem.videoHeight} (aspect: ${videoAspect})<br>&lt;video&gt; element: ${videoElem.clientWidth}x${videoElem.clientHeight} (aspect: ${videoElemAspect})`;
        }
    } catch (e) {
        messageElem.innerText = `video.play() failed: ${e.name}`;
    }
});
