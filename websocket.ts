import * as io from "socket.io-client"

let socket: io.Socket

export function sendClient(url: string, action: string, data: any = {}) {
    if (!socket || socket.disconnected) connect(url)

    socket.emit("data", JSON.stringify({ action, ...data }))
}

function connect(url: string) {
    socket = io.connect(url, { reconnection: true, transports: ["websocket"] })
    console.log(`Searching for WebSocket server at ${url}...`)

    addListeners()
}

export function closeClient() {
    if (!socket) return

    socket.close()
    console.log("Connection closed!")
}

function addListeners() {
    socket.on("connect", () => {
        console.log("Connected to FreeShow!")
    })

    socket.on("disconnect", () => console.log("Lost connection."))
    socket.on("error", (err: any) => console.log(`Error message from server: ${err}`))

    socket.on("data", (data: any) => {
        console.log("Data received:", data)
        // data = JSON.parse(data)
    })
}
