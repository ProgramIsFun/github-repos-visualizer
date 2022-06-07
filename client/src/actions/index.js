import axios from 'axios';
import { FETCH_USER } from './types';


// export const fetchUser = () => async dispatch => {
//   const res = await axios.get('/api/current_user');
//   dispatch({ type: FETCH_USER, payload: res.data });
// };

// decide not to make an action , just put it in login is fine
// export const login = (url, data ) => async dispatch => {
//
//
// }


// export const handleToken = token => async dispatch => {
//   const res = await axios.post('/api/stripe', token);
//
//   dispatch({ type: FETCH_USER, payload: res.data });
// };
//
// export const submitSurvey = (values, history) => async dispatch => {
//   const res = await axios.post('/api/surveys', values);
//
//   history.push('/surveys');
//   dispatch({ type: FETCH_USER, payload: res.data });
// };
//
// export const submitCase = (values, history) => async dispatch => {
//   console.log("submitting case")
//   const res = await axios.post('/api/cases', values);
//
//   history.push('/cases'); //this would not close the modal    becareful
//   // dispatch({ type: FETCH_USER, payload: res.data });
//   dispatch(setAlert('Post Created', 'success'));
//   dispatch(fetchCases())
// };
//
// export const fetchCases = () => async dispatch => {
//   const res = await axios.get('/api/cases');
//   console.log("cases is retreiving, all the cases belong to that user is ",res.data)
//   dispatch({ type: FETCH_CASES, payload: res.data });
// };
//
// export const fetchSurveys = () => async dispatch => {
//   const res = await axios.get('/api/surveys');
//
//   dispatch({ type: FETCH_SURVEYS, payload: res.data });
// };
