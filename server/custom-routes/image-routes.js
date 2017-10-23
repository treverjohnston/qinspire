let Image = require('../models/image')

module.exports = {
    Image: {
        path: '/image',
        reqType: 'get',
        method(req, res, next) {
            let action = 'Get Image'

            $.getJSON('http://www.splashbase.co/api/v1/images/search/?query=mountain', function(res){
                console.log(res)
            })
              
        }
    },
}

function handleResponse(action, data, error) {
    var response = {
        action: action,
        data: data
    }
    if (error) {
        response.error = error
    }
    return response
}