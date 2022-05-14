/** A class handling two-way mapping between objects of type {@link TA} and {@link TB}. */
export declare class BidirectionalMap<TA, TB> {
    private readonly _AToBMap;
    private readonly _BToAMap;
    /** Removes all entries from the map. */
    clear(): void;
    /**
     * Deletes an entry from the map by its `a` value.
     * @returns `true` when an entry was deleted, `false` otherwise.
     */
    deleteByA(a: TA): boolean;
    /**
     * Deletes an entry from the map by its `b` value.
     * @returns `true` when an entry was deleted, `false` otherwise.
     */
    deleteByB(b: TB): boolean;
    /** Runs the {@link callbackfn} for each `a` value of the map. */
    forEachA(callbackfn: (value: TB, key: TA, map: Map<TA, TB>) => void, thisArg?: any): void;
    /** Runs the {@link callbackfn} for each `b` value of the map. */
    forEachB(callbackfn: (value: TA, key: TB, map: Map<TB, TA>) => void, thisArg?: any): void;
    /** Finds a `b` value for a given `a` value. */
    getByA(a: TA): TB | undefined;
    /** Finds an `a` value for a given `b` value. */
    getByB(b: TB): TA | undefined;
    /** Checks whether the map contains an entry for an `a` value. */
    hasA(a: TA): boolean;
    /** Checks whether the map contains an entry for a `b` value. */
    hasB(b: TB): boolean;
    /** Adds a mapping between {@link a} and {@link b} to the map. Removes any existing mappings for {@link a} and {@link b}. */
    add(a: TA, b: TB): this;
    /** The entry count for the map. */
    get size(): number;
    /** Returns an iterable of `a`, `b` pairs for every entry in the map. */
    entries(): IterableIterator<[TA, TB]>;
    /** Returns an iterable of `a` values in the map. */
    aEntries(): IterableIterator<TA>;
    /** Returns an iterable of `b` values in the map. */
    bEntries(): IterableIterator<TB>;
    /** Returns the default iterator to be used when this object is used as the `of` part of a `for...of` loop. */
    [Symbol.iterator](): IterableIterator<[TA, TB]>;
    /** Used to describe this object when toString() is called ([object BidirectionalMap] instead of [object Object]). */
    get [Symbol.toStringTag](): string;
}
