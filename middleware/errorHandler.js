const { constants } = require("../constants")

const errorHandler = (err, req, res, next) => {
        const statusCode = res.statusCode ? res.statusCode : 500;

        switch(statusCode){
            case constants.VALIDATION_ERROR:
                res.json({
                    success: false,
                    title: "Validation Failed",
                    message: err.message, 
                    stackTrace: err.stack
                });
             break;
            case constants.NOT_FOUND:
                res.json({
                    success: false,
                    title: "Not Found",
                    message: err.message, 
                    stackTrace: err.stack
                });
             break;
            case constants.UNAUTHORIZED:
                res.json({
                    success: false,
                    title: "Unauthorized",
                    message: err.message, 
                    stackTrace: err.stack
                });
             break;
            case constants.FORBIDDEN:
                res.json({
                    success: false,
                    title: "Forbidden",
                    message: err.message, 
                    stackTrace: err.stack
                });
             break;
            case constants.DUPLICATE_RECORD:
                res.json({
                    success: false,
                    title: "Duplicate Record",
                    message: err.message, 
                    stackTrace: err.stack
                });
             break;
            case constants.SERVER_ERROR:
                res.json({
                    success: false,
                    title: "Server Error",
                    message: err.message, 
                    stackTrace: err.stack
                });
             break;
            default:
                console.log("No Error !")
                break;
        }
        next()
}

module.exports = errorHandler