exports.error = function(req, res, statusCode, message, err) {
    if(req.app.get('env') === 'development') {
        res
            .status(statusCode || 500)
            .json({
                message: message || err.message,
                error: err || {}
            });
    } else {
        res
        .status(statusCode || 500)
        .json({
            message: message || err.message,
            error: {}
        });
    }
}

exports.replaceId = function(entity) {
    if(entity) {
        entity.id = entity._id;
        delete (entity._id);
    }
    return entity;
}

exports.getCurrentTime = function() {
    let date = new Date();
    return date.toLocaleString();
}