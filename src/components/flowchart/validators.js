export function stringValidator (value) {
    // noinspection EqualityComparisonWithCoercionJS
    return value.toString() == value
}

export function numberValidator (value) {
    // noinspection EqualityComparisonWithCoercionJS
    return parseFloat(value) == value
}

export function booleanValidator (value) {
    // noinspection EqualityComparisonWithCoercionJS
    return value == true || value == false
}