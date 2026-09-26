<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class TabsShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'tabs',
            function (ShortcodeInterface $sc): string {
                $hash = $this->shortcode->getId($sc);

                return $this->twig->processTemplate(
                    'shortcodes/tabs.html.twig',
                    [
                        'params' => $sc->getParameters(),
                        'shortcode' => $sc,
                        'child_tabs' => $this->shortcode->getStates($hash),
                    ]
                );
            }
        );
    }
}
