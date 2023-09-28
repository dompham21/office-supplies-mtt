export const formatIsoStringDate = (dateStr) => {
    const date = new Date(dateStr); // Parse the ISO date string into a Date object
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // add 1 to month because it is zero-indexed
    const year = date.getUTCFullYear().toString();
    
    const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    return formattedDate;
}