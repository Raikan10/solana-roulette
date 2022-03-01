export const getReturnAmount = (amount, ratio) => {
    return amount * ratio;
}

export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const totalAmountToBePaid = (amount) => {
    return amount
}
