// yyyy-mm-dd to dd-mm-yyyy
export const formatDate = (x) => {
    const parts = x.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate
}

export const convertToVietnameseDate = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    const day = dateTime?.getDate();
    const month = dateTime?.getMonth() + 1; // January is month 0 in JavaScript
    const year = dateTime?.getFullYear();
    return `ngày ${day} tháng ${month.toString().padStart(2, '0')} năm ${year}`;
}