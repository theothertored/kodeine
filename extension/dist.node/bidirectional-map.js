"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidirectionalMap = void 0;
class BidirectionalMap {
    constructor() {
        this._AToBMap = new Map();
        this._BToAMap = new Map();
    }
    clear() {
        this._AToBMap.clear();
        this._BToAMap.clear();
    }
    deleteByA(a) {
        let b = this._AToBMap.get(a);
        if (b) {
            this._AToBMap.delete(a);
            this._BToAMap.delete(b);
            return true;
        }
        else {
            return false;
        }
    }
    deleteByB(b) {
        let a = this._BToAMap.get(b);
        if (a) {
            this._AToBMap.delete(a);
            this._BToAMap.delete(b);
            return true;
        }
        else {
            return false;
        }
    }
    forEachA(callbackfn, thisArg) {
        this._AToBMap.forEach(callbackfn);
    }
    forEachB(callbackfn, thisArg) {
        this._BToAMap.forEach(callbackfn);
    }
    getByA(a) {
        return this._AToBMap.get(a);
    }
    getByB(b) {
        return this._BToAMap.get(b);
    }
    hasA(a) {
        return this._AToBMap.has(a);
    }
    hasB(b) {
        return this._BToAMap.has(b);
    }
    set(a, b) {
        // delete entries first to avoid desyncs when set is called with one key that already exists and another that doesn't
        this.deleteByA(a);
        this.deleteByB(b);
        this._AToBMap.set(a, b);
        this._BToAMap.set(b, a);
        return this;
    }
    get size() {
        return this._AToBMap.size;
    }
    entries() {
        return this._AToBMap.entries();
    }
    aEntries() {
        return this._AToBMap.keys();
    }
    bEntries() {
        return this._AToBMap.values();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    get [Symbol.toStringTag]() {
        return 'BidirectionalMap';
    }
}
exports.BidirectionalMap = BidirectionalMap;
//# sourceMappingURL=bidirectional-map.js.map