import shower, {defaultOptions} from './global/shower';
import extend from 'extend';

(function (global) {
    const dataAttrsOptions = [
        'debug-mode',
        'slides-selector',
        'hotkeys'
    ];
    const options = extend({}, defaultOptions, global.showerOptions || {});

    document.addEventListener('DOMContentLoaded', () => {
        const containerSelector = options.container_selector;
        const element = document.querySelector(containerSelector);
        const getDataAttr = getData.bind(this, element);
        const autoInit = typeof options.auto_init !== 'undefined' ?
            options.auto_init : true;

        if (!element) {
            throw new Error('Shower element with selector ' + containerSelector + ' not found.');
        }

        if (getDataAttr('auto-init') !== 'false' || autoInit) {
            if (!hasOptions) {
                dataAttrsOptions.forEach(function (name) {
                    const value = getDataAttr(name);
                    // Null for getAttr, undefined for dataset.
                    if (value !== null && typeof value !== 'undefined') {
                        options[name.replace(/-/g, '_')] = value;
                    }
                });
            }

            shower.init({
                container: element,
                options: options
            });
        }
    }, false);

    /**
     * Get data-attr value.
     * @param {HTMLElement} element
     * @param {String} name Data property
     * @returns {Object}
     */
    function getData(element, name) {
        return element.dataset ?
            element.dataset[name] :
            element.getAttribute('data-' + name);
    }
})(window);

