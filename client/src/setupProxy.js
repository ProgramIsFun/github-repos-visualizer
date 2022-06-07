

const  {createProxyMiddleware}  = require('http-proxy-middleware')    // https://stackoverflow.com/questions/64867519/react-app-createproxymiddleware-is-not-a-function
// note this script will be automatically run, no need to import at anywhere
module.exports = function(app) {
    console.log("hahahahahahahaahaha")


    // BACKEND SERVER ABANDON, THIS IS LEGACY
    // app.use(createProxyMiddleware('/auth/google', { target: 'http://localhost:5000' }))
    // app.use(createProxyMiddleware('/api/*', { target: 'http://localhost:5000' }))
    // app.use(createProxyMiddleware('/testing/*', { target: 'http://localhost:5000' }))
}

