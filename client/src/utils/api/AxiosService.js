import { getAuthCredentials, setAuthCredentials } from '@utils/auth-utils';
import { AUTH_CRED, REFRESHTOKEN } from '@utils/constants';
import axios from 'axios';
import Router from "next/router";


const AxiosService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT, // TODO: take this api URL from env
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
}); 

export const ProvinceAxiosService = axios.create({
  baseURL: "https://provinces.open-api.vn/api", // TODO: take this api URL from env
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

AxiosService.interceptors.request.use(
  config => {
    // const { token, permissions }  = getAuthCredentials();

    // if (accessToken) {
    //   // Configure this as per your backend requirements
    //   config.headers['Authorization'] = "Bearer " + token;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

AxiosService.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const originalConfig = err.config;

    // if (originalConfig.url !== '/login' && err.response) {
    //   // Access Token was expired
    //   if (err.response.status === 401 && !originalConfig._retry) {
    //     originalConfig._retry = true;

    //     try {
    //       const rs = await axios.get(
    //         process.env.NEXT_PUBLIC_REST_API_ENDPOINT + '/auth/token/refresh',
    //         {
    //           headers: {
    //             Authorization: "Bearer " + localStorage.getItem(REFRESHTOKEN)
    //           }
    //         }
    //       );
    //       const response  = rs.data;
    //       if(response) {
    //         const { result, data, code, status, msg, refreshToken, accessToken } = response;
    //         if(result == 1)  {
    //           const roles = data?.role; // List roles of user
    //           setAuthCredentials(accessToken, refreshToken, roles);   
    //         }
         
    //       }

    //       return AxiosService(originalConfig);
    //     } catch (_error) {
    //       // // Logging out the user by removing all the tokens from local
    //       localStorage.removeItem(AUTH_CRED);
    //       localStorage.removeItem(REFRESHTOKEN);
        
    //       Router.push("/login")
    //       return Promise.reject(_error);
    //     }
    //   }
    // }

    return Promise.reject(err);
  }
);

export const getExternalAxios = (url, params) => {
  return ProvinceAxiosService.get(url, { params: params });
}

export const get = (url, params) => {
  return AxiosService.get(url, { params: params });
}

export const post = (url, body) => {
  return AxiosService.post(url, body);
}

export const put = (url, body) => {
  return AxiosService.put(url, body);
}

export const getAuthorization = (url, params) => {
  const { token, permissions }  = getAuthCredentials();
  return AxiosService.get(url, {params: params, headers : { Authorization: `Bearer ${token}` }} )
}

export const postAuthorization = (url, body) => {
  const { token, permissions }  = getAuthCredentials();

  return AxiosService.post(url,  body, {headers : { Authorization: `Bearer ${token}` }} )
}

export const postAuthorizationWithMultipart = (url, body) => {
  const { token, permissions }  = getAuthCredentials();
  return AxiosService.post(url,  body, {headers : { Authorization: `Bearer ${token}`, "Content-type": "multipart/form-data; boundary=<calculated when request is sent>"}} )
}

 
export const putAuthorization = (url, body) => {
  const { token, permissions }  = getAuthCredentials();

  return AxiosService.put(url, body, {headers : { Authorization: `Bearer ${token}` }});
}

export const deleteAuthorization = (url) => { 
  const { token, permissions }  = getAuthCredentials();
  return AxiosService.delete(url, {headers : { Authorization: `Bearer ${token}` }});
}


export default AxiosService;