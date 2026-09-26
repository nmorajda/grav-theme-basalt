<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class AlertShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'alert',
            function (ShortcodeInterface $sc): string {
                return $this->twig->processTemplate(
                    'shortcodes/alert.html.twig',
                    [
                        'params' => $sc->getParameters(),
                        'content' => $sc->getContent(),
                    ]
                );
            }
        );
    }
}
