import os
import shutil
import yaml
import json

from brownie import accounts, network, config

LOCAL_BLOCKCHAIN_ENV = ["development", "ganache", "mainnet-fork"]


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if network.show_active() in LOCAL_BLOCKCHAIN_ENV:
        return accounts[0]

    return accounts.add(config["wallets"]["from_key"])


def update_frontend():
    copy_folders_to_frontend("./build", "./frontend/src/chain-info")

    with open("brownie-config.yaml", "r") as brownie_config:
        config_dictionary = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dictionary, brownie_config_json)
    print("Frontend updated")


def copy_folders_to_frontend(src, destination):
    if os.path.exists(destination):
        shutil.rmtree(destination)
    shutil.copytree(src, destination)
