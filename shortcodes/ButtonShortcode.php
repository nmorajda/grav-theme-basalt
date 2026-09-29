<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class ButtonShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'button',
            function (ShortcodeInterface $sc): string {
                return $this->twig->processTemplate(
                    'shortcodes/button.html.twig',
                    [
                        'params' => $sc->getParameters(),
                        'content' => $sc->getContent(),
                    ]
                );
            }
        );
    }
}
