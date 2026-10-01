/*
 * Navbar responsive state handling.
 *
 * Bootstrap keeps an open dropdown in the `.show` state when the navbar
 * crosses its responsive breakpoint. This module detects a switch between
 * collapsed and expanded navbar modes and closes any open dropdowns through
 * the Bootstrap Dropdown API.
 *
 * The breakpoint is detected from the actual visibility of `.navbar-toggler`,
 * so the logic works with configurable navbar expansion breakpoints.
 */

import Dropdown from "bootstrap/js/dist/dropdown";

document.querySelectorAll(".navbar").forEach((navbar) => {
    const toggler = navbar.querySelector(".navbar-toggler");

    if (!toggler) {
        return;
    }

    let desktopMode = window.getComputedStyle(toggler).display === "none";

    window.addEventListener("resize", () => {
        const nextDesktopMode =
            window.getComputedStyle(toggler).display === "none";

        if (nextDesktopMode === desktopMode) {
            return;
        }

        desktopMode = nextDesktopMode;

        navbar
            .querySelectorAll('[data-bs-toggle="dropdown"].show')
            .forEach((toggle) => {
                Dropdown.getOrCreateInstance(toggle).hide();
            });
    });
});
