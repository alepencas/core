/**
 * @file Slides player.
 */
import EventEmitter from '../events/emitter';
import bound from '../utils/bound';

/**
 * @class Control slides.
 * @name shower.Player
 */
export default class Player {
    constructor(shower) {
        this.events = new EventEmitter({
            context: this,
            parent: shower.events
        });

        this._shower = shower;
        this._showerListeners = null;
        this._playerListeners = null;

        this._currentSlideNumber = -1;
        this._currentSlide = null;

        this.init();
    }

    init() {
        this._showerListeners = this._shower.events.group()
            .on('slideadd', this._onSlideAdd, this)
            .on('slideremove', this._onSlideRemove, this)
            .on('slidemodeenter', this._onSlideModeEnter, this);

        this._playerListeners = this.events.group()
            .on('prev', this._onPrev, this)
            .on('next', this._onNext, this);

        document.addEventListener('keydown', bound(this, '_onKeyDown'));
    }

    destroy() {
        this._showerListeners.offAll();
        this._playerListeners.offAll();

        document.removeEventListener('keydown', bound(this, '_onKeyDown'));

        this._currentSlide = null;
        this._currentSlideNumber = null;
        this._shower = null;
    }

    /**
     * Go to next slide.
     *
     * @returns {shower.Player}
     */
    next() {
        this.events.emit('next');
        return this;
    }

    /**
     * Go to previous slide.
     *
     * @returns {shower.Player}
     */
    prev() {
        this.events.emit('prev');
        return this;
    }

    /**
     * Go to first slide.
     *
     * @returns {shower.Player}
     */
    first() {
        this.go(0);
        return this;
    }

    /**
     * Go to last slide.
     *
     * @returns {shower.Player}
     */
    last() {
        this.go(this._shower.getSlidesCount() - 1);
        return this;
    }

    /**
     * Go to custom slide by index.
     *
     * @param {number | Slide} index Slide index to activate.
     * @returns {shower.Player}
     */
    go(index) {
        // If go by slide istance.
        if (typeof index !== 'number') {
            index = this._shower.getSlideIndex(index);
        }

        var slidesCount = this._shower.getSlidesCount();
        var currentSlide = this._currentSlide;

        if (index != this._currentSlideNumber && index < slidesCount && index >= 0) {
            if (currentSlide && currentSlide.isActive()) {
                currentSlide.deactivate();
            }

            currentSlide = this._shower.get(index);

            this._currentSlide = currentSlide;
            this._currentSlideNumber = index;

            if (!currentSlide.isActive()) {
                currentSlide.activate();
            }

            this.events.emit('activate', {
                index: index,
                slide: currentSlide
            });
        }

        return this;
    }

    /**
     * @returns {Slide} Current active slide.
     */
    getCurrentSlide() {
        return this._currentSlide;
    }

    /**
     * @returns {Number} Current active slide index.
     */
    getCurrentSlideIndex() {
        return this._currentSlideNumber;
    }

    _onPrev() {
        this._changeSlide(this._currentSlideNumber - 1);
    }

    _onNext() {
        this._changeSlide(this._currentSlideNumber + 1);
    }

    /**
     * @ignore
     * @param {number} index Slide index.
     */
    _changeSlide(index) {
        this.go(index);
    }

    _onSlideAdd(e) {
        const slide = e.get('slide');

        slide.events
            .on('activate', this._onSlideActivate, this);
    }

    _onSlideRemove(e) {
        const slide = e.get('slide');

        slide.events
            .off('activate', this._onSlideActivate, this);
    }

    _onSlideActivate(e) {
        const slide = e.get('slide');
        const slideNumber = this._shower.getSlideIndex(slide);

        this.go(slideNumber);
    }

    _onKeyDown(e) {
        if (!this._shower.isHotkeysEnabled() ||
            /^(?:button|input|select|textarea)$/i.test(e.target.tagName)) {
            return;
        }

        this.events.emit('keydown', {
            event: e
        });

        switch (e.which) {
            case 33: // PgUp
            case 38: // Up
            case 37: // Left
            case 72: // H
            case 75: // K
                if (e.altKey || e.ctrlKey || e.metaKey) { return; }
                e.preventDefault();
                this.prev();
                break;

            case 34: // PgDown
            case 40: // Down
            case 39: // Right
            case 76: // L
            case 74: // J
                if (e.altKey || e.ctrlKey || e.metaKey) { return; }
                e.preventDefault();
                this.next();
                break;

            case 36: // Home
                e.preventDefault();
                this.first();
                break;

            case 35: // End
                e.preventDefault();
                this.last();
                break;

            case 32: // Space (Shift)
                if (this._shower.container.isSlideMode()) {
                    if (e.shiftKey) {
                        this.prev();
                    } else {
                        this.next();
                    }
                }
                break;
        }
    }

    _onSlideModeEnter() {
        if (!this._currentSlide) {
            this.first();
        }
    }
}
