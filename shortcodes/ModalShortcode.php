<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class ModalShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'modal',
            function (ShortcodeInterface $sc): string {
                return $this->twig->processTemplate(
                    'shortcodes/modal.html.twig',
                    [
                        'params' => $sc->getParameters(),
                        'content' => $sc->getContent(),
                        'shortcode' => $sc,
                    ]
                );
            }
        );
    }
}