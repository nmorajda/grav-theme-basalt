<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class BadgeShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'basalt-badge',
            function (ShortcodeInterface $sc): string {
                return $this->twig->processTemplate(
                    'shortcodes/badge.html.twig',
                    [
                        'params' => $sc->getParameters(),
                        'content' => $sc->getContent(),
                    ]
                );
            }
        );
    }
}
