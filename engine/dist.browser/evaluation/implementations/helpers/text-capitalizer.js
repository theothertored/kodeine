export const TextCapitalizer = (() => ({
    capitalize: (text) => {
        // Kustom only capitalizes letters at the start of the string and after spaces
        // the pattern should be: (?<=^|\s).
        // this would make it work for characters after start of string and after any whitespace
        // but for now, this implementation replicated the flawed behaviour
        return text.replace(/(?<=^| )./g, match => match.toUpperCase());
    }
}))();
//# sourceMappingURL=text-capitalizer.js.map