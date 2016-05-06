/**
 * @fileOverview Slides parser.
 */
import Slide from '../slide/slide';

/**
 * @typedef {object} HTMLElement
 */

/**
 * @function
 * Get container and slide selector, myst returns array of slides.
 * @name shower.slidesParser
 *
 * @param {HTMLElement} containerElement
 * @param {string} cssSelector
 * @returns {Slide[]}
 */
export default function parse(containerElement, cssSelector) {
    var slidesElements = containerElement.querySelectorAll(cssSelector);
    slidesElements = Array.prototype.slice.call(slidesElements);

    return slidesElements.map((slideElement, index) => {
        const slide = new Slide(slideElement);

        if (!slideElement.id) {
            slideElement.id = index + 1;
        }

        return slide;
    });
}
