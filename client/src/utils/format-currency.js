export const currencyMoney = (x) => {
    if(x == null || x == '') return ''

    return  x.toLocaleString('en-US', {style : 'currency', currency : 'VND'});
}