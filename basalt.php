<?php

declare(strict_types=1);

namespace Grav\Theme;

use Grav\Common\Theme;

class Basalt extends Theme
{
    public function onTwigLoader(): void
    {
        $themePath = $this->grav['locator']->findResource('themes://basalt');

        if (!$themePath) {
            return;
        }

        $this->grav['twig']->addPath(
            $themePath . DIRECTORY_SEPARATOR . 'templates',
            'basalt'
        );
    }

    public function onShortcodeHandlers(): void
    {
        $this->grav['shortcode']->registerAllShortcodes(
            __DIR__ . '/shortcodes'
        );
    }
}