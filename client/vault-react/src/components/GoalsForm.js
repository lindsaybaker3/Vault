import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import '../style/goalslist.css'

const GoalsForm = (props) => {
    const auth = useContext(AuthContext);
    const params = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState([])

   const[appUserId, setAppUserId] = useState(auth.user?.appUserId || "")
    const [categoryId, setCategoryId] = useState("")
    const [type, setType] = useState(props.type)
    const[amount, setAmount] = useState("")
    const[startDate, setStartDate] = useState("")
    const[endDate, setEndDate] = useState("")

    const resetState = () => {
        setCategoryId("")
        setAmount("")
        setStartDate("")
        setEndDate("")
    }

    useEffect(() => {
        if(auth?.user?.appUserId){
            setAppUserId(auth.user.appUserId);
        }
        if (params.goalsId !== undefined){
            fetch(`http://localhost:8080/api/vault/goals/${params.goalsId}`, {
                headers: {
                    Authorization: "Bearer " + auth.user.token,
                }
            })
            .then(response => {
                if(response.ok){
                   return response.json()

                } else {
                    console.log(`unexpected response status code: ${response.status}`)
                }
            })
            .then(targetGoal => {
                setAppUserId(targetGoal.appUserId)
                setCategoryId(targetGoal.categoryId)
                setAmount(targetGoal.amount)
                setStartDate(targetGoal.startDate)
                setEndDate(targetGoal.endDate)

            })
            .catch(error => {
                console.error(error)
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

            appUserId: auth.user.appUserId,
            categoryId: categoryId,
            type: props.type, //props.type
            amount: amount,
            startDate: startDate,
            endDate: endDate,
            //TODO: Check that all of these varialbe names are the right ones
        }

        if (appUserId) {
            newGoal.appUserId = appUserId;
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
                Authorization: "Bearer " + auth.user.token,
            },
            body: JSON.stringify(newGoal),
        }).then((response) => {
            if(response.ok){
                if(props.type === "spending"){
                    navigate("/budgets")
                } else {
                    navigate("/savings")
                }
                
                //TODO: make this conditional so that it returns to saving or budget depending
            } else {
                response.json().then((errors) => {
                    if(Array.isArray(errors)) {
                        setErrors(errors);
                    } else {
                        setErrors([errors]);
                    }
                    console.log(errors);
                })
            }
        })
    }

    return (
        <form onSubmit = {handleSubmit}>
            <ul>
             {errors.map((error) => (
                 <li key={error}>{error}</li>
             ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <fieldset>
                <label htmlFor = "category-input">Category</label>
                <select id = "category-input" value = {categoryId} onChange={(evt) => setCategoryId(evt.target.value)}>
                    <option value = "1">Groceries</option>
                    <option value = "8">Vacation</option>
                    <option value = "6">Rent</option>
                    <option value = "10">Shopping</option>
                </select>
            </fieldset>
            <fieldset>

                <label htmlFor = "amount-input">Budget Goal: </label>
                <input id = "amount-input" type = "number" value = {amount} onChange = {(evt) => setAmount(evt.target.value)}></input>
            </fieldset>
            <fieldset>
                <label htmlFor = "start-date-input">Start Date:</label>
                <input id = "start-date-input" type = "date" defaultValue = {startDate} onChange = {(evt) => setStartDate(evt.target.value)}></input>
            </fieldset>
            <fieldset>
                <label htmlFor = "end-date-input">End Date:</label>
                <input id = "end-date-input" type = "date" defaultValue = {endDate} onChange = {(evt) => setEndDate(evt.target.value)}></input>
            </fieldset>
            <button type = "submit">
                {params.goalsId ? 
                type === "spending" ? "Update Budget" : "Update Savings Goal"
            : type === "spending" ? "Add Budget" : "Add Savings Goal"} </button>
            <Link to = "/budgets">Cancel</Link>
            



            </div>

        </form>
    )
}

export default GoalsForm;