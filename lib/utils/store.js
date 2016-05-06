import extend from './extend';

export default class Store {
    /**
     * @param {object} [initData={}].
     */
    constructor(initData) {
        this._data = extend({}, initData || {});

        for (var i = 1, k = arguments.length; i < k; i++) {
            extend(this._data, arguments[i] || {});
        }
    }

    /**
     * @param {string} key
     * @param {object} [defaultValue] Default value which returns if data is not definded.
     * @returns {object}
     */
    get(key, defaultValue) {
        return this._data.hasOwnProperty(key) ?
            this._data[key] :
            defaultValue;
    }

    /**
     * @returns {object} All contains data.
     */
    getAll() {
        return extend({}, this._data);
    }

    /**
     * @param {(string | object)} key Key or object with key-value data.
     * @param {object} [value]
     * @returns {Options} Self.
     */
    set(key, value) {
        this._data[key] = value;
        return this;
    }

    /**
     * @param {string} key
     * @returns {Options} Self.
     */
    unset(key) {
        if (!this._data.hasOwnProperty(key)) {
            throw new Error(key + ' not found.');
        }

        delete this._data[key];
        return this;
    }

    destroy() {
        this._data = {};
    }
}
