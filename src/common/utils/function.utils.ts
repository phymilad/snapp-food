export function isBoolean(value: any) {
    return [false, "false", true, "true"].includes(value)
}

export function toBoolean(value: any) {
    if([true, "true"].includes(value)) return true
    else if([false, "false"].includes(value)) return false
    return value
}
