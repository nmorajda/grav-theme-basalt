<?php

declare(strict_types=1);

namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class CarouselItemShortcode extends Shortcode
{
    public function init(): void
    {
        $this->shortcode->getHandlers()->add(
            'carousel-item',
            function (ShortcodeInterface $sc): string {
                $parent = $sc->getParent();
                $parentContent = $parent ? $parent->getTextContent() : '';

                preg_match_all(
                    '/\[carousel-item(?:\s[^\]]*)?\]/',
                    $parentContent,
                    $matches
                );

                return $this->twig->processTemplate(
                    'shortcodes/carousel-item.html.twig',
                    [
                        'params' => $sc->getParameters(),
                        'content' => $sc->getContent(),
                        'shortcode' => $sc,
                        'page' => $this->grav['page'],
                        'item_count' => count($matches[0]),
                    ]
                );
            }
        );
    }
}