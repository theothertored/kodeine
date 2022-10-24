
export const Utils = {

    enforceValue: (validValues: readonly string[], value: string | undefined, defaultIndex: number = 0) => {

        if (typeof value === 'undefined') {

            return validValues[defaultIndex];

        } else {

            let i = validValues.indexOf(value.trim().toLowerCase());

            if (i >= 0)
                return validValues[i];
            else
                return validValues[defaultIndex];

        }

    }

}