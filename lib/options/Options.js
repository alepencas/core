/**
 * @fileOverview Options manager.
 */
import EventEmitter from '../events/emitter';
import Monitor from '../options/monitor';
import Store from '../utils/store';
import extend from '../utils/extend';

export default class Options {
    /**
     * @constructor
     * @param {object} [initOptions].
     *
     * @example
     * var options = new Options({debug: false});
     *
     * options.get('debug'); // -> false
     * options.get('blabla', 'hello'); // -> 'hello'
     * options.get('hello'); // -> undefined
     */
    constructor(initOptions) {
        super(...arguments);

        /**
         * Event emitter
         * @field
         * @type {EventEmitter}
         */
        this.events = new EventEmitter();
    }

    /**
     * @param {(string | object)} name Option name or object with key-value options to set.
     * @param {object} [value]
     * @returns {Options} Self.
     */
    set(name, value) {
        var changed = [];
        if (typeof name === 'string') {
            super.set(name, value);
            changed.push({
                name: name,
                value: value
            });

        } else {
            var options = name || {};
            Object.keys(options).forEach(function (optionName) {
                var optionValue = options[optionName];
                super.set(optionName, optionValue);
                changed.push({
                    name: optionName,
                    value: optionValue
                });
            });
        }

        if (changed.length) {
            this.events.emit('set', {items: changed});
        }

        return this;
    }

    unset(name) {
        super.unset(name);
        this.events.emit('unset', {name: name});

        return this;
    }

    getMonitor() {
        return new Monitor(this);
    }
}
