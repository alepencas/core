/**
 * @file Slide layout.
 */
import OptionsManager from '../options/manager';
import {defaultOptions} from '../global/shower';
import EventEmitter from '../emitter/emitter';
import bound from '../utils/bound';

/**
 * @typedef {object} HTMLElement
 */

/**
 * @class Slide layout. Work with DOM, DOM events, etc. View for Slide class.
 * @name slide.Layout
 */
export default class SlideLayout {
    /* @param {HTMLElement} element Slide node.
    * @param {object} Options for slide layout.
    */
    constructor(element, options) {
        this.options = new OptionsManager({
            title_element_selector: defaultOptions.slide_title_element_selector,
            active_classname: defaultOptions.slide_active_classname,
            visited_classname: defaultOptions.slide_visited_classname
        }, options);

        this.events = new EventEmitter();
        this._element = element;

        this._parent = null;
        this._parentElement = null;

        this.init();
    }

    /**
     * @ignore
     * Init layout.
     */
    init() {
        var parentNode = this._element.parentNode;
        if (!parentNode) {
            this.setParentElement(parentNode);
        } else {
            this._parentElement = parentNode;
        }
    }

    destroy() {
        this.setParent(null);
    }

    setParent(parent) {
        if (this._parent != parent) {
            this._clearListeners();

            this._parent = parent;

            if (this._parent) {
                this._setupListeners();
            }

            this.events.emit('parentchange', {
                parent: parent
            });
        }
    }

    getParent() {
        return this._parent;
    }

    /**
     * @param {HTMLElement} parentElement
     */
    setParentElement(parentElement) {
        if (parentElement != this._parentElement) {
            this._parentElement = parentElement;
            parentElement.appendChild(this._element);

            this.events.emit('parentelementchange', {
                parentElement: parentElement
            });
        }
    }

    /**
     * Return slide parent HTML element.
     *
     * @returns {HTMLElement} Layout parent element.
     */
    getParentElement() {
        return this._parentElement;
    }

    /**
     * Return slide HTML element.
     *
     * @returns {HTMLElement} Layout element.
     */
    getElement() {
        return this._element;
    }

    /**
     * Set slide title or create new H2 element into slide element.
     *
     * @param {string} title Slide title.
     */
    setTitle(title) {
        var titleElementSelector = this.options.get('title_element_selector');
        var titleElement = this._element.querySelector(titleElementSelector);

        if (titleElement) {
            titleElement.innerHTML = title;
        } else {
            titleElement = document.createElement(titleElementSelector);
            titleElement.innerHTML = title;
            this._element.insertBefore(titleElement, this._element.firstChild);
        }
    }

    /**
     * Return text content of H2 element.
     *
     * @returns {(string|null)} Title.
     */
    getTitle() {
        var titleElementSelector = this.options.get('title_element_selector');
        var titleElement = this._element.querySelector(titleElementSelector);
        return titleElement ? titleElement.textContent : null;
    }

    /**
     * Get data, defined in property of slide element.
     *
     * @param {string} name Data attr name.
     * @returns {object} Value of data attr.
     */
    getData(name) {
        var element = this._element;

        return element.dataset ?
            element.dataset[name] :
            element.getAttribute('data-' + name);
    }

    /**
     * Get inner content from slide element.
     *
     * @returns {string} Slide content.
     */
    getContent() {
        return this._element.innerHTML;
    }

    _setupListeners() {
        this._slideListeners = this._parent.events.group()
            .on('activate', this._onSlideActivate, this)
            .on('deactivate', this._onSlideDeactivate, this);

        this._element.addEventListener('click', bound(this, '_onSlideClick'), false);
    }

    _clearListeners() {
        if (this._slideListeners) {
            this._slideListeners.offAll();
        }

        this._element.removeEventListener('click', bound(this, '_onSlideClick'));
    }

    _onSlideActivate() {
        this._element.classList.add(this.options.get('active_classname'));
    }

    _onSlideDeactivate() {
        var elementClassList = this._element.classList;
        elementClassList.remove(this.options.get('active_classname'));
        elementClassList.add(this.options.get('visited_classname'));
    }

    _onSlideClick() {
        this.events.emit('click');
    }
}
