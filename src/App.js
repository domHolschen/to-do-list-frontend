import logo from './logo.svg';
import './App.css';
import { useState } from 'react/cjs/react.production.min';
import React, { Component, useContext, useEffect, useReducer } from 'react';

//var tasks = [];
//const [taskArray, setTaskArray] = useState(tasks);

/*
const React = require('react');
const ReactDOM = require('react-dom');
*/
//const client = require('./client');

function TopBanner() {
  return (
    <div className="top-banner">
      <h1>To-do List App</h1>
    </div>
  );
}


class InputBars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      desc: '',
      duedate: '',
      taskId: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  rerenderParentCallback() {
    this.forceUpdate();
  }

  handleSubmit = () => {
    this.postData(); //taskName: this.state.task, taskDescription: this.state.desc, taskDueDate: this.state.duedate
    this.rerenderParentCallback();
  }

  async postData () {
    await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskName: this.state.task,
        taskDescription: this.state.desc,
        taskDueDate: this.state.duedate
      })
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div>
        <form>
          <label>Task Name:
            <input type="text" id="task" name="task" value={this.state.task} onChange={this.handleInputChange} /><br />
          </label>
          <label >Description:
            <input type="text" id="desc" name="desc" value={this.state.desc} onChange={this.handleInputChange} /><br />
          </label>
          <label for="duedate">Due by:
            <input type="date" id="duedate" name="duedate" value={this.state.duedate} onChange={this.handleInputChange} /><br />
          </label>
        </form>
        <button onClick={this.handleSubmit}>Add Task</button>
        <TaskTable rerender={this.rerenderParentCallback} />
      </div>
    );
  }
}

function RemoveTaskButton(props) {
  const handleButtonClick = () => {
    props.tasks.splice(props.correspondingIndex, 1);
    props.rerender();
    console.log(props.tasks);
  }
  return (
    <button onClick={handleButtonClick}>Remove</button>
  );
}



function TaskTable(props) {
  const [allTasks, setAllTasks] = React.useState([]);

  const getAllTasks = async () => {
    try {
      fetch(`http://localhost:8080/tasks`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((data) => {
      return(
        data.forEach(tasks => {
          <TaskOnTable rerender={props.rerender} task={tasks} />
        })
      )
    })
         //console.log(allTasks)
    } catch (error) {
      console.log(error)
    }

    
  }

  useEffect(() => {
    

    getAllTasks();


    
  }, [allTasks]);
  
  /*
  const tasksToDisplay = allTasks.map(
    tasks => <TaskOnTable task={tasks} />
  );
  */
  

  return (
    <table id="tasktable">
      <thead>
        <tr>
          <td>Task Name:</td>
          <td>Description:</td>
          <td>Due By:</td>
          <td>Remove Task:</td>
        </tr>
      </thead>
      <tbody>
        {getAllTasks}
      </tbody>
    </table>
  );
}

function TaskOnTable(props) {
  console.log(props.task);
    return (
      <tr>
        <td key={props.task.id}>{props.task.taskName}</td>
        <td key={props.task.id}>{props.task.taskDescription}</td>
        <td key={props.task.id}>{props.task.taskDueDate}</td>
        <td key={props.task.id}>
          <RemoveTaskButton rerender={props.rerender} />
        </td>
      </tr>
    );
  }

function App() {
  return (
    <div className="App">
      <TopBanner />
      <InputBars prop="prop" />
    </div>
  );
}

export default App;
