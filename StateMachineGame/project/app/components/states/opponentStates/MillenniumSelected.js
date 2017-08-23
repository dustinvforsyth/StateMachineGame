BASE.require([
    "jQuery",
    "components.material.segues.FadeOutFadeIn",
    "components.material.segues.AppearInstantSegue"

], function () {

    BASE.namespace("app.components.states.opponentStates");
    var appearInstantSegue = new components.material.segues.AppearInstantSegue();

    app.components.states.opponentStates.MillenniumSelected = function (elem, tags, services) {
        var Millennium = $(tags["mill"]);
        var xWing = $(tags["xwing"]);
        var aWing = $(tags["awing"]);
        var opposingShip = $(tags["opposingShip"]);
        var opponent = $(tags["opponent"]);
        var stateManagerController = $(tags["insideState-manager"]).controller();

        var stateArr = ["oppCurvedTie-state", "oppStraitTie-state", "oppPointTie-state"];

        var randomState = function (stateArr) {
            return stateArr[Math.floor(Math.random() * stateArr.length)];
        }
        var pushState = randomState(stateArr);

        self.prepareToActivateAsync = function () {
            stateManagerController.pushAsync(pushState, { segue: fadeOutFadeIn }).try();
        };


        var imgArray = ["curvedTie_sm.png", "pointTie_sm.png", "straitTie_sm.png"];
        var imgRandom = function (imgArray) {
            return imgArray[Math.floor(Math.random() * imgArray.length)];
        }

        src = "../../../images/Ships_small/" + imgRandom(imgArray);

        opponent.attr('src', src);
    };
});