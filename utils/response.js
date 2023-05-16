class _response{
    sendResponse(res, data){
        try {
            res.status(data.code ? data.code : 500)

            let status
            switch (data.code){
                case 200:
                    status = 'OK'
                    break;
                case 201:
                    status = 'CREATED'
                    break;
                case 400:
                    status = 'BAD_REQUEST'
                    break;
                case 401:
                    status = 'UNAUTHORIZED'
                    break;
                case 403:
                    status = 'FORBIDDEN'
                    break;
                case 404:
                    status = 'NOT_FOUND'
                    break;
                case 500:
                    status = 'INTERNAL_SERVER_ERROR'
                    break;
                default:
                    status = 'INTERNAL_SERVER_ERROR'
                    break;
            }

            if(data.code >= 200 && data.code < 400){
                res.send({
                    code : data.code,
                    status: status ? status : 'OK',
                    data : data.data ? data.data : null,
                })
            } else{
                res.send({
                    code : data.code ? data.code : 500,
                    status: status ? status : 'INTERNAL_SERVER_ERROR',
                    error : data.error ? data.error : null,
                })
            }

        } catch (error){
            log_error('Response Utils', error)
            res.status(500).send({
                code: 500,
                status: "INTERNAL_SERVER_ERROR",
                error
            })
        }
    }

    errorHandler(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            // Error jwt
            return res.status(401).send({
                code: 401,
                status: "UNAUTHORIZED",
                error: 'Invalid Token'
            });
        }

        // Default error handling
        res.status(500).send({
            code: 500,
            status: "INTERNAL_SERVER_ERROR wjsbdwj",
            error: err.message
        });

        return false
    }
}

module.exports = new _response()
