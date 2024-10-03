# FreeShow API Helper

This makes integrating the FreeShow API very easy.

Example REST:

```js
const API = api("http://localhost:5506")
API.sendREST("next_slide") // POST body: { action: ACTION_ID, ...data }
API.sendHTTP("index_select_slide", { index: 2 }) // HTTP query: ?action=ACTION_ID?data={...}
```

Example WebSocket:

```js
const API = api("http://localhost:5505")
API.webSocket("name_select_slide", { value: "verse" }) // Socket emit: { action: ACTION_ID, ...data }
```
