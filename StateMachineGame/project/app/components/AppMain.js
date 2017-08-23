BASE.require([
    "jQuery",
    "components.material.segues.FadeOutFadeIn",
    "components.material.segues.AppearInstantSegue"

], function () {

    BASE.namespace("app.components");

    var appearInstantSegue = new components.material.segues.AppearInstantSegue();

    app.components.AppMain = function (elem, tags, services) {

        var self = this;
        var $elem = $(elem);
        var stateManagerController = $(tags["state-manager"]).controller();

        var init = function () {
            stateManagerController.pushAsync('home-state', { segue: appearInstantSegue }).try();
        }

        init();
    };
});