export const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

export const isValidAmount = (amount: string): boolean => {
    // Check if amount is a valid decimal with up to 4 places
    const amountRegex = /^\d+(\.\d{1,4})?$/;
    if (!amountRegex.test(amount)) return false;

    const val = parseFloat(amount);
    return !isNaN(val) && val > 0;
};
