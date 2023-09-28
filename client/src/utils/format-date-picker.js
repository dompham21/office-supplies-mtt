export const formatDatePicker = (dateStr) => {
    if(dateStr != null || dateStr != '') {
        const dateSplitGMT = dateStr.split('GMT')[0] +' UTC';
        let date = new Date(dateSplitGMT)
    
        const formattedDateStr = date.toISOString()
        

        return formattedDateStr
    }
    return ''

}