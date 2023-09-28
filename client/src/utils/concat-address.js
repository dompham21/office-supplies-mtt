export function concatAddress(spec, ward, district, province) {
    return spec + ', ' + ward + ', ' + district + ', ' + province 
}

export function extractAddress(address) {
    const addressComponents = address.split(', ');
    
    const spec = addressComponents[0] ?? null;
    const wa = addressComponents[1]?? null;
    const dis = addressComponents[2]?? null;
    const prov = addressComponents[3]?? null;

    return {
        spec, wa, dis, prov
    }
}