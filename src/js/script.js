/*
 * Basalt JavaScript entry point.
 *
 * Loads Bootstrap components and theme-specific JavaScript modules,
 * then marks the document as JavaScript-enabled for progressive enhancement.
 */

import "./modules/bootstrap.js";
import "./modules/navbar.js";

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");
