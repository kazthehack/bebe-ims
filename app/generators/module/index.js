const componentExists = require('../utils/componentExists')

module.exports = {
  description: 'Add a module',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'module',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ?
          'A module with this name already exists' :
          true
      }
      return 'The name is required'
    },
  },{
    type: 'input',
    name: 'path',
    message: "What is the module's path?",
    default: '/',
  }],
  actions: (data) => {
    const actions = [{
      type: 'add',
      path: '../src/store/modules/{{path}}/{{name}}/index.js',
      templateFile: './module/index.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../src/store/modules/{{path}}/{{name}}/reducers.js',
      templateFile: './module/reducers.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../src/store/modules/{{path}}/{{name}}/actions.js',
      templateFile: './module/actions.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../src/store/modules/{{path}}/{{name}}/actionTypes.js',
      templateFile: './module/actionTypes.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../src/store/modules/{{path}}/{{name}}/selectors.js',
      templateFile: './module/selectors.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../src/store/modules/{{path}}/{{name}}/withState.js',
      templateFile: './module/withState.js.hbs',
      abortOnFail: true,
    }]

    return actions
  },
}
