import $ from "jquery";

/* eslint-disable no-undef */
global.$ = global.jQuery = $;
/* eslint-enable no-undef */

global.fetch = require("jest-fetch-mock");
