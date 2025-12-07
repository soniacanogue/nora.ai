---
title: NoraAI API v1.0
language_tabs:
  - javascript: javascript
language_clients:
  - javascript: ""
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="noraai-api">NoraAI API v1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

API para el sistema de soporte inteligente GearUp

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="noraai-api-app">App</h1>

## AppController_getProfile

<a id="opIdAppController_getProfile"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/profile',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /profile`

> Example responses

> 200 Response

```json
{}
```

<h3 id="appcontroller_getprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="appcontroller_getprofile-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AppController_getHello

<a id="opIdAppController_getHello"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/hello',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /hello`

> Example responses

> 200 Response

```json
"string"
```

<h3 id="appcontroller_gethello-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="noraai-api-auth">Auth</h1>

## AuthController_login

<a id="opIdAuthController_login"></a>

> Code samples

```javascript
const inputBody = '{
  "password": "string",
  "email": "user@example.com"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /auth/login`

> Body parameter

```json
{
  "password": "string",
  "email": "user@example.com"
}
```

<h3 id="authcontroller_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[loginDto](#schemalogindto)|true|none|

> Example responses

> 201 Response

```json
{}
```

<h3 id="authcontroller_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

<h3 id="authcontroller_login-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="noraai-api-audit">Audit</h1>

## Obtener logs de auditoría (Solo Admin)

<a id="opIdAuditController_findAll"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/audit/logs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /audit/logs`

<h3 id="obtener-logs-de-auditoría-(solo-admin)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|usuarioId|query|string|false|none|
|tabla|query|string|false|none|
|tipoEvento|query|string|false|none|
|fechaDesde|query|string|false|none|
|fechaHasta|query|string|false|none|
|page|query|number|false|none|
|limit|query|number|false|none|

<h3 id="obtener-logs-de-auditoría-(solo-admin)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-users">Users</h1>

## UsersController_create

<a id="opIdUsersController_create"></a>

> Code samples

```javascript
const inputBody = '{
  "rol": "ADMINISTRADOR",
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "nombre": "string",
  "correo": "user@example.com",
  "activo": true
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/users',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /users`

> Body parameter

```json
{
  "rol": "ADMINISTRADOR",
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "nombre": "string",
  "correo": "user@example.com",
  "activo": true
}
```

<h3 id="userscontroller_create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateUserDto](#schemacreateuserdto)|true|none|

<h3 id="userscontroller_create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_findAll

<a id="opIdUsersController_findAll"></a>

> Code samples

```javascript

fetch('/users',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /users`

<h3 id="userscontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_getProfile

<a id="opIdUsersController_getProfile"></a>

> Code samples

```javascript

fetch('/users/profile',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /users/profile`

<h3 id="userscontroller_getprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_updateProfile

<a id="opIdUsersController_updateProfile"></a>

> Code samples

```javascript
const inputBody = '{
  "rol": "ADMINISTRADOR",
  "nombre": "string",
  "activo": true,
  "primeraVez": true,
  "correo": "user@example.com"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/users/profile',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /users/profile`

> Body parameter

```json
{
  "rol": "ADMINISTRADOR",
  "nombre": "string",
  "activo": true,
  "primeraVez": true,
  "correo": "user@example.com"
}
```

<h3 id="userscontroller_updateprofile-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[UpdateUserDto](#schemaupdateuserdto)|true|none|

<h3 id="userscontroller_updateprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_findOne

<a id="opIdUsersController_findOne"></a>

> Code samples

```javascript

fetch('/users/{id}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /users/{id}`

<h3 id="userscontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="userscontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_update

<a id="opIdUsersController_update"></a>

> Code samples

```javascript
const inputBody = '{
  "rol": "ADMINISTRADOR",
  "nombre": "string",
  "activo": true,
  "primeraVez": true,
  "correo": "user@example.com"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/users/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /users/{id}`

> Body parameter

```json
{
  "rol": "ADMINISTRADOR",
  "nombre": "string",
  "activo": true,
  "primeraVez": true,
  "correo": "user@example.com"
}
```

<h3 id="userscontroller_update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateUserDto](#schemaupdateuserdto)|true|none|

<h3 id="userscontroller_update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_remove

<a id="opIdUsersController_remove"></a>

> Code samples

```javascript

fetch('/users/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /users/{id}`

<h3 id="userscontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="userscontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="noraai-api-tickets">Tickets</h1>

## TicketsController_create

<a id="opIdTicketsController_create"></a>

> Code samples

```javascript
const inputBody = '{
  "canal": "correo",
  "prioridad": "baja",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets`

> Body parameter

```json
{
  "canal": "correo",
  "prioridad": "baja",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}
```

<h3 id="ticketscontroller_create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateTicketDto](#schemacreateticketdto)|true|none|

<h3 id="ticketscontroller_create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## TicketsController_findAll

<a id="opIdTicketsController_findAll"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tickets',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tickets`

> Example responses

> 200 Response

```json
[
  {}
]
```

<h3 id="ticketscontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="ticketscontroller_findall-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## TicketsController_findOne

