import jwt_decode from 'jwt-decode' 


export const isValidToken = (token) => {
    if(!token) return false;
    const decoded = jwt_decode(token);

    const currentTime = Date.now() / 1000;
  
    return decoded && decoded?.exp > currentTime;
};