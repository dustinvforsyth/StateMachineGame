BASE.require([
    "jQuery",
    "components.material.segues.FadeOutFadeIn",
    "components.material.segues.AppearInstantSegue"
], function () {

    BASE.namespace("app.components.states");
    var fadeOutFadeIn = new components.material.segues.FadeOutFadeIn();

    app.components.states.HomeState = function (elem, tags, services) {

        var self = this;
        var $elem = $(elem);
        var stateManagerController = $(tags["state-manager"]).controller();
        var millennium = $(tags["millennium"]);
        var xwing = $(tags["xWing"]);
        var awing = $(tags["aWing"]);
        var curvedTie = $(tags["curvedTie"]);
        var straitTie = $(tags["straitTie"]);
        var pointTie = $(tags["pointTie"]);
        var rebelShips = $(tags["rebelShips"]);
        var millenniumHeight = millennium.height;

        self.prepareToActivateAsync = function () {
            stateManagerController.pushAsync('main', { segue: fadeOutFadeIn }).try();
            rebelShips.height = millenniumHeight;
        };

        millennium.on("click", function () {
            stateManagerController.pushAsync('millennium-state', { segue: fadeOutFadeIn }).try();
        });

        xwing.on("click", function () {
            stateManagerController.pushAsync('xWing-state', { segue: fadeOutFadeIn }).try();
        });

        awing.on("click", function () {
            stateManagerController.pushAsync('aWing-state', { segue: fadeOutFadeIn }).try();
        });

        curvedTie.on("click", function () {
            stateManagerController.pushAsync('curvedTie-state', { segue: fadeOutFadeIn }).try();
        });
        
        straitTie.on("click", function () {
            stateManagerController.pushAsync('straitTie-state', { segue: fadeOutFadeIn }).try();
        });

        pointTie.on("click", function () {
            stateManagerController.pushAsync('pointTie-state', { segue: fadeOutFadeIn }).try();
        });

        curvedTie.hover(function () {
            curvedTie.attr('src', '../../../images/Ships_small/curvedTie_sm.png');
        }, function () {
            curvedTie.attr('src', '../../../images/Ships_small_gs/curvedTie_sm_gs.png');
        });

        straitTie.hover(function () {
            straitTie.attr('src', '../../../images/Ships_small/straitTie_sm.png');
        }, function () {
            straitTie.attr('src', '../../../images/Ships_small_gs/straitTie_sm_gs.png');
        });

        pointTie.hover(function () {
            pointTie.attr('src', '../../../images/Ships_small/pointTie_sm.png');
        }, function () {
            pointTie.attr('src', '../../../images/Ships_small_gs/pointTie_sm_gs.png');
        });

        millennium.hover(function () {
            millennium.attr('src', '../../../images/Ships_small/millennium_sm.png');
        }, function () {
            millennium.attr('src', '../../../images/Ships_small_gs/millennium_sm_gs.png');
        });

        xwing.hover(function () {
            xwing.attr('src', '../../../images/Ships_small/x-wing_sm.png');
        }, function () {
            xwing.attr('src', '../../../images/Ships_small_gs/x-wing_sm_gs.png');
        });

        awing.hover(function () {
            awing.attr('src', '../../../images/Ships_small/a-wing_sm.png');
        }, function () {
            awing.attr('src', '../../../images/Ships_small_gs/a-wing_sm_gs.png');
        });
    };
});