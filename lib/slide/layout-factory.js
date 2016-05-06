/**
 * @file Layout factory for slides.
 */
import SlideLayout from './layout';

/**
 * @name slide.layoutFactory
 * @static
 */
export default const layoutFactory = {
    /**
     * @param {object} [parameters]
     * @param {string} [parameters.content] Slide content.
     * @param {string} [parameters.contentType='slide'] Cover, slide, image.
     * @returns {slide.Layout}
     */
    createLayout(parameters) {
        parameters = parameters || {};
        const element = createElement(extend({
            content: '',
            contentType: 'slide'
        }, parameters));

        return new SlideLayout(element);
    }
};

/**
 * @ignore
 * @param options
 * @returns {HTMLElement}
 */
function createElement(options) {
    const element = document.createElement('section');
    element.innerHTML = options.content;
    element.classList.add(options.contentType);

    return element;
}
