import SimpleWebRTC from 'simplewebrtc';
import FaceDetector from './face-detector';

const webrtc = new SimpleWebRTC({
    localVideoEl: 'localVideo',
    remoteVideosEl: '',
    autoRequestMedia: true,
    url: 'https://portal.glesys.io:8888'
});


new FaceDetector(() => {
    $('#localVideo').addClass('active');
    webrtc.unmute()
}, () => {
    $('#localVideo').removeClass('active');
    
    webrtc.mute()
});

webrtc.on('readyToCall', () => {
    // you can name it anything
    webrtc.joinRoom('your awesome room name');
});

webrtc.on('videoAdded', (video, peer) => {
    console.log('video added', peer);
    let remotes = document.getElementById('remotes');
    if (remotes) {
        let container = document.createElement('div');
        container.className = 'videoContainer';
        container.id = 'container_' + webrtc.getDomId(peer);
        container.appendChild(video);
        
        video.oncontextmenu = function () { return false; };
        remotes.appendChild(container);

        resizeVideos();
    }
});

webrtc.on('videoRemoved', (video, peer) => {
    console.log('video removed ', peer);
    var remotes = document.getElementById('remotes');
    var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
        remotes.removeChild(el);
    }
    resizeVideos();
});

function resizeVideos() {
    let documentHeight = $(document).height();

    let count = $('.videoContainer').length;
    if (count == 1) {
        $('.videoContainer').width('100%').height(documentHeight);
    }
    if (count == 2) {
        $('.videoContainer').width('50%').height(documentHeight);
    }
    if (count > 2) {
        $('.videoContainer').width('50%').height($('.videoContainer').width() / 4 * 3);
    }
}