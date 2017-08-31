// todos main module; AngularJS has to start with module
var todos = angular.module('todos', []);

// define the todos controller on the todos module
todos.controller('TodosController', function ($scope, $http) {
  // initial data
  $scope.todos = [];
  $scope.newTask = '';

  $http.get('/api/todo').then(function(response){
    $scope.todos = response.data;
  }).catch(function(){
    console.error('failed to retrieve todos');
  });

  // handle new task creation
  $scope.addTask = function (event) {
    if (event.which === 13 && $scope.newTask) {
      $http.post('/api/todo', {
        name: $scope.newTask
      }).then(function(response){
        // add the new task to the todos
        $scope.todos.push(response.data);
        // reset value and clear the input field
        $scope.newTask = '';
      }).catch(function(){
        console.error('failed to create the new task');
      });
    }
  };

  // handle task deletion
  $scope.removeTask = function(task) {
    $http.delete('/api/todo/' + task.id).then(function(){
      $scope.todos.splice($scope.todos.indexOf(task), 1);
    }).catch(function(){
      console.error('failed to delete the task');
    });
  };
});

// task component
todos.component('task', {
  templateUrl: 'task-template',
  controller: function($http) {
    var self = this;
    self.blur = function(event) {
      self.editing = false;
    };

    self.triggerBlur = function(event) {
      if (event.which === 13) {
        event.target.blur();
      }
    };

    // we can't watch component data change directly so need to bind the listener in template
    // alternatively, we can use '&' binding to call parent's method for updating
    self.updateDone = function() {
      $http.put('/api/todo/' + self.task.id, {
        done: self.task.done
      }).catch(function(){
        console.error('failed to update the task');
      });
    };

    // since we can't get original value directly, we need to hold it internally for resetting
    var oldName = '';
    self.$onInit = function() {
      oldName = self.task.name;
    };

    self.updateName = function() {
      if (oldName) {
        if (self.task.name) {
          oldName = self.task.name;
          $http.put('/api/todo/' + self.task.id, {
            name: self.task.name
          }).catch(function(){
            console.error('failed to update the task');
          });
        } else {
          // if name is empty, reset to its original value
          self.task.name = oldName;
        }
      }
    };
  },
  bindings: {
    // two-way binding
    task: '=',
    // one-way method binding
    onDelete: '&'
  }
});

// define a custom focus isolate scope directive to auto-focus input field when editing
todos.directive('editingFocus', function($timeout) {
  return {
    // only matches attribute name
    restrict: 'A',
    scope: {trigger: '=editingFocus'},
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
});
