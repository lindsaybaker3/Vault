import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate, useParams } from "react-router";

const GoalsForm = () => {
    const auth = useContext(AuthContext);
    const params = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState([])

    const [categoryId, setCategoryId] = useState("")
    // TODO: put in a default category here
    // TODO: find a way to get the category Name here
    const[type, setType] = useState("spending")
    const[amount, setAmount] = useState("")
    const[startDate, setStartDate] = useState("")
    const[endDate, setEndDate] = useState("")

    const resetState = () => {
        setCategoryId("")
        //TODO: Give this default category
        //TODO: is this a category Id, category Name, or both?
        setType("")
        setAmount("")
        setStartDate("")
        setEndDate("")
    }

    useEffect(() => {
        if (params.goalsId !== undefined){
            fetch(`http://localhost:8080/api/vault/goals/${params.goalsId}`)
            .then(response => {
                if(response.ok){
                    response.json()
                    .then(targetGoal => {
                        setCategoryId(targetGoal.categoryId)
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
    }, [auth.user.token, params.goalsId])

    //TODO: Handle Submit and the return form
    //TODO: figure out what needs to be different for a budget vs a savings goal
    const handleSubmit = (evt) => {
        evt.preventDefault()
        const newGoal = {
            categoryId: categoryId,
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
    console.log(categoryId)

    return (
        <form onSubmit = {handleSubmit}>
            <ul>
             {errors.map((error) => (
                 <li key={error}>{error}</li>
             ))}
            </ul>
            <fieldset>
                <label htmlFor = "category-input">Category</label>
                <select id = "category-input" value = {categoryId} onChange={(evt) => setCategoryId(evt.target.value)}>
                    <option value = "1">Groceries</option>
                    <option value = "2">Vacation</option>
                    <option value = "3">Rent</option>
                    <option value = "4">Shopping</option>
                </select>
            </fieldset>
            <fieldset>
                <label htmlFor = "type-input"></label>
            </fieldset>
            

        </form>
    )
}

export default GoalsForm;