<a id="opIdTicketsController_findOne"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tickets/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tickets/{id}`

<h3 id="ticketscontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="ticketscontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="ticketscontroller_findone-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## TicketsController_update

<a id="opIdTicketsController_update"></a>

> Code samples

```javascript
const inputBody = '{
  "canal": "correo",
  "prioridad": "baja",
  "estado": "nuevo",
  "assigneeId": "665a9750-71bd-4b96-bacd-9efa4ae022dd",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /tickets/{id}`

> Body parameter

```json
{
  "canal": "correo",
  "prioridad": "baja",
  "estado": "nuevo",
  "assigneeId": "665a9750-71bd-4b96-bacd-9efa4ae022dd",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}
```

<h3 id="ticketscontroller_update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateTicketDto](#schemaupdateticketdto)|true|none|

<h3 id="ticketscontroller_update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## TicketsController_remove

<a id="opIdTicketsController_remove"></a>

> Code samples

```javascript

fetch('/tickets/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /tickets/{id}`

<h3 id="ticketscontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="ticketscontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## TicketsController_reply

<a id="opIdTicketsController_reply"></a>

> Code samples

```javascript
const inputBody = '{
  "contenidoTexto": "string",
  "nuevoEstado": "nuevo",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets/{id}/reply',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/{id}/reply`

> Body parameter

```json
{
  "contenidoTexto": "string",
  "nuevoEstado": "nuevo",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}
```

<h3 id="ticketscontroller_reply-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ReplyTicketDto](#schemareplyticketdto)|true|none|

<h3 id="ticketscontroller_reply-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## Aprobar y enviar sugerencia de IA en un clic

<a id="opIdTicketsController_approveAi"></a>

> Code samples

```javascript
const inputBody = '{
  "nuevoEstado": "nuevo"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets/{id}/approve-ai',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/{id}/approve-ai`

> Body parameter

```json
{
  "nuevoEstado": "nuevo"
}
```

<h3 id="aprobar-y-enviar-sugerencia-de-ia-en-un-clic-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ApproveAiDto](#schemaapproveaidto)|true|none|

<h3 id="aprobar-y-enviar-sugerencia-de-ia-en-un-clic-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## TicketsController_escalate

<a id="opIdTicketsController_escalate"></a>

> Code samples

```javascript
const inputBody = '{
  "note": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets/{id}/escalate',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/{id}/escalate`

> Body parameter

```json
{
  "note": "string"
}
```

<h3 id="ticketscontroller_escalate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[EscalateTicketDto](#schemaescalateticketdto)|true|none|

<h3 id="ticketscontroller_escalate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## Reasignar ticket manualmente a otro agente

<a id="opIdTicketsController_reassign"></a>

> Code samples

```javascript
const inputBody = '{
  "assigneeId": "665a9750-71bd-4b96-bacd-9efa4ae022dd",
  "note": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets/{id}/reassign',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/{id}/reassign`

> Body parameter

```json
{
  "assigneeId": "665a9750-71bd-4b96-bacd-9efa4ae022dd",
  "note": "string"
}
```

<h3 id="reasignar-ticket-manualmente-a-otro-agente-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ReassignTicketDto](#schemareassignticketdto)|true|none|

<h3 id="reasignar-ticket-manualmente-a-otro-agente-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## TicketsController_createMessage

<a id="opIdTicketsController_createMessage"></a>

> Code samples

```javascript
const inputBody = '{
  "contenidoTexto": "string",
  "esNotaInterna": false,
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets/{id}/messages',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/{id}/messages`

> Body parameter

```json
{
  "contenidoTexto": "string",
  "esNotaInterna": false,
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}
```

<h3 id="ticketscontroller_createmessage-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[CreateMessageDto](#schemacreatemessagedto)|true|none|

<h3 id="ticketscontroller_createmessage-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## Buscar posibles duplicados para fusionar

<a id="opIdTicketsController_findMergeCandidates"></a>

> Code samples

```javascript

fetch('/tickets/{id}/merge-candidates',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tickets/{id}/merge-candidates`

<h3 id="buscar-posibles-duplicados-para-fusionar-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="buscar-posibles-duplicados-para-fusionar-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## Fusionar este ticket dentro de otro (Mueve mensajes y cierra este)

<a id="opIdTicketsController_merge"></a>

> Code samples

```javascript
const inputBody = '{
  "targetTicketId": "9e0043d2-c7a8-42bf-be5c-27d9968f4873"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tickets/{id}/merge',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/{id}/merge`

> Body parameter

```json
{
  "targetTicketId": "9e0043d2-c7a8-42bf-be5c-27d9968f4873"
}
```

<h3 id="fusionar-este-ticket-dentro-de-otro-(mueve-mensajes-y-cierra-este)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[MergeTicketDto](#schemamergeticketdto)|true|none|

<h3 id="fusionar-este-ticket-dentro-de-otro-(mueve-mensajes-y-cierra-este)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## Agregar una etiqueta a un ticket

<a id="opIdTicketsController_addTag"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tickets/{id}/tags/{tagName}',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/{id}/tags/{tagName}`

<h3 id="agregar-una-etiqueta-a-un-ticket-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|tagName|path|string|true|none|

> Example responses

> 201 Response

```json
{}
```

<h3 id="agregar-una-etiqueta-a-un-ticket-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

<h3 id="agregar-una-etiqueta-a-un-ticket-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## Quitar una etiqueta de un ticket

<a id="opIdTicketsController_removeTag"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tickets/{id}/tags/{tagName}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /tickets/{id}/tags/{tagName}`

<h3 id="quitar-una-etiqueta-de-un-ticket-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|tagName|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="quitar-una-etiqueta-de-un-ticket-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="quitar-una-etiqueta-de-un-ticket-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## Exportar tickets a CSV con filtros opcionales

<a id="opIdTicketsController_exportToCsv"></a>

> Code samples

```javascript

fetch('/tickets/export',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tickets/export`

<h3 id="exportar-tickets-a-csv-con-filtros-opcionales-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="noraai-api-public">Public</h1>

## Crear ticket desde formulario web público (Sin Auth)

<a id="opIdPublicTicketsController_create"></a>

> Code samples

```javascript
const inputBody = '{
  "canal": "correo",
  "prioridad": "baja",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/public/tickets',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /public/tickets`

> Body parameter

```json
{
  "canal": "correo",
  "prioridad": "baja",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}
```

<h3 id="crear-ticket-desde-formulario-web-público-(sin-auth)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateTicketDto](#schemacreateticketdto)|true|none|

<h3 id="crear-ticket-desde-formulario-web-público-(sin-auth)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="noraai-api-ai">AI</h1>

## AiController_retryTicket

<a id="opIdAiController_retryTicket"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/ai/retry/{ticketId}',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /ai/retry/{ticketId}`

<h3 id="aicontroller_retryticket-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ticketId|path|string|true|none|

<h3 id="aicontroller_retryticket-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## AiController_getAllConfigs

<a id="opIdAiController_getAllConfigs"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/ai/config',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /ai/config`

<h3 id="aicontroller_getallconfigs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## AiController_createConfig

<a id="opIdAiController_createConfig"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "Agente RMA",
  "descripcion": "Configuración para consultas de RMA",
  "promptBase": "Eres un asistente de soporte al cliente experto...",
  "promptsPorCanal": {},
  "modelo": "x-ai/grok-4.1-fast:free",
  "temperatura": 0.3,
  "umbralConfianza": 0.75
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/ai/config',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /ai/config`

> Body parameter

```json
{
  "nombre": "Agente RMA",
  "descripcion": "Configuración para consultas de RMA",
  "promptBase": "Eres un asistente de soporte al cliente experto...",
  "promptsPorCanal": {},
  "modelo": "x-ai/grok-4.1-fast:free",
  "temperatura": 0.3,
  "umbralConfianza": 0.75
}
```

<h3 id="aicontroller_createconfig-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateAiConfigDto](#schemacreateaiconfigdto)|true|none|

<h3 id="aicontroller_createconfig-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## AiController_getConfig

<a id="opIdAiController_getConfig"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/ai/config/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /ai/config/{id}`

<h3 id="aicontroller_getconfig-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="aicontroller_getconfig-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## AiController_updateConfig

<a id="opIdAiController_updateConfig"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "Agente RMA",
  "descripcion": "Configuración para consultas de RMA",
  "promptBase": "Eres un asistente de soporte al cliente experto...",
  "promptsPorCanal": {},
  "modelo": "x-ai/grok-4.1-fast:free",
  "temperatura": 0.3,
  "umbralConfianza": 0.75
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/ai/config/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /ai/config/{id}`

> Body parameter

```json
{
  "nombre": "Agente RMA",
  "descripcion": "Configuración para consultas de RMA",
  "promptBase": "Eres un asistente de soporte al cliente experto...",
  "promptsPorCanal": {},
  "modelo": "x-ai/grok-4.1-fast:free",
  "temperatura": 0.3,
  "umbralConfianza": 0.75
}
```

<h3 id="aicontroller_updateconfig-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateAiConfigDto](#schemaupdateaiconfigdto)|true|none|

<h3 id="aicontroller_updateconfig-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## AiController_deleteConfig

<a id="opIdAiController_deleteConfig"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/ai/config/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /ai/config/{id}`

<h3 id="aicontroller_deleteconfig-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="aicontroller_deleteconfig-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-dashboards">Dashboards</h1>

## DashboardsController_getAdminStats

<a id="opIdDashboardsController_getAdminStats"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/dashboards/admin',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /dashboards/admin`

<h3 id="dashboardscontroller_getadminstats-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|fechaDesde|query|string|false|Fecha de inicio (ISO 8601)|
|fechaHasta|query|string|false|Fecha de fin (ISO 8601)|
|agenteId|query|string(uuid)|false|ID del agente para filtrar|

<h3 id="dashboardscontroller_getadminstats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## DashboardsController_getAgentStats

<a id="opIdDashboardsController_getAgentStats"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/dashboards/agent',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /dashboards/agent`

<h3 id="dashboardscontroller_getagentstats-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|fechaDesde|query|string|false|Fecha de inicio (ISO 8601)|
|fechaHasta|query|string|false|Fecha de fin (ISO 8601)|
|agenteId|query|string(uuid)|false|ID del agente para filtrar|

<h3 id="dashboardscontroller_getagentstats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## DashboardsController_getSupervisorStats

<a id="opIdDashboardsController_getSupervisorStats"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/dashboards/supervisor',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /dashboards/supervisor`

<h3 id="dashboardscontroller_getsupervisorstats-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|fechaDesde|query|string|false|Fecha de inicio (ISO 8601)|
|fechaHasta|query|string|false|Fecha de fin (ISO 8601)|
|agenteId|query|string(uuid)|false|ID del agente para filtrar|

<h3 id="dashboardscontroller_getsupervisorstats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-uploads">Uploads</h1>

## UploadsController_uploadFile

<a id="opIdUploadsController_uploadFile"></a>

> Code samples

```javascript
const inputBody = '{
  "file": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Authorization':'Bearer {access-token}'
};

fetch('/uploads',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /uploads`

> Body parameter

```yaml
file: string

```

<h3 id="uploadscontroller_uploadfile-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» file|body|string(binary)|false|none|

<h3 id="uploadscontroller_uploadfile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-orders">Orders</h1>

## Importar órdenes masivamente desde JSON

<a id="opIdOrdersController_importOrders"></a>

> Code samples

```javascript
const inputBody = '[
  {
    "orderId": "ORD-2023-101",
    "clientEmail": "test.user1@example.com",
    "status": "procesando"
  }
]';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/orders',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /orders`

> Body parameter

```json
[
  {
    "orderId": "ORD-2023-101",
    "clientEmail": "test.user1@example.com",
    "status": "procesando"
  }
]
```

<h3 id="importar-órdenes-masivamente-desde-json-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ImportOrderDto](#schemaimportorderdto)|true|none|

<h3 id="importar-órdenes-masivamente-desde-json-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## OrdersController_findAll

<a id="opIdOrdersController_findAll"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/orders',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /orders`

> Example responses

> 200 Response

```json
[
  {}
]
```

<h3 id="orderscontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="orderscontroller_findall-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Importar órdenes desde archivo CSV

<a id="opIdOrdersController_uploadCsv"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/orders/upload',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /orders/upload`

<h3 id="importar-órdenes-desde-archivo-csv-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## OrdersController_findOne

<a id="opIdOrdersController_findOne"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/orders/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /orders/{id}`

<h3 id="orderscontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="orderscontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="orderscontroller_findone-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-customers">Customers</h1>

## Buscar clientes por nombre o correo

<a id="opIdCustomersController_findAll"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/customers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /customers`

<h3 id="buscar-clientes-por-nombre-o-correo-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|q|query|string|false|Término de búsqueda|

> Example responses

> 200 Response

```json
[
  {}
]
```

<h3 id="buscar-clientes-por-nombre-o-correo-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="buscar-clientes-por-nombre-o-correo-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Obtener perfil 360 del cliente (Tickets + Órdenes)

<a id="opIdCustomersController_findOne"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/customers/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /customers/{id}`

<h3 id="obtener-perfil-360-del-cliente-(tickets-+-órdenes)-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="obtener-perfil-360-del-cliente-(tickets-+-órdenes)-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="obtener-perfil-360-del-cliente-(tickets-+-órdenes)-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-templates">Templates</h1>

## TemplatesController_create

<a id="opIdTemplatesController_create"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "Saludo Estándar",
  "plantillaCuerpo": "Gracias por contactar a GearUp...",
  "plantillaAsunto": "Respuesta a su solicitud #{{ticketId}}"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/templates',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /templates`

> Body parameter

```json
{
  "nombre": "Saludo Estándar",
  "plantillaCuerpo": "Gracias por contactar a GearUp...",
  "plantillaAsunto": "Respuesta a su solicitud #{{ticketId}}"
}
```

<h3 id="templatescontroller_create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateTemplateDto](#schemacreatetemplatedto)|true|none|

<h3 id="templatescontroller_create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TemplatesController_findAll

<a id="opIdTemplatesController_findAll"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/templates',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /templates`

<h3 id="templatescontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TemplatesController_findOne

<a id="opIdTemplatesController_findOne"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/templates/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /templates/{id}`

<h3 id="templatescontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="templatescontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TemplatesController_update

<a id="opIdTemplatesController_update"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "Saludo Estándar",
  "plantillaCuerpo": "Gracias por contactar a GearUp...",
  "plantillaAsunto": "Respuesta a su solicitud #{{ticketId}}"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/templates/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /templates/{id}`

> Body parameter

```json
{
  "nombre": "Saludo Estándar",
  "plantillaCuerpo": "Gracias por contactar a GearUp...",
  "plantillaAsunto": "Respuesta a su solicitud #{{ticketId}}"
}
```

<h3 id="templatescontroller_update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateTemplateDto](#schemaupdatetemplatedto)|true|none|

<h3 id="templatescontroller_update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TemplatesController_remove

<a id="opIdTemplatesController_remove"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/templates/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /templates/{id}`

<h3 id="templatescontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="templatescontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-tags">Tags</h1>

## TagsController_create

<a id="opIdTagsController_create"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "VIP",
  "descripcion": "Etiqueta para clientes VIP",
  "color": "#FF5733"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tags',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tags`

> Body parameter

```json
{
  "nombre": "VIP",
  "descripcion": "Etiqueta para clientes VIP",
  "color": "#FF5733"
}
```

<h3 id="tagscontroller_create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateTagDto](#schemacreatetagdto)|true|none|

<h3 id="tagscontroller_create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TagsController_findAll

<a id="opIdTagsController_findAll"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tags',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tags`

> Example responses

> 200 Response

```json
[
  {}
]
```

<h3 id="tagscontroller_findall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="tagscontroller_findall-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TagsController_findOne

<a id="opIdTagsController_findOne"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tags/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tags/{id}`

<h3 id="tagscontroller_findone-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="tagscontroller_findone-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TagsController_update

<a id="opIdTagsController_update"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "VIP",
  "descripcion": "Etiqueta para clientes VIP",
  "color": "#FF5733"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tags/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /tags/{id}`

> Body parameter

```json
{
  "nombre": "VIP",
  "descripcion": "Etiqueta para clientes VIP",
  "color": "#FF5733"
}
```

<h3 id="tagscontroller_update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateTagDto](#schemaupdatetagdto)|true|none|

<h3 id="tagscontroller_update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## TagsController_remove

<a id="opIdTagsController_remove"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tags/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /tags/{id}`

<h3 id="tagscontroller_remove-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="tagscontroller_remove-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

<h1 id="noraai-api-webhooks">Webhooks</h1>

## Webhook para emails entrantes de Mailgun

<a id="opIdWebhooksController_handleMailgunInbound"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/webhooks/mailgun/inbound',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /webhooks/mailgun/inbound`

> Example responses

> 200 Response

```json
{}
```

<h3 id="webhook-para-emails-entrantes-de-mailgun-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="webhook-para-emails-entrantes-de-mailgun-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="noraai-api-integrations">Integrations</h1>

## Crear una nueva integración

<a id="opIdIntegrationsController_create"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "Mailgun",
  "claveApiEnc": "sk_live_xxxxxxxxxxxx",
  "endpoint": "https://api.mailgun.net/v3",
  "urlWebhook": "https://example.com/webhook",
  "configJson": {},
  "activo": true
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/integrations',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /integrations`

> Body parameter

```json
{
  "nombre": "Mailgun",
  "claveApiEnc": "sk_live_xxxxxxxxxxxx",
  "endpoint": "https://api.mailgun.net/v3",
  "urlWebhook": "https://example.com/webhook",
  "configJson": {},
  "activo": true
}
```

<h3 id="crear-una-nueva-integración-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateIntegrationDto](#schemacreateintegrationdto)|true|none|

<h3 id="crear-una-nueva-integración-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Listar todas las integraciones

<a id="opIdIntegrationsController_findAll"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/integrations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /integrations`

<h3 id="listar-todas-las-integraciones-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Obtener detalles de una integración

<a id="opIdIntegrationsController_findOne"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/integrations/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /integrations/{id}`

<h3 id="obtener-detalles-de-una-integración-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="obtener-detalles-de-una-integración-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Actualizar una integración

<a id="opIdIntegrationsController_update"></a>

> Code samples

```javascript
const inputBody = '{
  "nombre": "Mailgun",
  "claveApiEnc": "sk_live_xxxxxxxxxxxx",
  "endpoint": "https://api.mailgun.net/v3",
  "urlWebhook": "https://example.com/webhook",
  "configJson": {},
  "activo": true
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/integrations/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /integrations/{id}`

> Body parameter

```json
{
  "nombre": "Mailgun",
  "claveApiEnc": "sk_live_xxxxxxxxxxxx",
  "endpoint": "https://api.mailgun.net/v3",
  "urlWebhook": "https://example.com/webhook",
  "configJson": {},
  "activo": true
}
```

<h3 id="actualizar-una-integración-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UpdateIntegrationDto](#schemaupdateintegrationdto)|true|none|

<h3 id="actualizar-una-integración-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Eliminar una integración

<a id="opIdIntegrationsController_remove"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/integrations/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /integrations/{id}`

<h3 id="eliminar-una-integración-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="eliminar-una-integración-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

## Probar conexión con la integración

<a id="opIdIntegrationsController_testConnection"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/integrations/{id}/test',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /integrations/{id}/test`

<h3 id="probar-conexión-con-la-integración-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="probar-conexión-con-la-integración-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearer
</aside>

# Schemas

<h2 id="tocS_loginDto">loginDto</h2>
<!-- backwards compatibility -->
<a id="schemalogindto"></a>
<a id="schema_loginDto"></a>
<a id="tocSlogindto"></a>
<a id="tocslogindto"></a>

```json
{
  "password": "string",
  "email": "user@example.com"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|password|string|true|none|none|
|email|string(email)|true|none|none|

<h2 id="tocS_CreateUserDto">CreateUserDto</h2>
<!-- backwards compatibility -->
<a id="schemacreateuserdto"></a>
<a id="schema_CreateUserDto"></a>
<a id="tocScreateuserdto"></a>
<a id="tocscreateuserdto"></a>

```json
{
  "rol": "ADMINISTRADOR",
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "nombre": "string",
  "correo": "user@example.com",
  "activo": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|rol|string|true|none|none|
|id|string(uuid)|true|none|none|
|nombre|string|true|none|none|
|correo|string(email)|true|none|none|
|activo|boolean|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|rol|ADMINISTRADOR|
|rol|AGENTE|
|rol|SUPERVISOR|

<h2 id="tocS_UpdateUserDto">UpdateUserDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdateuserdto"></a>
<a id="schema_UpdateUserDto"></a>
<a id="tocSupdateuserdto"></a>
<a id="tocsupdateuserdto"></a>

```json
{
  "rol": "ADMINISTRADOR",
  "nombre": "string",
  "activo": true,
  "primeraVez": true,
  "correo": "user@example.com"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|rol|string|false|none|none|
|nombre|string|false|none|none|
|activo|boolean|false|none|none|
|primeraVez|boolean|false|none|none|
|correo|string(email)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|rol|ADMINISTRADOR|
|rol|AGENTE|
|rol|SUPERVISOR|

<h2 id="tocS_ArchivoAdjuntoDto">ArchivoAdjuntoDto</h2>
<!-- backwards compatibility -->
<a id="schemaarchivoadjuntodto"></a>
<a id="schema_ArchivoAdjuntoDto"></a>
<a id="tocSarchivoadjuntodto"></a>
<a id="tocsarchivoadjuntodto"></a>

```json
{
  "nombreArchivo": "string",
  "urlAlmacenamiento": "string",
  "tipoMime": "string",
  "tamano": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombreArchivo|string|true|none|none|
|urlAlmacenamiento|string|true|none|none|
|tipoMime|string|true|none|none|
|tamano|number|true|none|none|

<h2 id="tocS_CreateTicketDto">CreateTicketDto</h2>
<!-- backwards compatibility -->
<a id="schemacreateticketdto"></a>
<a id="schema_CreateTicketDto"></a>
<a id="tocScreateticketdto"></a>
<a id="tocscreateticketdto"></a>

```json
{
  "canal": "correo",
  "prioridad": "baja",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|canal|string|true|none|none|
|prioridad|string|false|none|none|
|asunto|string|true|none|none|
|mensajeInicial|string|true|none|none|
|correoCliente|string(email)|true|none|none|
|nombreCliente|string|false|none|none|
|ordenId|string(uuid)|false|none|none|
|archivos|[[ArchivoAdjuntoDto](#schemaarchivoadjuntodto)]|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|canal|correo|
|canal|whatsapp|
|canal|formulario_web|
|canal|api|
|prioridad|baja|
|prioridad|media|
|prioridad|alta|
|prioridad|urgente|

<h2 id="tocS_UpdateTicketDto">UpdateTicketDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdateticketdto"></a>
<a id="schema_UpdateTicketDto"></a>
<a id="tocSupdateticketdto"></a>
<a id="tocsupdateticketdto"></a>

```json
{
  "canal": "correo",
  "prioridad": "baja",
  "estado": "nuevo",
  "assigneeId": "665a9750-71bd-4b96-bacd-9efa4ae022dd",
  "asunto": "string",
  "mensajeInicial": "string",
  "correoCliente": "user@example.com",
  "nombreCliente": "string",
  "ordenId": "fd503374-4a36-496e-8380-5cb6995b2d87",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|canal|string|false|none|none|
|prioridad|string|false|none|none|
|estado|string|false|none|none|
|assigneeId|string(uuid)|false|none|none|
|asunto|string|false|none|none|
|mensajeInicial|string|false|none|none|
|correoCliente|string(email)|false|none|none|
|nombreCliente|string|false|none|none|
|ordenId|string(uuid)|false|none|none|
|archivos|[[ArchivoAdjuntoDto](#schemaarchivoadjuntodto)]|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|canal|correo|
|canal|whatsapp|
|canal|formulario_web|
|canal|api|
|prioridad|baja|
|prioridad|media|
|prioridad|alta|
|prioridad|urgente|
|estado|nuevo|
|estado|pendiente_ia|
|estado|ia_sugerido|
|estado|respuesta_cliente|
|estado|esperando_cliente|
|estado|escalado_nivel_2|
|estado|en_progreso_nivel_2|
|estado|cerrado|
|estado|reabierto|
|estado|fusionado|

<h2 id="tocS_ReplyTicketDto">ReplyTicketDto</h2>
<!-- backwards compatibility -->
<a id="schemareplyticketdto"></a>
<a id="schema_ReplyTicketDto"></a>
<a id="tocSreplyticketdto"></a>
<a id="tocsreplyticketdto"></a>

```json
{
  "contenidoTexto": "string",
  "nuevoEstado": "nuevo",
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|contenidoTexto|string|true|none|Contenido de la respuesta|
|nuevoEstado|string|false|none|Nuevo estado del ticket (opcional)|
|archivos|[[ArchivoAdjuntoDto](#schemaarchivoadjuntodto)]|false|none|Lista de archivos adjuntos (opcional)|

#### Enumerated Values

|Property|Value|
|---|---|
|nuevoEstado|nuevo|
|nuevoEstado|pendiente_ia|
|nuevoEstado|ia_sugerido|
|nuevoEstado|respuesta_cliente|
|nuevoEstado|esperando_cliente|
|nuevoEstado|escalado_nivel_2|
|nuevoEstado|en_progreso_nivel_2|
|nuevoEstado|cerrado|
|nuevoEstado|reabierto|
|nuevoEstado|fusionado|

<h2 id="tocS_ApproveAiDto">ApproveAiDto</h2>
<!-- backwards compatibility -->
<a id="schemaapproveaidto"></a>
<a id="schema_ApproveAiDto"></a>
<a id="tocSapproveaidto"></a>
<a id="tocsapproveaidto"></a>

```json
{
  "nuevoEstado": "nuevo"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nuevoEstado|string|false|none|Estado final del ticket después de enviar (por defecto: esperando_cliente)|

#### Enumerated Values

|Property|Value|
|---|---|
|nuevoEstado|nuevo|
|nuevoEstado|pendiente_ia|
|nuevoEstado|ia_sugerido|
|nuevoEstado|respuesta_cliente|
|nuevoEstado|esperando_cliente|
|nuevoEstado|escalado_nivel_2|
|nuevoEstado|en_progreso_nivel_2|
|nuevoEstado|cerrado|
|nuevoEstado|reabierto|
|nuevoEstado|fusionado|

<h2 id="tocS_EscalateTicketDto">EscalateTicketDto</h2>
<!-- backwards compatibility -->
<a id="schemaescalateticketdto"></a>
<a id="schema_EscalateTicketDto"></a>
<a id="tocSescalateticketdto"></a>
<a id="tocsescalateticketdto"></a>

```json
{
  "note": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|note|string|false|none|Nota interna al escalar el ticket|

<h2 id="tocS_ReassignTicketDto">ReassignTicketDto</h2>
<!-- backwards compatibility -->
<a id="schemareassignticketdto"></a>
<a id="schema_ReassignTicketDto"></a>
<a id="tocSreassignticketdto"></a>
<a id="tocsreassignticketdto"></a>

```json
{
  "assigneeId": "665a9750-71bd-4b96-bacd-9efa4ae022dd",
  "note": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|assigneeId|string(uuid)|true|none|ID del usuario al que se reasignará el ticket|
|note|string|false|none|Nota interna opcional explicando la reasignación|

<h2 id="tocS_CreateMessageDto">CreateMessageDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatemessagedto"></a>
<a id="schema_CreateMessageDto"></a>
<a id="tocScreatemessagedto"></a>
<a id="tocscreatemessagedto"></a>

```json
{
  "contenidoTexto": "string",
  "esNotaInterna": false,
  "archivos": [
    {
      "nombreArchivo": "string",
      "urlAlmacenamiento": "string",
      "tipoMime": "string",
      "tamano": 0
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|contenidoTexto|string|true|none|El cuerpo del mensaje o respuesta|
|esNotaInterna|boolean|false|none|Si es true, el cliente NO verá este mensaje (solo para agentes)|
|archivos|[[ArchivoAdjuntoDto](#schemaarchivoadjuntodto)]|false|none|Lista de archivos adjuntos (opcional)|

<h2 id="tocS_MergeTicketDto">MergeTicketDto</h2>
<!-- backwards compatibility -->
<a id="schemamergeticketdto"></a>
<a id="schema_MergeTicketDto"></a>
<a id="tocSmergeticketdto"></a>
<a id="tocsmergeticketdto"></a>

```json
{
  "targetTicketId": "9e0043d2-c7a8-42bf-be5c-27d9968f4873"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|targetTicketId|string(uuid)|true|none|ID del ticket que va a absorber al actual (Ticket Destino)|

<h2 id="tocS_CreateAiConfigDto">CreateAiConfigDto</h2>
<!-- backwards compatibility -->
<a id="schemacreateaiconfigdto"></a>
<a id="schema_CreateAiConfigDto"></a>
<a id="tocScreateaiconfigdto"></a>
<a id="tocscreateaiconfigdto"></a>

```json
{
  "nombre": "Agente RMA",
  "descripcion": "Configuración para consultas de RMA",
  "promptBase": "Eres un asistente de soporte al cliente experto...",
  "promptsPorCanal": {},
  "modelo": "x-ai/grok-4.1-fast:free",
  "temperatura": 0.3,
  "umbralConfianza": 0.75
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|true|none|none|
|descripcion|string|false|none|none|
|promptBase|string|true|none|none|
|promptsPorCanal|object|true|none|none|
|modelo|string|true|none|none|
|temperatura|number|true|none|none|
|umbralConfianza|number|true|none|none|

<h2 id="tocS_UpdateAiConfigDto">UpdateAiConfigDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdateaiconfigdto"></a>
<a id="schema_UpdateAiConfigDto"></a>
<a id="tocSupdateaiconfigdto"></a>
<a id="tocsupdateaiconfigdto"></a>

```json
{
  "nombre": "Agente RMA",
  "descripcion": "Configuración para consultas de RMA",
  "promptBase": "Eres un asistente de soporte al cliente experto...",
  "promptsPorCanal": {},
  "modelo": "x-ai/grok-4.1-fast:free",
  "temperatura": 0.3,
  "umbralConfianza": 0.75
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|false|none|none|
|descripcion|string|false|none|none|
|promptBase|string|false|none|none|
|promptsPorCanal|object|false|none|none|
|modelo|string|false|none|none|
|temperatura|number|false|none|none|
|umbralConfianza|number|false|none|none|

<h2 id="tocS_ImportOrderDto">ImportOrderDto</h2>
<!-- backwards compatibility -->
<a id="schemaimportorderdto"></a>
<a id="schema_ImportOrderDto"></a>
<a id="tocSimportorderdto"></a>
<a id="tocsimportorderdto"></a>

```json
{
  "orderId": "ORD-2023-101",
  "clientEmail": "test.user1@example.com",
  "status": "procesando"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|orderId|string|true|none|none|
|clientEmail|string|true|none|none|
|status|string|true|none|none|

<h2 id="tocS_CreateTemplateDto">CreateTemplateDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatetemplatedto"></a>
<a id="schema_CreateTemplateDto"></a>
<a id="tocScreatetemplatedto"></a>
<a id="tocscreatetemplatedto"></a>

```json
{
  "nombre": "Saludo Estándar",
  "plantillaCuerpo": "Gracias por contactar a GearUp...",
  "plantillaAsunto": "Respuesta a su solicitud #{{ticketId}}"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|true|none|none|
|plantillaCuerpo|string|true|none|none|
|plantillaAsunto|string|false|none|none|

<h2 id="tocS_UpdateTemplateDto">UpdateTemplateDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdatetemplatedto"></a>
<a id="schema_UpdateTemplateDto"></a>
<a id="tocSupdatetemplatedto"></a>
<a id="tocsupdatetemplatedto"></a>

```json
{
  "nombre": "Saludo Estándar",
  "plantillaCuerpo": "Gracias por contactar a GearUp...",
  "plantillaAsunto": "Respuesta a su solicitud #{{ticketId}}"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|false|none|none|
|plantillaCuerpo|string|false|none|none|
|plantillaAsunto|string|false|none|none|

<h2 id="tocS_CreateTagDto">CreateTagDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatetagdto"></a>
<a id="schema_CreateTagDto"></a>
<a id="tocScreatetagdto"></a>
<a id="tocscreatetagdto"></a>

```json
{
  "nombre": "VIP",
  "descripcion": "Etiqueta para clientes VIP",
  "color": "#FF5733"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|true|none|none|
|descripcion|string|false|none|none|
|color|string|true|none|none|

<h2 id="tocS_UpdateTagDto">UpdateTagDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdatetagdto"></a>
<a id="schema_UpdateTagDto"></a>
<a id="tocSupdatetagdto"></a>
<a id="tocsupdatetagdto"></a>

```json
{
  "nombre": "VIP",
  "descripcion": "Etiqueta para clientes VIP",
  "color": "#FF5733"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|false|none|none|
|descripcion|string|false|none|none|
|color|string|false|none|none|

<h2 id="tocS_CreateIntegrationDto">CreateIntegrationDto</h2>
<!-- backwards compatibility -->
<a id="schemacreateintegrationdto"></a>
<a id="schema_CreateIntegrationDto"></a>
<a id="tocScreateintegrationdto"></a>
<a id="tocscreateintegrationdto"></a>

```json
{
  "nombre": "Mailgun",
  "claveApiEnc": "sk_live_xxxxxxxxxxxx",
  "endpoint": "https://api.mailgun.net/v3",
  "urlWebhook": "https://example.com/webhook",
  "configJson": {},
  "activo": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|true|none|none|
|claveApiEnc|string|true|none|none|
|endpoint|string|false|none|none|
|urlWebhook|string|false|none|none|
|configJson|object|false|none|none|
|activo|boolean|false|none|none|

<h2 id="tocS_UpdateIntegrationDto">UpdateIntegrationDto</h2>
<!-- backwards compatibility -->
<a id="schemaupdateintegrationdto"></a>
<a id="schema_UpdateIntegrationDto"></a>
<a id="tocSupdateintegrationdto"></a>
<a id="tocsupdateintegrationdto"></a>

```json
{
  "nombre": "Mailgun",
  "claveApiEnc": "sk_live_xxxxxxxxxxxx",
  "endpoint": "https://api.mailgun.net/v3",
  "urlWebhook": "https://example.com/webhook",
  "configJson": {},
  "activo": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|nombre|string|false|none|none|
|claveApiEnc|string|false|none|none|
|endpoint|string|false|none|none|
|urlWebhook|string|false|none|none|
|configJson|object|false|none|none|
|activo|boolean|false|none|none|

