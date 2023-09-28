export const formatAddress = (address) => {
    return` ${address?.specificAddress}, ${address?.ward.fullName}, ${address?.ward?.district?.fullName}, ${address?.ward?.district?.province?.fullName}`
}