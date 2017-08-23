BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "jQuery.fn.region",
    "components.material.animations.createFadeOutAnimation"
], function () {

    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var createFadeOutAnimation = components.material.animations.createFadeOutAnimation;
    var Future = BASE.async.Future;
    var emptyFn = function () { };
    var emptyFuture = function () {
        return Future.fromResult();
    };

    BASE.namespace("components.material.inputs");

    components.material.inputs.MaterialButtonBehavior = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var ripple = tags['ripple'];
        var $ripple = $(ripple);
        var rippleFadeOutAnimation = createFadeOutAnimation(ripple);
        var fadeOutFuture = Future.fromResult();

        var visibleState = {
            fadeAsync: function () {
                rippleFadeOutAnimation.seek(0);
                return fadeOutFuture = rippleFadeOutAnimation.playToEndAsync();
            },
            touchStart: emptyFn,
            touchEnd: function (event) {
                currentState.fadeAsync().try();
                currentState = invisibleState;
            }
        };

        var invisibleState = {
            fadeAsync: emptyFuture,
            touchStart: function (event) {
                event = getEvent(event);
                fadeOutFuture.cancel();

                var region = $elem.region();
                var x = event.pageX - region.left;
                var y = event.pageY - region.top;

                $ripple.css({
                    top: y + 'px',
                    left: x + 'px',
                    marginTop: '-150px',
                    marginLeft: '-150px',
                    opacity: '1'
                });

                rippleAnimation.restart();

                currentState = visibleState;
            },
            touchEnd: emptyFn
        };

        var currentState = invisibleState;

        var rippleAnimation = new ElementAnimation({
            target: ripple,
            easing: "easeOutQuad",
            properties: {
                scaleX: {
                    from: 0,
                    to: 1
                },
                scaleY: {
                    from: 0,
                    to: 1
                },
            },
            duration: 400
        });

        var getEvent = function (event) {
            event = event.originalEvent || event;
            if (event.targetTouches && event.targetTouches.length > 0) {
                event = event.targetTouches[0];
            } else if (event.changedTouches && event.changedTouches.length > 0) {
                event = event.changedTouches[0];
            }
            return event;
        };

        $elem.on('mousedown', function (event) {
            $elem.off('touchstart touchend touchleave');
            currentState.touchStart(event);
        });

        $elem.on('touchstart', function (event) {
            $elem.off('mousedown mouseup mouseleave');
            currentState.touchStart(event);
        });

        $elem.on('mouseup mouseleave touchend touchleave', function (event) {
            currentState.touchEnd(event);
        });

    };

});