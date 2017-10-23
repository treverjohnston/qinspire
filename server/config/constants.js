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
    endpoint: 'todo',
    useCustomRoutes: true
  },
  image: {
    name: 'Image',
    endpoint: 'image',
    useCustomRoutes: true,
    preventDefaultApi: true,    
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