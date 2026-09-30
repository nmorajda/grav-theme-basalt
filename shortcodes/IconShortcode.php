<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class IconShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'icon',
            function (ShortcodeInterface $sc): string {
                return $this->twig->processTemplate(
                    'shortcodes/icon.html.twig',
                    [
                        'params' => $sc->getParameters(),
                    ]
                );
            }
        );
    }
}
