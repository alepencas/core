/**
 * @file History controller for shower.
 */
import SessionStore from '../utils/session-store';
import bound from '../utils/bound';

/**
 * @typedef {object} slideInfo
 * @property {Slide} slide Slide instance.
 * @property {number} index Slide index.
 */

/**
 * @class
 * @name shower.Location
 */
export default class Location {
     /*
     * @param {Shower} shower
     */
    constructor(shower) {
        this._shower = shower;

        var sessionStoreKey = shower.options.get('sessionstore_key') + '-shower.Location';
        this.state = new SessionStore(sessionStoreKey, {isSlideMode: false});

        this._showerListeners = null;
        this._playerListeners = null;
        this._documentTitle = document.title;

        this._popStateProcess = null;

        this._setupListeners();
        this._init();
    }

    destroy() {
        this._clearListeners();
    },

    /**
     * Save current Shower state, e.g.:
     * - slide (index or id);
     * - slide mode.
     */
    save() {
        this.state.set('isSlideMode', this._isSlideMode());
    }

    _init() {
        const shower = this._shower;
        const currentSlideId = window.location.hash.substr(1);
        var slideInfo;
        var slideModeClass = shower.options.get('mode_full_classname');

        // Need for first slide focus.
        window.location.hash = '';

        // Check state value and classlist only when first initialization.
        if (this.state.get('isSlideMode') || document.body.classList.contains(slideModeClass)) {
            shower.container.enterSlideMode();
        }

        if (currentSlideId !== '') {
            slideInfo = this._getSlideById(currentSlideId);
            shower.player.go(typeof slideInfo.index !== 'undefined' ? slideInfo.index : 0);
        }
    }

    _setupListeners() {
        const shower = this._shower;

        this._playerListeners = shower.player.events.group()
            .on('activate', this._onSlideActivate, this);

        this._containerListener = shower.container.events.group()
            .on(['slidemodeenter', 'slidemodeexit'], this._onContainerSlideModeChange, this);

        window.addEventListener('popstate', bound(this, '_onPopstate'));
    }

    _clearListeners() {
        window.removeEventListener('popstate', bound(this, '_onPopstate'));
        this._playerListeners.offAll();
        this._containerListener.offAll();
    }

    /**
     * @ignore
     * @param {string} slideId
     * @return {slideInfo} Slide info object.
     */
    _getSlideById(slideId) {
        var slides = this._shower.getSlides();
        var slide;
        var index;

        for (var i = slides.length - 1; i >= 0; i--) {
            if (slides[i].getId() === slideId) {
                slide = slides[i];
                index = i;
                break;
            }
        }

        return {
            slide: slide,
            index: index
        };
    }

    _onSlideActivate(e) {
        window.location.hash = e.get('slide').getId();
        this._setTitle();
    }

    _onContainerSlideModeChange() {
        this._setTitle();
        this.save();
    }

    _isSlideMode() {
        return this._shower.container.isSlideMode();
    }

    _onPopstate() {
        var shower = this._shower;
        var slideId = window.location.hash.substr(1);
        var slideInfo;
        var currentSlide = shower.player.getCurrentSlide();
        var currentSlideNumber = shower.player.getCurrentSlideIndex();

        // Go to first slide, if hash id is invalid or isn't set.
        // Same check is located in DOMContentLoaded event,
        // but it not fires on hash change
        if (this._isSlideMode() && currentSlideNumber === -1) {
            shower.player.go(0);
        // In List mode, go to first slide only if hash id is invalid.
        } else if (currentSlideNumber === -1 && window.location.hash !== '') {
            shower.player.go(0);
        }

        if (currentSlide && slideId !== currentSlide.getId()) {
            slideInfo = this._getSlideById(slideId);
            shower.player.go(slideInfo.index);
        }
    }

    _setTitle() {
        var title = document.title;
        var isSlideMode = this._isSlideMode();
        var currentSlide = this._shower.player.getCurrentSlide();

        if (isSlideMode && currentSlide) {
            var slideTitle = currentSlide.getTitle();

            document.title = slideTitle ?
                slideTitle + ' — ' + this._documentTitle :
                this._documentTitle;

        } else if (this._documentTitle !== title) {
            document.title = this._documentTitle;
        }
    }
}
