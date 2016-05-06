/**
 * @file Core module of the Shower.
 */
import EventEmitter from './emitter/emitter';
import OptionsManager from './options/manager';
import showerGlobal, {defaultOptions} from '../global/shower';
import Container from './container';
import Player from './player';
import Location from './location';
import defaultSlidesParser from './slidesParser';
import extend from '../utils/extend';

/**
 * @typedef {object} HTMLElement
 */

/**
 * @typedef {function} ISlidesParseFunction
 * @param {HTMLElement} containerElement
 * @param {string} cssSelector Slides selector.
 * @returns {Slide[]} Slides.
 */
export default class Shower {
    /**
     * @param {(HTMLElement|string)} [container='.shower'] Container element or his selector.
     * @param {object} [options] Shower options.
     * @param {boolean} [options.debug_mode = false] Debug mode.
     * @param {boolean} [options.hotkeys = true] If true — hotkeys will works.
     * @param {string} [options.slides_selector = '.shower .slide'] Slide selector.
     * @param {ISlidesParseFunction} [options.slides_parser] Parse function.
     * @param {object} [options.plugins] Plugins options.
     * @returns {Shower}
     */
    constructor(container, options) {
        options = options || {};

        this.events = new EventEmitter({context: this});
        this.options = new OptionsManager({}, defaultOptions, options);

        const containerElement = container || this.options.get('container_selector');
        if (typeof containerElement === 'string') {
            containerElement = document.querySelector(containerElement);
        }

        this.player = new Player(this);
        this.container = new Container(this, containerElement);

        this._slides = [];
        this._isHotkeysOn = true;
        this._liveRegion = null;

        this._initSlides();
        this._initLiveRegion();

        if (this.options.get('debug_mode')) {
            document.body.classList.add(this.options.get('debug_mode_classname'));
            console.info('Debug mode on');
        }

        if (!this.options.get('hotkeys')) {
            this.disableHotkeys();
        }

        this.location = new Location(this);

        // Notify abount new shower instance.
        showerGlobal.events.emit('notify', {shower: this});

        this._playerListeners = this.player.events.group()
            .on('activate', this._onPlayerSlideActivate, this);
    }

    /**
     * Destroy Shower.
     */
    destroy() {
        this.events.emit('destroy');

        this.location.destroy();
        this.container.destroy();
        this.player.destroy();

        this._slides = [];
    }

    /**
     * Add slide or array of slides.
     *
     * @param {(Slide|Slide[])} slide Slide or array or slides.
     * @returns {Shower}
     */
    add(slide) {
        if (Array.isArray(slide)) {
            slide.forEach(item => this._addSlide(item));
        } else {
            this._addSlide(slide);
        }

        return this;
    }

    /**
     * Remove slide from shower.
     *
     * @param {(Slide|number)} slide Slide {@link Slide} or slide index.
     * @returns {Shower} Self link.
     */
    remove(slide) {
        let slidePosition;

        if (typeof slide == 'number') {
            slidePosition = slide;
        } else if (this._slides.indexOf(slide) !== -1) {
            slidePosition = this._slides.indexOf(slide);
        } else {
            throw new Error('Slide not found');
        }

        slide = this._slides.splice(slidePosition, 1)[0];

        this.events.emit('slideremove', {
            slide: slide
        });

        slide.destroy();
        return this;
    }

    /**
     * Return slide by index.
     *
     * @param {number} index Slide index.
     * @returns {Slide} Slide by index.
     */
    get(index) {
        return this._slides[index];
    }

    /**
     * @returns {Slide[]} Array with slides {@link Slide}.
     */
    getSlides() {
        return this._slides.slice();
    }

    /**
     * @returns {number} Slides count.
     */
    getSlidesCount() {
        return this._slides.length;
    }

    /**
     * @param {Slide} slide
     * @returns {number} Slide index or -1 of slide not found.
     */
    getSlideIndex(slide) {
        return this._slides.indexOf(slide);
    }

    /**
     * Turn off hotkeys control.
     *
     * @returns {Shower}
     */
    disableHotkeys() {
        this._isHotkeysOn = false;
        return this;
    }

    /**
     * Turn on hotkeys control.
     *
     * @returns {Shower}
     */
    enableHotkeys() {
        this._isHotkeysOn = true;
        return this;
    }

    /**
     * @returns {boolean} Hotkeys is enabled.
     */
    isHotkeysEnabled() {
        return this._isHotkeysOn;
    }

    /**
     * @returns {HTMLElement} Live region element.
     */
    getLiveRegion() {
        return this._liveRegion;
    }

    /**
     * Update live region content.
     *
     * @param {string} content New content for live region.
     * @returns {Shower}
     */
    updateLiveRegion(content) {
        this._liveRegion.innerHTML = content;
        return this;
    }

    _onPlayerSlideActivate(event) {
        var currentSlide = event.get('slide');
        this.updateLiveRegion(currentSlide.getContent());
    }

    _initSlides() {
        var slidesParser = this.options.get('slides_parser') || defaultSlidesParser;
        var slides = slidesParser(this.container.getElement(), this.options.get('slides_selector'));
        this.add(slides);
    }

    _addSlide(slide) {
        slide.state.set('index', this._slides.length);
        this._slides.push(slide);

        this.events.emit('slideadd', {
            slide: slide
        });
    }

    _initLiveRegion() {
        var liveRegion = document.createElement('section');
        liveRegion.setAttribute('role', 'region');
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.setAttribute('aria-relevant', 'additions');
        liveRegion.setAttribute('aria-label', 'Slide Content: Auto-updating');
        liveRegion.className = 'region';

        document.body.appendChild(liveRegion);
        this._liveRegion = liveRegion;
    }
}
