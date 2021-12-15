from brownie import network, exceptions
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENV, get_account
from scripts.deploy import deploy
import pytest


def test_create_task():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENV:
        pytest.skip("only for local testing")
    account = get_account()
    todo_list = deploy()

    tx = todo_list.createTask("test", {"from": account})

    content = tx.events["TaskCreated"]["content"]
    id = tx.events["TaskCreated"]["id"]
    completed = tx.events["TaskCreated"]["completed"]

    assert todo_list.taskCount() == 3
    assert content == "test"
    assert id == 3
    assert completed == False


def test_complete_task():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENV:
        pytest.skip("only for local testing")
    account = get_account()
    todo_list = deploy()

    # Act
    tx = todo_list.completeTask(2, {"from": account})

    completed = tx.events["TaskCompleted"]["completed"]
    id = tx.events["TaskCompleted"]["id"]

    assert completed == True
    assert id == 2
