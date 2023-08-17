import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate, useParams } from "react-router";

const GoalsForm = () => {
    const auth = useContext(AuthContext);
    const params = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState([])

    const [category, setCategory] = useState("")
    // TODO: put in a default category here
    // TODO: find a way to get the category Name here
    const[type, setType] = useState("spending")
    const[amount, setAmount] = useState("")
    const[startDate, setStartDate] = useState("")
    const[endDate, setEndDate] = useState("")

    const resetState = () => {
        setCategory("")
        //TODO: Give this default category
        //TODO: is this a category Id, category Name, or both?
        setType("")
        setAmount("")
        setStartDate("")
        setEndDate("")
    }

    useEffect(() => {
        if (params.goalsId !== undefined){
            fetch(`http://localhost:8080/api/vault/goal/${params.goalsId}`)
            .then(response => {
                if(response.ok){
                    response.json()
                    .then(targetGoal => {
                        setCategory(targetGoal.category)
                        setType(targetGoal.type)
                        setAmount(targetGoal.amount)
                        setStartDate(targetGoal.startDate)
                        setEndDate(targetGoal.endDate)
                    })
                } else {
                    console.log(`unexpected response status code: ${response.status}`)
                }
            })
        } else{
            resetState()
        }
    }, [params.goalsId])

    //TODO: Handle Submit and the return form
    //TODO: figure out what needs to be different for a budget vs a savings goal
    const handleSubmit = (evt) => {
        evt.preventDefault()
        const newGoal = {
            category: category,
            type: type,
            amount: amount,
            startDate: startDate,
            endDate: endDate,
            //TODO: Check that all of these varialbe names are the right ones
        }
        let url = null;
        let method = null;

        if(params.goalsId !== undefined){
            newGoal.goalsId = params.goalsId;
            url = `http://localhost:8080/api/vault/goal/${params.goalsId}`
            method = "PUT"
        } else {
            url = "http://localhost:8080/api/vault/goal/create"
            method = "POST"
        }

        fetch(url, {
            method, 
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + auth.user.token
            },
            body: JSON.stringify(newGoal),
        }).then((response) => {
            if(response.ok){
                navigate("/budgets")
                //TODO: make this conditional so that it returns to saving or budget depending
            } else {
                response.json().then((errors) => {
                    if(Array.isArray(errors)) {
                        setErrors(errors);
                    } else {
                        setErrors([errors]);
                    }
                })
            }
        })
    }

    return (
        <form onSubmit = {handleSubmit}>


        </form>
    )
}

export default GoalsForm;