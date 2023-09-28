import dayjs from "dayjs";

export default function formatDateDDMMYYYY (input) {
    if(input) {
        return dayjs(input).format('DD/MM/YYYY') // '25/01/2019
    }


}