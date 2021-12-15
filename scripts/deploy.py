

from brownie import TodoList

from scripts.helpful_scripts import get_account, update_frontend


def deploy(frontend_update=False):
    account = get_account()
    todo_list = TodoList.deploy({"from": account})
    create_task_tx = todo_list.createTask("task1", {"from": account})
    create_task_tx.wait(1)

    complete_task_tx = todo_list.completeTask(1, {"from": account})
    complete_task_tx.wait(1)

    if frontend_update:
        update_frontend()

    return todo_list


def main():
    deploy(frontend_update=True)
