import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

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
  class Todos extends React.Component {
    constructor(props) {
      super(props);
      // todos initial state
      this.state = {
        todos: [],
        newTask: ''
      };

      // make sure `this` (the todos instance) is available for DOM event handlers
      this.updateNewTask = this.updateNewTask.bind(this);
      this.addTask = this.addTask.bind(this);
      this.updateName = this.updateName.bind(this);
      this.updateDone = this.updateDone.bind(this);
      this.removeTask = this.removeTask.bind(this);
    }

    // lifecycle hook for fetching todos after mounted
    componentDidMount() {
      todoModel.getAll().done((todos) => {
        // have to use setState to update data outside of constructor
        this.setState({
          todos: todos
        });
      }).fail(() => {
        console.error('failed to retrieve todos');
      });
    }

    // this is a controlled component so need to update input value manually
    updateNewTask(event) {
      // update the input field
      this.setState({
        newTask: event.target.value
      });
    }

    // handle new task creation
    addTask(event) {
      if (event.which === 13) {
        if (event.target.value.trim()) {
          todoModel.create({
            name: event.target.value
          }).done((task) => {
            // add the new task to the todos
            this.setState({
              todos: this.state.todos.concat([task])
            });
            // reset value and clear the input field
            this.setState({
              newTask: ''
            });
          }).fail(function(){
            console.error('failed to create the new task');
          });
        }
      }
    }

    // this is a controlled component so need to update input value manually
    updateName(task, name, isSave) {
      var todos = this.state.todos;
      todos[todos.indexOf(task)].name = name;
      this.setState({
        todos: todos
      });

      if (isSave) {
        todoModel.update(task.id, {
          name: name
        }).fail(() => {
          console.error('failed to update the task');
        });
      }
    }

    // this is a controlled component so need to update input value manually
    updateDone(task, done) {
      var todos = this.state.todos;
      todos[todos.indexOf(task)].done = done;
      this.setState({
        todos: todos
      });

      todoModel.update(task.id, {
        done: done
      }).fail(() => {
        console.error('failed to update the task');
      });
    }

    // handle task deletion
    removeTask (task) {
      todoModel.remove(task.id).done(() => {
        this.state.todos.splice(this.state.todos.indexOf(task), 1);
        this.setState({
          todos: this.state.todos
        });
      }).fail(() => {
        console.error('failed to delete the task');
      });
    }

    render() {
      return (
        <div id="todos">
          <header>
            <h1>React - Todos</h1>
            {/* data binding for newTask and add keyup enter event listener */}
            <input className="new-task" autoFocus autoComplete="off"
              placeholder="Press `Enter` to add a new task"
              value={this.state.newTask}
              onChange={this.updateNewTask}
              onKeyUp={this.addTask} />
          </header>
          {this.state.todos.length > 0 &&
            <section className="main">
              <p>double-click to edit the name of a task</p>
              <ul className="todo-list">
                {/* loop through todos and show each task component with data and event binding */}
                {this.state.todos.map((task) => {
                  return (
                    <Task task={task}
                      key={task.id}
                      onDoneChange={this.updateDone}
                      onNameChange={this.updateName}
                      onDelete={this.removeTask} />
                  );
                })}
              </ul>
            </section>
          }
        </div>
      );
    }
  }

  class Task extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editing: false
      };

      this.oldName = this.props.task.name;

      // make sure `this` (the task instance) is available for DOM event handlers
      this.onNameChange = this.onNameChange.bind(this);
      this.onDoneChange = this.onDoneChange.bind(this);
      this.onDelete = this.onDelete.bind(this);
      this.blur = this.blur.bind(this);
      this.triggerBlur = this.triggerBlur.bind(this);
      this.editTask = this.editTask.bind(this);
    }

    onNameChange(event, isSave = false) {
      var name = event ? event.target.value : this.props.task.name;
      if (isSave) {
        if (name) {
          if (name === this.oldName) {
            // same value, don't need to save
            isSave = false;
          } else {
            this.oldName = name;
          }
        } else {
          // name is empty, reset to its original value
          name = this.oldName;
          isSave = false;
        }
      }
      // React is unidirectional data flow so need to lift the state change to the parent
      this.props.onNameChange(this.props.task, name, isSave);
    }

    onDoneChange(event) {
      // React is unidirectional data flow so need to lift the state change to the parent
      this.props.onDoneChange(this.props.task, event.target.checked);
    }

    onDelete() {
      // the component can't delete itself, so send an event to its parent
      this.props.onDelete(this.props.task);
    }

    blur() {
      this.setState({
        editing: false
      }, () => {
        this.onNameChange(null, true);
      });
    }

    triggerBlur(event) {
      if (event.which === 13) {
        event.target.blur();
      }
    }

    editTask() {
      this.setState({
        editing: true
      }, () => {
        // auto-focus input field when editing
        this.textInput.focus();
      });
    }

    render() {
      return (
        <li className={this.props.task.done ? 'completed' : ''}>
          {/* add or remove the editing class for the div element  */}
          <div className={'view' + (this.state.editing ? ' editing' : '')}>
            {/* data binding for task's done attribute */}
            <input type="checkbox"
              checked={this.props.task.done}
              onChange={this.onDoneChange} />
            {/* on double-click call editTask method */}
            <label onDoubleClick={this.editTask}>{this.props.task.name}</label>
            {/* data binding for task's name attribute add some event listeners */}
            <input className="edit"
              type="text"
              value={this.props.task.name}
              onChange={this.onNameChange}
              onBlur={this.blur}
              onKeyUp={this.triggerBlur}
              ref={(input) => { this.textInput = input; }} />
            {/* the component can't delete itself, so send an event to its parent */}
            <button className="remove" onClick={this.onDelete}>Remove</button>
          </div>
        </li>
      );
    }
  }

  ReactDOM.render(
    <Todos />,
    document.getElementById('content')
  );
});
