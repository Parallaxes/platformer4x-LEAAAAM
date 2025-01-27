export class LocalStorage {
    constructor(keys) {
        this.keys = keys;
        console.log("browser local storage available: " + String(this.storageAvailable));
    }

    get storageAvailable() {
        try {
            const storage = window.localStorage;
            const testKey = '__storage_test__';
            storage.setItem(testKey, testKey);
            storage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    save(key) {
        if (!this.storageAvailable) { return; }
        window.localStorage.setItem(key, this[key]);
    }

    load(key) {
        if (!this.storageAvailable) { return; }
        this[key] = window.localStorage.getItem(key);
    }

    saveAll() {
        if (!this.storageAvailable) { return; }
        Object.keys(this.keys).forEach(key => {
            window.localStorage.setItem(key, this[key]);
        });
    }

    loadAll() {
        if (!this.storageAvailable) { return; }
        Object.keys(this.keys).forEach(key => {
            this[key] = window.localStorage.getItem(key);
        });
    }
}

export default LocalStorage;