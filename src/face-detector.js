class FaceDetector {
    constructor(activateFn, deactivateFn) {
        this.activateFn = activateFn;
        this.deactivateFn = deactivateFn;

        const tracker = new tracking.ObjectTracker("face");
        tracker.setInitialScale(2.5);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);

        tracking.track('#localVideo', tracker);
        tracker.on('track', this.onTrack.bind(this));
    }

    onTrack(event) {
        if (event.data.length > 0) {
            this.activate();
            this.scheduleDeactivation();
        }
    }

    activate() {
        this.activateFn();
    }

    scheduleDeactivation() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.deactivateFn();
        }, 30 * 1000)
    }
};

module.exports = FaceDetector;
