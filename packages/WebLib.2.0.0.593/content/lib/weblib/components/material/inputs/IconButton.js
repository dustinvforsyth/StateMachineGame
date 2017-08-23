BASE.require([
    'jQuery',
    'BASE.web.animation.ElementAnimation',
    'BASE.async.Future',
    'BASE.async.delayAsync',
    'components.material.animations.createFadeInAnimation',
    'components.material.animations.createFadeOutAnimation'
], function () {
    BASE.namespace('components.material.inputs');

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var delayAsync = BASE.async.delayAsync;
    var emptyFn = function () { };
    var emptyFuture = function () {
        return Future.fromResult();
    };
    var createFadeInAnimation = components.material.animations.createFadeInAnimation;
    var createFadeOutAnimation = components.material.animations.createFadeOutAnimation;

    components.material.inputs.IconButton = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var iconBackground = tags['icon-background']
        var $iconBackground = $(iconBackground);
        var backgroundFadeFuture = Future.fromResult();
        var backgroundFadeOutAnimation = createFadeOutAnimation(iconBackground, 200);
        var backgroundFadeInAnimation = createFadeInAnimation(iconBackground, 200);

        var handleDefaultColors = function () {
            $iconBackground.removeAttr('class');
            $iconBackground.css({
                backgroundColor: ''
            });
            if ($elem.is('[background-color]')) {
                $iconBackground.css({
                    backgroundColor: $elem.attr('background-color')
                });
            }

            if ($elem.is('[background-class')) {
                $iconBackground.attr('class', $elem.attr('background-class'));
            }
        };

        var visibleState = {
            fadeAsync: function () {
                return backgroundFadeFuture = backgroundFadeFuture.chain(function () {
                    backgroundFadeOutAnimation.seek(0);
                    return backgroundFadeOutAnimation.playToEndAsync();
                });
            },
            touchStart: emptyFn,
            touchEnd: function (event) {
                currentState.fadeAsync().try();
                currentState = invisibleState;
            }
        };

        var scaleAnimation = new ElementAnimation({
            target: iconBackground,
            easing: "easeOutQuad",
            properties: {
                scaleX: {
                    from: 0.4,
                    to: 1
                },
                scaleY: {
                    from: 0.4,
                    to: 1
                }
            },
            duration: 200
        });

        var invisibleState = {
            fadeAsync: emptyFuture,
            touchStart: function (event) {
                backgroundFadeFuture.cancel();
                backgroundFadeInAnimation.seek(0);
                scaleAnimation.seek(0);
                scaleAnimation.play();
                backgroundFadeFuture = Future.all([
                    scaleAnimation.playToEndAsync(),
                    backgroundFadeInAnimation.playToEndAsync()
                ]).try();

                currentState = visibleState;
            },
            touchEnd: emptyFn
        };

        var touchStartHandler = function (event) {
            $elem.off('touchstart mousedown');
            toggleState.touchStart(event);
            currentState.touchStart(event);
        };

        var offState = {
            touchStart: function () {
                handleDefaultColors();
                if ($elem.is('[off-color]')) {
                    $iconBackground.css({
                        backgroundColor: $elem.attr('off-color')
                    });
                }
                if ($elem.is('[off-class]')) {
                    $iconBackground.attr('class', $elem.attr('off-class'));
                }
                toggleState = onState;
            }
        };

        var onState = {
            touchStart: function () {
                handleDefaultColors();
                if ($elem.is('[on-color]')) {
                    $iconBackground.css({
                        backgroundColor: $elem.attr('on-color')
                    });
                }
                if ($elem.is('[on-class]')) {
                    $iconBackground.attr('class', $elem.attr('on-class'));
                }
                toggleState = offState;
            }
        }

        var toggleState = onState;

        var currentState = invisibleState;

        self.setStateOn = function () {
            toggleState = onState;
        };

        self.setStateOff = function () {
            toggleState = offState;
        };

        $elem.on('mousedown', function (event) {
            $elem.off('touchstart touchend touchleave');
            touchStartHandler(event);
        });

        $elem.on('touchstart', function (event) {
            $elem.off('mousedown mouseup mouseleave');
            touchStartHandler(event);
        });

        $elem.on('mouseup mouseleave', function (event) {
            currentState.touchEnd(event);
            $elem.off('mousedown');
            $elem.on('mousedown', touchStartHandler);
        });

        $elem.on('touchend touchleave', function (event) {
            currentState.touchEnd(event);
            $elem.off('touchstart');
            $elem.on('touchstart', touchStartHandler);
        });

        if ($elem.is('[start-on]')) {
            toggleState = offState;
        }
    };
});