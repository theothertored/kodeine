export class BidirectionalMap<TA, TB> {

    private readonly _AToBMap = new Map<TA, TB>();
    private readonly _BToAMap = new Map<TB, TA>();

    clear(): void {
        this._AToBMap.clear();
        this._BToAMap.clear();
    }

    deleteByA(a: TA): boolean {

        let b = this._AToBMap.get(a);

        if (b) {
            this._AToBMap.delete(a);
            this._BToAMap.delete(b);
            return true;
        } else {
            return false;
        }

    }

    deleteByB(b: TB): boolean {

        let a = this._BToAMap.get(b);

        if (a) {
            this._AToBMap.delete(a);
            this._BToAMap.delete(b);
            return true;
        } else {
            return false;
        }

    }

    forEachA(callbackfn: (value: TB, key: TA, map: Map<TA, TB>) => void, thisArg?: any): void {
        this._AToBMap.forEach(callbackfn);
    }

    forEachB(callbackfn: (value: TA, key: TB, map: Map<TB, TA>) => void, thisArg?: any): void {
        this._BToAMap.forEach(callbackfn);
    }

    getByA(a: TA): TB | undefined {
        return this._AToBMap.get(a);
    }

    getByB(b: TB): TA | undefined {
        return this._BToAMap.get(b);
    }

    hasA(a: TA): boolean {
        return this._AToBMap.has(a);
    }

    hasB(b: TB): boolean {
        return this._BToAMap.has(b);
    }

    set(a: TA, b: TB): this {

        // delete entries first to avoid desyncs when set is called with one key that already exists and another that doesn't
        this.deleteByA(a);
        this.deleteByB(b);

        this._AToBMap.set(a, b);
        this._BToAMap.set(b, a);

        return this;
    }

    get size(): number {
        return this._AToBMap.size;
    }

    entries(): IterableIterator<[TA, TB]> {
        return this._AToBMap.entries();
    }

    aEntries(): IterableIterator<TA> {
        return this._AToBMap.keys();
    }

    bEntries(): IterableIterator<TB> {
        return this._AToBMap.values();
    }

    [Symbol.iterator](): IterableIterator<[TA, TB]> {
        return this.entries();
    }

    get [Symbol.toStringTag](): string {
        return 'BidirectionalMap';
    }

}