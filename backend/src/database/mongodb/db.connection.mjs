import { connect } from "mongoose";

connect("mongodb://localhost/electionSys").then(data => {
    console.log(`Connected to database`)
}).catch(err => {
    console.log(err)
})