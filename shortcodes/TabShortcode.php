<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ProcessedShortcode;

class TabShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'tab',
            function (ProcessedShortcode $sc): string {
                $parent = $sc->getParent();

                if (!$parent) {
                    return '';
                }

                $hash = $this->shortcode->getId($parent);

                $this->shortcode->setStates($hash, $sc);

                return '';
            }
        );
    }
}
