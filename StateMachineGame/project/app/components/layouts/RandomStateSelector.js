BASE.require([
    "jQuery",
    "components.material.animations.createSpinInBottomAnimation"
], function () {
    BASE.namespace("app.components.layouts");

    var Future = BASE.async.Future;

    app.components.layouts.RandomStateSelector = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        var stateArr = ["oppCurvedTie-state", "oppStraitTie-state", "oppPointTie-state"];

        var randomState = function (stateArr) {
            return stateArr[Math.floor(Math.random() * stateArr.length)];
        }
        var pushState = randomState(stateArr);


    };
});