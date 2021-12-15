from scripts.deploy import deploy
import pytest
from brownie import network
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENV, get_account


def test_create_task_on_rinkeby():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENV:
        pytest.skip("Only for integration testing")

    account = get_account()
    todo_list = deploy()

    tx = todo_list.createTask("test",  {"from": account})

    content = tx.events["TaskCreated"]["content"]
    id = tx.events["TaskCreated"]["id"]
    completed = tx.events["TaskCreated"]["completed"]

    assert todo_list.taskCount() == 3
    assert content == "test"
    assert id == 3
    assert completed == False