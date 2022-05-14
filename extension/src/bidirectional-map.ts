
/** A class handling two-way mapping between objects of type {@link TA} and {@link TB}. */
export class BidirectionalMap<TA, TB> {

    private readonly _AToBMap = new Map<TA, TB>();
    private readonly _BToAMap = new Map<TB, TA>();

    /** Removes all entries from the map. */
    clear(): void {
        this._AToBMap.clear();
        this._BToAMap.clear();
    }

    /** 
     * Deletes an entry from the map by its `a` value.
     * @returns `true` when an entry was deleted, `false` otherwise.
     */
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

    /** 
     * Deletes an entry from the map by its `b` value.
     * @returns `true` when an entry was deleted, `false` otherwise.
     */
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

    /** Runs the {@link callbackfn} for each `a` value of the map. */
    forEachA(callbackfn: (value: TB, key: TA, map: Map<TA, TB>) => void, thisArg?: any): void {
        this._AToBMap.forEach(callbackfn);
    }

    /** Runs the {@link callbackfn} for each `b` value of the map. */
    forEachB(callbackfn: (value: TA, key: TB, map: Map<TB, TA>) => void, thisArg?: any): void {
        this._BToAMap.forEach(callbackfn);
    }

    /** Finds a `b` value for a given `a` value. */
    getByA(a: TA): TB | undefined {
        return this._AToBMap.get(a);
    }
    
    /** Finds an `a` value for a given `b` value. */
    getByB(b: TB): TA | undefined {
        return this._BToAMap.get(b);
    }
    
    /** Checks whether the map contains an entry for an `a` value. */
    hasA(a: TA): boolean {
        return this._AToBMap.has(a);
    }
    
    /** Checks whether the map contains an entry for a `b` value. */
    hasB(b: TB): boolean {
        return this._BToAMap.has(b);
    }
    
    /** Adds a mapping between {@link a} and {@link b} to the map. Removes any existing mappings for {@link a} and {@link b}. */
    add(a: TA, b: TB): this {

        // delete entries first to avoid desyncs when set is called with one key that already exists and another that doesn't
        this.deleteByA(a);
        this.deleteByB(b);

        this._AToBMap.set(a, b);
        this._BToAMap.set(b, a);

        return this;
    }

    /** The entry count for the map. */
    get size(): number {
        return this._AToBMap.size;
    }

    /** Returns an iterable of `a`, `b` pairs for every entry in the map. */
    entries(): IterableIterator<[TA, TB]> {
        return this._AToBMap.entries();
    }

    /** Returns an iterable of `a` values in the map. */
    aEntries(): IterableIterator<TA> {
        return this._AToBMap.keys();
    }
    
    /** Returns an iterable of `b` values in the map. */
    bEntries(): IterableIterator<TB> {
        return this._AToBMap.values();
    }

    /** Returns the default iterator to be used when this object is used as the `of` part of a `for...of` loop. */
    [Symbol.iterator](): IterableIterator<[TA, TB]> {
        return this.entries();
    }

    /** Used to describe this object when toString() is called ([object BidirectionalMap] instead of [object Object]). */
    get [Symbol.toStringTag](): string {
        return 'BidirectionalMap';
    }

}