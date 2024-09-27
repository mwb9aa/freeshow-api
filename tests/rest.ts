import api from "../index"

// REST on +1 (5506), but works with 5505 as well!
const API = api("http://localhost:5505")

API.sendREST("next_slide")
API.sendHTTP("next_slide")

setTimeout(() => {
    console.log("Test completed!")
    process.exit()
}, 1000)
