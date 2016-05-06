/**
 * @fileOverview Changes monitoring in options.
 */

/**
 * @class Monitoring fields change.
 * @name options.Monitor
 */
export default class Monitor {
    /*
     * @constructor
     * @param {Options} options
     */
    constructor(options) {
        this._options = options;
        this._optionsEvents = options.events.group()
            .on(['set', 'unset'], this._onOptionsChange, this);

        this._fieldsHanders = {};
    }

    destroy() {
        this._options = null;
        this._optionsEvents.offAll();
        this._fieldsHanders = null;
    }

    /**
     * @param {(string|string[])} field
     * @param {function} callback
     * @param {Object} [context]
     * @returns {options.Monitor} Self.
     */
    add(field, callback, context) {
        if (Array.prototype.isArray.call(null, field)) {
            var fields = field;
            for (var fieldName in fields) {
                if (fields.hasOwnProperty(fieldName)) {
                    this._addHandler(fieldName, callback, context);
                }
            }
        } else {
            this._addHandler(field, callback, context);
        }

        return this;
    }

    /**
     * @param {(string|string[])} field
     * @param {function} callback
     * @param {object} [context]
     * @returns {options.Monitor} Self.
     */
    remove(field, callback, context) {
        if (Array.prototype.isArray.call(null, field)) {
            var fields = field;
            for (var fieldName in fields) {
                if (fields.hasOwnProperty(fieldName)) {
                    this._remodeHandler(fieldName, callback, context);
                }
            }
        } else {
            this._remodeHandler(field, callback, context);
        }

        return this;
    }

    /**
     * @returns {Options} Options.
     */
    getOptions() {
        return this._options;
    }

    _onOptionsChange(event) {
        var fieldsUpdated = event.get('type') === 'unset' ?
            [event.get('name')] :
            event.get('items');

        fieldsUpdated.forEach(function (field) {
            if (this._fieldsHanders.hasOwnProperty(field)) {
                this._fieldsHanders[field].forEach(function (handler) {
                    handler.callback.call(handler.context, this._options.get(field));
                });
            }
        }, this);
    }

    _addHandler(field, callback, context) {
        var handler = {
            callback: callback,
            context: context
        };

        if (this._fieldsHanders.hasOwnProperty(fieldName)) {
            this._fieldsHanders[fieldName].push(handler);
        } else {
            this._fieldsHanders[fieldName] = [handler];
        }
    }

    _remodeHandler(field, callback, context) {
        if (!this._fieldsHanders.hasOwnProperty(field)) {
            throw new Error('Remove undefined handler for ' + field + ' field');
        }

        var fieldsHanders = this._fieldsHanders[field];
        var handler = fieldsHanders.filter(function (hander) {
            return hander.callback === callback && hander.context === context;
        })[0];

        if (!hander) {
            throw new Error('Hanlder for ' + field + ' not found.');
        }

        fieldsHanders.splice(fieldsHanders.indexOf(handler, 1));
    }
}
