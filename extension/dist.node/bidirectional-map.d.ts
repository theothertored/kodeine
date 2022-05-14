export declare class BidirectionalMap<TA, TB> {
    private readonly _AToBMap;
    private readonly _BToAMap;
    clear(): void;
    deleteByA(a: TA): boolean;
    deleteByB(b: TB): boolean;
    forEachA(callbackfn: (value: TB, key: TA, map: Map<TA, TB>) => void, thisArg?: any): void;
    forEachB(callbackfn: (value: TA, key: TB, map: Map<TB, TA>) => void, thisArg?: any): void;
    getByA(a: TA): TB | undefined;
    getByB(b: TB): TA | undefined;
    hasA(a: TA): boolean;
    hasB(b: TB): boolean;
    set(a: TA, b: TB): this;
    get size(): number;
    entries(): IterableIterator<[TA, TB]>;
    aEntries(): IterableIterator<TA>;
    bEntries(): IterableIterator<TB>;
    [Symbol.iterator](): IterableIterator<[TA, TB]>;
    get [Symbol.toStringTag](): string;
}
