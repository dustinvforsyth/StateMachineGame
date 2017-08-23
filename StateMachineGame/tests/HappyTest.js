var assert = require('assert');
require("../project/lib/weblib/lib/BASE/BASE.js");

BASE.require.loader.setRoot("./");
BASE.require.loader.setNamespace("app", "../../../../app");

exports["HappyTest"] = function () {
    assert(true);
}
