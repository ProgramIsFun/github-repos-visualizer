// let initStateee;
// initStateee ={
//   isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
//   user: JSON.parse(localStorage.getItem("user")) || null,
//   client_id: process.env.REACT_APP_CLIENT_ID,
//   redirect_uri: process.env.REACT_APP_REDIRECT_URI,
//   client_secret: process.env.REACT_APP_CLIENT_SECRET,
//   proxy_url: process.env.REACT_APP_PROXY_URL
// };
// //original repo reducer
//
// const reducer = (state=initStateee, action) => {
//   switch (action.type) {
//     case "LOGIN": {
//       localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
//       localStorage.setItem("user", JSON.stringify(action.payload.user))
//
//       console.log("reducer payload inside LOGINNNNNNNNNNNN",  action.payload)
//       // console.log(action.payload.repo)
//       return {
//         ...state,
//         isLoggedIn: action.payload.isLoggedIn,
//         user: action.payload.user,
//         repo: action.payload.repo
//
//       };
//     }
//     case "LOGOUT": {
//       localStorage.clear()
//       return {
//         ...state,
//         isLoggedIn: false,
//         user: null,
//         repo: null
//       };
//     }
//
//     default:
//       return state;
//   }
// };
// export default reducer;
