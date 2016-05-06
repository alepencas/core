/**
 * @file Slide.
 */
import {defaultOptions} from '../global/shower';
import EventEmitter from '../emitter/emitter';
import OptionsManager from '../options/manager';
import Layout from '../slide/layout';
import slideLayoutFactory from '../slide/layout-factory';
import DataStore from '../utils/store';

/**
 * @typedef {object} HTMLElement
 */

/**
 * @class
 * @name Slide
 *
 * Slide class.
 */
export default class Slide {
    /*
     * @constructor
     * @param {(string|HTMLElement)} content
     * @param {object} [options]
     * @param {string} [options.title_element_selector = 'H2']
     * @param {string} [options.active_classname = 'active']
     * @param {string} [options.visited_classname = 'visited']
     * @param {object} [state] Current slide state.
     * @param {number} [state.visited=0] Count of visit slide.
     */
    constructor(content, options, state) {
        this.events = new EventEmitter();
        this.options = new OptionsManager(options);
        this.layout = null;

        this.state = new DataStore({
            visited: 0,
            index: null
        }, state);

        this._content = content;
        this._isVisited = this.state.get('visited') > 0;
        this._isActive = false;

        this.init();
    }

    init() {
        this.layout = typeof this._content === 'string' ?
            new slideLayoutFactory.createLayout({
                content: this._content
            }) :
            new Layout(this._content, this.options);

        this.layout.setParent(this);
        this._setupListeners();
    }

    destroy() {
        this._clearListeners();

        this._isActive = null;
        this.options = null;

        this.layout.destroy();
    }

    /**
     * Activate slide.
     *
     * @returns {Slide}
     */
    activate() {
        this._isActive = true;

        var visited = this.state.get('visited');
        this.state.set('visited', ++visited);
        this.events.emit('activate', {
            slide: this
        });

        return this;
    }

    /**
     * Deavtivate slide.
     *
     * @returns {Slide}
     */
    deactivate() {
        this._isActive = false;
        this.events.emit('deactivate', {
            slide: this
        });

        return this;
    }

    /**
     * Get active state.
     *
     * @returns {boolean}
     */
    isActive() {
        return this._isActive;
    }

    /**
     * Get visited state.
     *
     * @returns {boolean}
     */
    isVisited() {
        return this.state.get('visited') > 0;
    }

    _setupListeners() {
        this.layoutListeners = this.layout.events.group()
            .on('click', this._onSlideClick, this);
    }

    _clearListeners() {
        this.layoutListeners.offAll();
    }

    _onSlideClick() {
        this.activate();

        this.events.emit('click', {
            slide: this
        });
    }
}
