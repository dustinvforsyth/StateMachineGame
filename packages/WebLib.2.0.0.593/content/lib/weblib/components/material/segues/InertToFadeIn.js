﻿BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "BASE.async.Future"
], function () {
    BASE.namespace('components.material.segues');

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    components.material.segues.InertToFadeIn = function () {
        var self = this;
        var duration = 550;

        self.getDuration = function () {
            return duration;
        };

        self.executeAsync = function (outBoundElement, inboundElement) {

            var timeline = new PercentageTimeline(duration);

            if (outBoundElement) {
                var zIndex = outBoundElement.style.zIndex;
                inboundElement.style.zIndex = parseInt(zIndex, 10) + 1;
            }

            if (inboundElement) {
                inboundElement.style.opacity = 0;

                var inboundElementAnimation = new ElementAnimation({
                    target: inboundElement,
                    easing: 'easeOutExpo',
                    properties: {
                        opacity: {
                            from: 0,
                            to: 1
                        }
                    }
                });

                timeline.add({
                    animation: inboundElementAnimation,
                    startAt: 0,
                    endAt: 0.73
                });
            }

            var timelineFuture = timeline.playToEndAsync();

            return timelineFuture;
        };
    }
});