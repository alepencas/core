import Store from './store';

export default class SessionStore extends Store {
    /**
     * @augment util.Store
     * @class
     * @param {string} storeKey Local storage item key.
     * @param {object} [initData].
     */
    constructor(storeKey, initData) {
        const store = window.sessionStorage.getItem(storeKey);
        super(store && JSON.parse(store) || initData);
        this._storageKey = storeKey;

    }

    set(key, value) {
        super.set(key, value);
        this._saveToStorage();
    }

    unset(key) {
        super.unset(key);
        this._saveToStorage();
    }

    _saveToStorage() {
        window.sessionStorage.setItem(
            this._storageKey,
            JSON.stringify(this.getAll())
        );
    }

    _loadFromStorage() {
        var store = window.sessionStorage.getItem(this._storageKey);
        return store && JSON.parse(store);
    }
}
