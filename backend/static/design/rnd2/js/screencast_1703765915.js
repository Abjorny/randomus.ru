let mediaRecorder = null;
let recordTimingStart = null;
let recordDelayTimer = null;
let startDelay = 0;

const recordTimingElement = document.getElementById('record-timing');
const recordLabelElement = document.getElementById('record-label');
const recordButtonElement = document.getElementById('rnd-record-label');

const startDelayInput = document.getElementById('start_delay');
const grabAudioInput = document.getElementById('grab_audio');

const defaultTitle = document.title;
const startRecordText = 'Начать запись';
const waitRecordText = 'Ожидает запуска...';
const stopRecordText = 'Остановить запись';
const prepareRecordText = 'Подготовка к записи...';

async function rndScreenRecord() {
    let record_label = document.getElementById('rnd-record-label');

    if (recordDelayTimer) {
        clearTimeout(recordDelayTimer);
        recordLabelElement.innerHTML = startRecordText;
        recordTimingElement.innerHTML = '';
        recordButtonElement.classList.remove('recording');
        document.title = defaultTitle;
    }

    if (mediaRecorder) {
        mediaRecorder.stop();
        let tracks = mediaRecorder.stream.getTracks();
        tracks.forEach(track => track.stop());
        mediaRecorder = null;
        return;
    }

    const grabAudio = grabAudioInput.checked;

    let mediaDevicesOptions = {audio: false};
    if (grabAudio) {
        mediaDevicesOptions = {audio: true, systemAudio: 'include'};
    }

    recordLabelElement.innerHTML = prepareRecordText

    let stream = await navigator.mediaDevices.getDisplayMedia(mediaDevicesOptions).catch(e => {});
    if (!stream) {
        recordLabelElement.innerHTML = startRecordText;
        return;
    }

    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm";
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: mime
    })

    let chunks = [];
    mediaRecorder.addEventListener('dataavailable', function(e) {
        chunks.push(e.data);
    });

    mediaRecorder.addEventListener('stop', function() {
        recordTimingStart = null;
        recordTimingElement.innerHTML = '';
        recordButtonElement.classList.remove('recording');
        recordButtonElement.classList.add('is-outlined');
        document.title = defaultTitle;
        recordLabelElement.innerHTML = startRecordText;

        let blob = new Blob(chunks, {
            type: chunks[0].type
        });
        let url = URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = url;

        let date = rndGetCurrentTimeString();
        link.download = `randomus_screencast-${date}.webm`;
        link.click();
    });

    startDelay = Number(startDelayInput.value);
    delayedStart();
}

function delayedStart() {
    if (startDelay <= 0) {
        startDelay = 0;
        mediaRecorder.start();
        recordTimingStart = Date.now();
        rndUpdateRecordTiming();
        recordButtonElement.classList.add('recording');
        recordButtonElement.classList.remove('is-outlined');
        recordDelayTimer = null;
    } else {
        startDelay -= 1;
        recordLabelElement.innerHTML = waitRecordText;
        recordButtonElement.classList.add('recording');
        recordTimingElement.innerHTML = startDelay.toString();
        document.title = `${startDelay} сек. до записи`;
        recordDelayTimer = setTimeout(delayedStart, 1000);
    }
}


function rndUpdateRecordTiming() {
    if (!recordTimingStart) {
        return;
    }

    let seconds = Math.floor((Date.now() - recordTimingStart) / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = (seconds % 60).toString().padStart(2,'0');

    recordTimingElement.innerHTML = `${minutes}:${seconds}`;
    recordLabelElement.innerHTML =  stopRecordText;
    document.title = `${minutes}:${seconds} - запись скринкаста`;

    setTimeout(rndUpdateRecordTiming, 1000);
}

function rndGetCurrentTimeString() {
    let d = new Date();
    return `${d.getFullYear()}-${rnd_pad_left(d.getMonth())}-${rnd_pad_left(d.getDate())}-${rnd_pad_left(d.getHours())}-${rnd_pad_left(d.getMinutes())}-${rnd_pad_left(d.getSeconds())}`;
}
