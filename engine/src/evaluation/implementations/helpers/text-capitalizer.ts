
export const TextCapitalizer = (() => ({

    capitalize: (text: string): string => {

        // Kustom only capitalizes letters at the start of the string and after spaces
        // the pattern should be: (?<=^|\s).
        // this would make it work for characters after start of string and after any whitespace
        // but for now, this implementation replicated the flawed behaviour
        return text.replace(/(?<=^| )./g, match => match.toUpperCase());

    },

    capitalizeFirstLetter: (text: string): string => {
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

}))();
