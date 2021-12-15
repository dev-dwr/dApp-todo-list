// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        bool completed;
        uint256 id;
        string content;
    }

    mapping(uint256 => Task) public tasks;

    event TaskCreated(bool completed, uint256 id, string content);
    event TaskCompleted(uint256 id, bool completed);

    constructor() public {
        createTask("first task");
    }

    function createTask(string memory _content) public{
        taskCount++;
        tasks[taskCount] = Task(false, taskCount , _content);
        emit TaskCreated(false, taskCount , _content);
    }

    function completeTask(uint256 _id) public{
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

}