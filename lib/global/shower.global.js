import EventEmitter from '../events/emitter';
import Plugins from './plugins';

const inited = [];

/**
 * @name shower
 * @class
 * @static
 */
export default const sh = {
    /**
     * Ready function will call callback when Shower init.
     * If Shower already initialized, callback will call immediately.
     *
     * @param {function} [callback] Your function that run after Shower initialized.
     * It will be call with shower.
     * @returns {boolean} Ready state.
     *
     * @example
     * shower.ready(function (sh) {
     *     sh.go(2);
     * });
     */
    ready(callback) {
        if (callback) {
            if (inited.length) {
                inited.forEach(callback);
            } else {
                this.events.once('init', function (e) {
                    callback(e.get('shower'));
                });
            }
        }

        return Boolean(inited.length);
    },

    /**
<<<<<<< 6e9554d2c9acbeec1cf3d3deef45b91ea8843400
<<<<<<< d2223a973179da4cd59acfd378ab1a29123a5a7c
=======
>>>>>>> Start rewrite to es2015
     * Init new Shower.
     * @param {object} [initOptions]
     * @param {(HTMLElement|string)} [initOptions.container='.shower']
     * @param {object} [initOptions.options]
     * @param {function} [initOptions.callback]
     * @param {object} [initOptions.context]
     *
     * @example
     * shower.init({
     *     contaner: '.my-shower',
     *     callback: this._onShowerInit,
     *     context: this
     * });
<<<<<<< 6e9554d2c9acbeec1cf3d3deef45b91ea8843400
=======
     * @name shower.events
     * @field
     * @type {Emitter}
>>>>>>> Fixed jsDoc in shower.global
=======
>>>>>>> Start rewrite to es2015
     */
    init(initOptions) {
        initOptions = initOptions || {};

        shower.modules.require(['Shower'], function (Shower) {
            new Shower(initOptions.container, initOptions.options);
        });
    },

    /**
<<<<<<< 6e9554d2c9acbeec1cf3d3deef45b91ea8843400
<<<<<<< d2223a973179da4cd59acfd378ab1a29123a5a7c
     * @returns {Shower[]} Array of shower players.
=======
     * @name shower.plugins
     * @field
     * @type {Plugins}
>>>>>>> Fixed jsDoc in shower.global
=======
     * @returns {Shower[]} Array of shower players.
>>>>>>> Start rewrite to es2015
     */
    getInited() {
        return inited.slice();
    }
};

/**
 * @name shower.plugins
 * @field
 * @type {Plugins}
 */
sh.events = new EventEmitter({context: sh});

/**
 * @name shower.events
 * @field
 * @type {Emitter}
 */
sh.plugins = new Plugins(sh);

sh.events.on('notify', function (e) {
    var showerInstance = e.get('shower');
    inited.push(showerInstance);
    sh.events.emit('init', e);
});


export const defaultOptions = {
    container_selector: '.shower',

    debug_mode: false,
    debug_mode_classname: 'debug',

    hotkeys: true,
    sessionstore_key: 'shower',

    slides_selector: '.shower .slide',

    mode_full_classname: 'full',
    mode_list_classname: 'list',

    slide_title_element_selector: 'H2',
    slide_active_classname: 'active',
    slide_visited_classname: 'visited'
};
