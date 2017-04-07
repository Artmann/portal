const SimpleWebRTC = require('simplewebrtc');
const FaceDetector = require('./face-detector');
const md5 = require('blueimp-md5');

class Room {
    constructor(roomName, key) {
        this.roomName = roomName;
        this.key = key;

        this.webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: '',
            autoRequestMedia: true,
            url: 'https://portal.artmann.co:8888',
            media: {
              audio: true,
              video: {
                width: 1280,
                height: 720
              }
            }
        });
        this.fd = new FaceDetector(
            this.mute.bind(this),
            this.unmute.bind(this),
            this.faceDetectionStatus.bind(this)
          );

        this.webrtc.on('readyToCall', () => {
            const name = md5(`${this.roomName}-${this.key}`);
            this.webrtc.joinRoom(name);
        });
        this.webrtc.on('videoAdded', this.onVideoAdded.bind(this));
        this.webrtc.on('videoRemoved', this.onVideoRemoved.bind(this));
    }

    onVideoRemoved(video, peer) {
        console.log('video removed ', peer);
        var remotes = document.getElementById('remotes');
        var el = document.getElementById(peer ? 'container_' + this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
        this.resizeVideos();
    }

    onVideoAdded(video, peer) {
        console.log('video added', peer);
        let remotes = document.getElementById('remotes');
        if (remotes) {
            let container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + this.webrtc.getDomId(peer);
            container.appendChild(video);

            video.oncontextmenu = function () { return false; };
            remotes.appendChild(container);

            this.resizeVideos();
        }
    }

    mute() {
        $('#localVideo').addClass('active');
        this.webrtc.unmute();
    }

    unmute() {
        $('#localVideo').removeClass('active');
        this.webrtc.mute();
    }

    faceDetectionStatus(isDetected) {
      if (isDetected) {
        $("#localVideo").addClass('detected');
      } else {
        $("#localVideo").removeClass('detected');
      }
    }

    resizeVideos() {
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

}

module.exports = Room;
