<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class CarouselShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'carousel',
            function (ShortcodeInterface $sc): string {
                $content = $sc->getContent() ?? '';
                $textContent = $sc->getTextContent();

                preg_match_all('/\[carousel-item(?:\s[^\]]*)?\]/', $textContent, $matches);

                return $this->twig->processTemplate(
                    'shortcodes/carousel.html.twig',
                    [
                        'params' => $sc->getParameters(),
                        'content' => $content,
                        'item_count' => count($matches[0]),
                        'shortcode' => $sc,
                    ]
                );
            }
        );
    }
}