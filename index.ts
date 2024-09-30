import { actions } from "./actions"
import { closeClient, sendClient } from "./websocket"

function webSocket(action: string, data: any = {}) {
    console.log("SEND WebSocket", action, data)

    sendClient(URL, action, data)
}

function close() {
    closeClient()
}

function sendREST(action: string, data: any = {}) {
    console.log("SEND REST", action, data)

    const body = JSON.stringify({ action, ...data })

    fetch(URL, { method: "POST", body, headers: { "Content-type": "application/json; charset=UTF-8" } }).catch(error)
}

function sendHTTP(action: string, data: any = {}) {
    console.log("SEND HTTP", action, data)

    const query = `?action=${action}&data=${JSON.stringify(data)}`

    fetch(URL + query, { method: "POST", signal: AbortSignal.timeout(100) }).catch(error)
}

function error(err: Error) {
    if (err.name === "TimeoutError" || err.name === "AbortError") return
    console.error("Could not connect. Make sure WebSocket/REST is enabled in FreeShow settings>Connection!")
}

let URL = ""
// url ex: http://localhost:5505
const api = (url: string) => {
    if (!url) throw new Error("Missing port!")

    URL = url
    console.log("INIT API AT", URL)

    return { actions, webSocket, sendREST, sendHTTP, close }
}
export default api
