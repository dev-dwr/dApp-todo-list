import React, {useState, useEffect} from "react"
import {makeStyles, Typography} from "@material-ui/core";
import {TodoList} from "../components/TodoList";
import {useEthers} from "@usedapp/core";
import {constants} from "ethers";
import {AbiItem} from "web3-utils";
import TodoListjson from "../chain-info/contracts/TodoList.json"
import networkMapping from "../chain-info/deployments/map.json"

import Web3 from "web3"

const useStyles = makeStyles(theme => ({
    title: {
        color: theme.palette.common.black,
        textAlign: "center",
        padding: theme.spacing(4)

    }
}))

type Task = {
    completed: boolean,
    id: number,
    content: string
}


export const Main = () => {
    const classes = useStyles()
    const [loading, setLoading] = useState(false);

    const [tasks, setTasks] = React.useState<Task[]>([])
    const {chainId} = useEthers()
    const {abi} = TodoListjson
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

    // @ts-ignore
    const todoListContractAddress = chainId ? networkMapping[String(chainId)]["TodoList"][0] : constants.AddressZero

    const todoListContract = new web3.eth.Contract(abi as AbiItem[], todoListContractAddress)

    const loadTask = async () => {
        const taskCount = await todoListContract.methods.taskCount().call()

        for (let i = 1; i <= taskCount; i++) {
            const task = await todoListContract.methods.tasks(i).call()
            setTasks(el => [...el, task])
             console.log(task)
        }
    
    }
    useEffect(() => {


    }, [])

    const createTask = (content: string) => {
    }
    const completeTask = (taskId: number) => {
    }

    return (
        <>
            <Typography
                variant="h2"
                component="h1"
                classes={{
                    root: classes.title,
                }}
            >
                Todo List
            </Typography>
            {
                loading ? <p>Loading...</p>
                    : <TodoList/>
            }
        </>
    )
}
