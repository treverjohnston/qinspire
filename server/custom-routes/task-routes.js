let Keep = require('../models/keep')
let Tasks = require('../models/task')

module.exports = {
  Tasks: {
    path: '/api/uservaults/:vaultId/keeps/:keepId/tasks',
    reqType: 'get',
    method(req, res, next){
      let action = 'Find Tasks'
      Tasks.findById({keepId: req.params.keepId})
        .then(tasks => {  
          res.send(handleResponse(action, tasks))
        }).catch(error => {
          return next(handleResponse(action, null, error))
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