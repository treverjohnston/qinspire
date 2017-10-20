let Keep = require('../models/keep')
let Task = require('../models/task')
let Comments = require('../models/comments')
console.log('right page')
module.exports = {
  Vault: {
    path: '/vaults/:vaultId',
    reqType: 'get',
    method(req, res, next){
      let action = 'Find Vault'
      Vault.findById(req.params.vaultId)
        .then(vault => {
          console.log(vault)
          res.send(handleResponse(action, vault))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  //keeps
  KeepByVaultId: {
    path: '/vaults/:vaultId/keeps',
    reqType: 'get',
    method(req, res, next){
      let action = 'Find keeps by vaultId'

      // Keep.
      Keep.find({vaults: req.params.vaultId})
        .then(keep => {
          res.send(handleResponse(action, keep))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  PostKeep: {
    path: '/vaults/:vaultId/keeps',
    reqType: 'post',
    method(req, res, next){
      let action = 'Post keeps to vault'

      Keep.create(req.body)
        .then(keep => {
          res.send(handleResponse(action, keep))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  DeleteKeep: {
    path: '/vaults/:vaultId/keeps/:keepId',
    reqType: 'delete',
    method(req, res, next){
      let action = 'Delete keeps from vault'
      Keep.findByIdAndRemove(req.params.keepId)
        .then(keep => {
          res.send(handleResponse(action, keep))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  //tasks
  TaskbyKeepId: {
    path: '/vaults/:vaultId/keeps/:keepId/task',
    reqType: 'get',
    method(req, res, next){
      let action = 'Find Tasks by keepId'
      
      Task.find({keepId: req.params.keepId})
        .then(task => {
          res.send(handleResponse(action, task))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  PostTask: {
    path: '/vaults/:vaultId/keeps/:keepId/task',
    reqType: 'post',
    method(req, res, next){
      let action = 'Post Task to keep'
      
      Task.create(req.body)
        .then(task => {
          res.send(handleResponse(action, task))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  PutTask: {
    path: '/vaults/:vaultId/keeps/:keepId/task/:taskId',
    reqType: 'put',
    method(req, res, next){
      let action = 'Moving task to new keep'
      Task.findByIdAndUpdate({keepId: req.params.keepId}, task)
      .then(task=>{
        res.send(handleResponse(action, task))
      })
      .catch(error=> {
        return next(handleResponse(action, null, error))
      })
    }
  },
  DeleteTask: {
    path: '/vaults/:vaultId/keeps/:keepId/task/:taskId',
    reqType: 'delete',
    method(req, res, next){
      let action = 'Delete Task from keep'
      Task.findByIdAndRemove(req.params.taskId)
        .then(task => {
          res.send(handleResponse(action, task))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  //comments
  CommentbyTaskId: {
    path: '/vaults/:vaultId/keeps/:keepId/task/:taskId/comments',
    reqType: 'get',
    method(req, res, next){
      let action = 'Find comments by taskId'
      
      Comments.find({taskId: req.params.taskId})
        .then(comment => {
          res.send(handleResponse(action, comment))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  PostComment: {
    path: '/vaults/:vaultId/keeps/:keepId/task/:taskId/comments',
    reqType: 'post',
    method(req, res, next){
      let action = 'Post Comment to task'
      Comments.create(req.body)
        .then(comment => {
          res.send(handleResponse(action, comment))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  DeleteComment: {
    path: '/vaults/:vaultId/keeps/:keepId/task/:taskId/comments/:commentId',
    reqType: 'delete',
    method(req, res, next){
      let action = 'Delete comment from task'
      Comments.findByIdAndRemove(req.params.commentId)
        .then(comment => {
          res.send(handleResponse(action, comment))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  }
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