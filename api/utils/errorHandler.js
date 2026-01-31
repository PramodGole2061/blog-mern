//When we need to return an error manually unlike in validation where server throws error automatically with res,
//we still need to give the error to next() in the custom error handling middleware which is in the index.js
//this custom error will be passed as first argument in the app.use((error, req, res, next)=>{})
export const errorHandler = (statusCode, message)=>{
    //custom creating new error object
    const error = new Error();
    //adding status code and message to the new custom error above
    error.statusCode = statusCode;
    error.message = message;

    
    return error;
}