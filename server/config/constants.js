const actions = {
  create: 'Create',
  update: 'Update',
  remove: 'Remove',
  find: 'Find',
  findAll: 'Find All'
}

const models = {
  todo: {
    name: 'Todo',
    endpoint: 'Todo',
    useCustomRoutes: true
  },
  keep: {
    name: 'Keep',
    endpoint: 'Keeps'
    
  },

  task: {
    name: 'Task',
    endpoint: 'Tasks'
  },

  comments: {
    name: 'Comments',
    endpoint: 'Comments'
  },

  user: {
    name: 'User',
    endpoint: 'users',
    preventDefaultApi: true,
    useCustomRoutes: true
  }
}


module.exports = {
  actions,
  models
}