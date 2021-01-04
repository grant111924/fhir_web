import axios from 'axios';

const config = { 
    proxy:{
      host: 'localhost',
      port: 8080
    }
}

function _url(path){
    return 'http://localhost:8080/fhir' + path
}

// 搜尋相關的 api
const searchRequest = axios.create({
    baseURL:'http://localhost:8080/fhir'
  });

const testRequest = axios.create({
  baseURL:'http://localhost:8818',
});

const csvRequest = axios.create({
  baseURL:'http://localhost:8765',
  responseType:'blob'
});

const imageRequest = axios.create({
  baseURL:'http://localhost:4000',
});

const searchRouterRequest = axios.create({
  baseURL:'http://localhost:8765',  
});



// 搜尋相關的 api
export const apiSearch = params => searchRequest.get(`${params}`);
export const apiSearchPatient = params => searchRequest.get(`/Patient${params}`);
export const apiSearchObservation = params => searchRequest.get(`/Observation${params}`);
export const apiSearchDiagnosticReport = params => searchRequest.get(`/DiagnosticReport${params}`);
export const apiTest = params => testRequest.get(`/history${params}`)
export const apiDownload = params => csvRequest.post(`/Patient${params}`)
export const apiSearchObservation2 = params => searchRouterRequest.get(`/history/Observation${params}`)
export const apiSearchDiagnosticReport2 = params => searchRouterRequest.get(`/history/DiagnosticReport${params}`)
export const apiImage = params => imageRequest.get(`${params}`)
