import axios from 'axios';


// 搜尋相關的 api
const searchRequest = axios.create({
  baseURL:'http://localhost:8080/fhir',  
  // baseURL:'http://172.17.0.1:8080/fhir',   docker 內網IP
});


// 搜尋相關的 api
export const apiSearchPatient = params => searchRequest.get(`/Patient${params}`);
export const apiSearchObservation = params => searchRequest.get(`/Observation${params}`);
export const apiSearchDiagnosticReport = params => searchRequest.get(`/DiagnosticReport${params}`);
