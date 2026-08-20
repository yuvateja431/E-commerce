/**
 * Robust utility function to check if two addresses are duplicates
 * and deduplicate user addresses list.
 */
const normalizeStr = (str) => String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export const isSameAddress = (a, b) => {
    if (!a || !b)
        return false;
    if (a.id && b.id && a.id === b.id)
        return true;
    const zipA = normalizeStr(a.postalCode || a.zipCode);
    const zipB = normalizeStr(b.postalCode || b.zipCode);
    if (zipA && zipB && zipA !== zipB)
        return false;
    const lineA = normalizeStr(a.addressLine1 || a.street);
    const lineB = normalizeStr(b.addressLine1 || b.street);
    if (!lineA || !lineB)
        return false;
    if (lineA === lineB)
        return true;
    if (lineA.includes(lineB) || lineB.includes(lineA))
        return true;
    const prefixA = lineA.slice(0, 12);
    const prefixB = lineB.slice(0, 12);
    if (prefixA.length >= 6 && prefixA === prefixB)
        return true;
    return false;
};
export const deduplicateAddresses = (addresses) => {
    if (!Array.isArray(addresses))
        return [];
    const result = [];
    for (const addr of addresses) {
        if (!addr)
            continue;
        const existingIdx = result.findIndex((item) => isSameAddress(item, addr));
        if (existingIdx === -1) {
            result.push(addr);
        }
        else {
            const existing = result[existingIdx];
            const isExistingPlaceholder = existing.phone === "0000000000" || !existing.phone;
            const isNewReal = addr.phone && addr.phone !== "0000000000";
            if ((addr.isDefault && !existing.isDefault) ||
                (isExistingPlaceholder && isNewReal)) {
                result[existingIdx] = addr;
            }
        }
    }
    return result;
};
