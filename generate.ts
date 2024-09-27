import fs from "fs"

// generate API functions from:
// https://github.com/ChurchApps/FreeShow/blob/main/src/frontend/components/actions/api.ts

fetch("https://raw.githubusercontent.com/ChurchApps/FreeShow/refs/heads/main/src/frontend/components/actions/api.ts", {
    method: "GET"
})
    .then((res) => res.text())
    .then(parseApi)
    .catch((err) => console.log(err))

function parseApi(text: string) {
    // get types
    let types: { [key: string]: any } = {}
    let currentIndex = 0
    let nextTypeIndex = 0
    do {
        nextTypeIndex = text.indexOf("type API_", currentIndex)
        currentIndex = nextTypeIndex + 10

        if (nextTypeIndex > -1) {
            let currentType = text.slice(nextTypeIndex, text.indexOf("}", nextTypeIndex))
            let name = currentType.slice(9, currentType.indexOf(" = {"))
            let value = parseTypeValue(currentType.slice(currentType.indexOf("{") + 1))
            types[name] = value
        }
    } while (nextTypeIndex > -1)

    // get actions
    let actions: { [key: string]: null | { [key: string]: any } } = {}
    let actionsIndex = text.indexOf("API_ACTIONS = {")
    let actionsObj = text.slice(text.indexOf("{", actionsIndex) + 1, text.indexOf(",\n}", actionsIndex))
    actionsObj
        .split("\n")
        .filter((a) => a)
        .forEach((actionLine) => {
            let functionIndex = actionLine.indexOf(": (")
            if (functionIndex < 0) return

            if (actionLine.trim().indexOf("//") === 0) return

            let actionId = actionLine.slice(0, functionIndex).trim()
            actions[actionId] = null

            let apiTypeIndex = actionLine.indexOf(": API_")
            if (apiTypeIndex < 0) return

            actions[actionId] = types[actionLine.slice(apiTypeIndex + 6, actionLine.indexOf(")"))]
        })

    // console.log(types)
    // console.log(actions)

    // write to file
    // fs.writeFileSync("actions.json", JSON.stringify(actions))
    fs.writeFileSync("dist/actions.js", `export const actions = ${JSON.stringify(actions)}`)
}

function parseTypeValue(value: string) {
    let valueObj: { [key: string]: any } = {}
    let currentObjectKey = ""
    let objectValue: any = {}

    value
        .replaceAll("; ", "\n")
        .split("\n")
        .filter((a) => a)
        .forEach((val) => {
            if (val === "{") {
                if (currentObjectKey) {
                    valueObj[currentObjectKey] = objectValue
                    objectValue = {}
                    currentObjectKey = ""
                }

                return
            }

            // remove comments
            let commentIndex = val.indexOf("//")
            if (commentIndex > -1) val = val.slice(0, commentIndex)
            val = val.trim()
            if (!val) return

            let key = val.slice(0, val.indexOf(":"))
            let type = val.slice(val.indexOf(":") + 1).trim()

            if (currentObjectKey) {
                objectValue[key] = type
                return
            }
            if (type === "{") {
                type = "OBJECT"
                objectValue = {}
                currentObjectKey = key
            } else if (type.includes("{")) {
                // do something
            }

            valueObj[key] = type
        })

    if (currentObjectKey) {
        valueObj[currentObjectKey] = objectValue
    }

    return valueObj
}
