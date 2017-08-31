// when DOM ready
$(function() {
  // simple persistence model for todos using jQuery ajax apis
  var todoModel = {
    path: '/api/todo',

    getAll: function () {
      return $.get(this.path);
    },

    create: function (task) {
      return $.post(this.path, task);
    },

    update: function (id, task) {
      return $.ajax({
        url: this.path + '/' + id,
        method: 'PUT',
        data: task
      });
    },

    remove: function (id) {
      return $.ajax({
        url: this.path + '/' + id,
        method: 'DELETE'
      });
    }
  };

  // todos main component
  var todos = new Vue({
    el: '#content',

    template: '#todo-template',

    // todos initial state
    data: {
      todos: [],
      newTask: ''
    },

    // lifecycle hook for fetching todos after mounted
    mounted: function () {
      var self = this;
      // programmatically auto focus after mounted
      self.$refs.autofocus.focus();
      todoModel.getAll().done(function(todos){
        self.todos = todos;
      }).fail(function(){
        console.error('failed to retrieve todos');
      });
    },

    // methods for the main Vue
    methods: {
      // handle new task creation
      addTask: function () {
        var self = this;
        if (self.newTask) {
          todoModel.create({
            name: self.newTask
          }).done(function(task){
            // add the new task to the todos
            self.todos.push(task);
            // reset value and clear the input field
            self.newTask = '';
          }).fail(function(){
            console.error('failed to create the new task');
          });
        }
      },

      // handle task deletion
      removeTask: function (task) {
        var self = this;
        todoModel.remove(task.id).done(function(){
          self.todos.splice(self.todos.indexOf(task), 1);
        }).fail(function(){
          console.error('failed to delete the task');
        });
      }
    }
  });

  // task component
  Vue.component('task', {
    // data must be declared as a function that returns the initial data object for component
    data: function () {
      return {
        editing: false
      };
    },

    // this component accepts task prop from its parent
    props: ['task'],

    template: '#task-template',

    // watch task change for server persistence
    watch: {
      'task.name': function (name, oldName) {
        // if oldName is empty, just skip since it's for resetting value
        if (oldName) {
          if (name) {
            todoModel.update(this.task.id, {
              name: name
            }).fail(function(){
              console.error('failed to update the task');
            });
          } else {
            // if name is empty, reset to its original value
            this.task.name = oldName;
          }
        }
      },

      'task.done': function (done) {
        todoModel.update(this.task.id, {
          done: done
        }).fail(function(){
          console.error('failed to update the task');
        });
      }
    },

    // methods for the component
    methods: {
      blur: function () {
        this.editing = false;
      },

      triggerBlur: function (event) {
        event.target.blur();
      },

      editTask: function (event) {
        this.editing = true;
      }
    },

    // define a custom focus directive to auto-focus input field when editing
    directives: {
      focus: function (el, binding) {
        if (binding.value) {
          el.focus();
        }
      }
    }
  });
});
