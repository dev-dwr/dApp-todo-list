import React, {useState, useEffect} from "react"
import {Checkbox, Input, makeStyles, Typography} from "@material-ui/core";
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
    const [taskValue, setTaskValue] = useState("");

    const [tasks, setTasks] = React.useState<Task[]>([])
    const {chainId, account} = useEthers()
    const {abi} = TodoListjson
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

    const todoListContractAddress = chainId ? networkMapping[String(chainId)]["TodoList"][0] : constants.AddressZero

    const todoListContract = new web3.eth.Contract(abi as AbiItem[], todoListContractAddress)

    const loadTask = async () => {
        const taskCount = await todoListContract.methods.taskCount().call()
        console.log(taskCount)

        for (let i = 1; i <= taskCount; i++) {
            const task = await todoListContract.methods.tasks(i).call()
            setTasks(el => [...el, task])
             console.log(task)
        }
    
    }
    useEffect(() => {

        loadTask().then(r => console.log(r))
        console.log(tasks)
    }, [])

    const createTask = async (content: string) => {
        setLoading(true)
        await todoListContract.methods.createTask(content).send({from: account})
            .once('receipt', () =>{
                setLoading(false)
            })
    }
    const completeTask = async (taskId: number) => {
                setLoading(true)
        await todoListContract.methods.completeTask(taskId).send({from: account})
            .once('receipt', () =>{
                setLoading(false)
            })
    }
    const changeValue = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setTaskValue(e.target.value)
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
                    : (
                        <div>
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                createTask(taskValue)
                            }}>
                                 <Input
                                    onChange={changeValue}/>
                                <Input type="submit"/>
                            </form>
                            <ul>
                                {
                                    tasks && tasks.map((task, key) => (
                                     <label>
                                         <Checkbox key={key}
                                         name={task.content}
                                         checked={task.completed}
                                         onClick={(e => {
                                             completeTask(task.id)
                                         })}
                                         />
                                          <span className="content">{task.content}</span>
                                     </label>
                                    ))}
                            </ul>
                        </div>
                    )
            }
        </>
    )
}
