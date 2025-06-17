# 🧠 Documentación Técnica - Canales (Channels) por Workspace

## 📦 Backend API

---

### 🔹 GET `/api/workspace/:workspace_id/channels/`

**¿Qué hace?**  
Obtiene todos los canales pertenecientes al workspace consultado.

**Ejemplo de respuesta:**
```json
{
  "message": "Canales obtenidos",
  "ok": true,
  "status": 200,
  "data": {
    "channels": [
      // Aquí vendrá la lista de canales
    ]
  }
}
```

---

### 🔹 POST `/api/workspace/:workspace_id/channels/`

**¿Qué hace?**  
Crea un nuevo canal dentro del workspace.

**Cuerpo de la solicitud (body):**
```json
{
  "name": "Canal de estudio"
}
```

**Validaciones:**
- El campo `name` debe cumplir:
  - Ser un **string**.
  - Tener **menos de 12 caracteres**.
  - No repetir un canal ya existente en el mismo workspace.

> 💡 **Cómo detectar si un canal ya existe**  
> Se puede usar algo como:  
> `Channel.find({ name: 'Canal de estudio', workspace_id: 1 })`  
> Si la lista tiene elementos, el nombre ya está en uso.

**Manejo de errores:**
- Si hay errores de validación → **status 400** con mensaje adecuado.

**Respuesta esperada (caso exitoso):**
```json
{
  "message": "Canal creado",
  "ok": true,
  "status": 201,
  "data": {
    "channels": [
      // Lista actualizada de canales
    ]
  }
}
```

> 🔐 (Opcional para más adelante): Permitir solo al **dueño del workspace** crear canales.

---

### 🔹 (Opcional) DELETE `/api/workspace/:workspace_id/channels/:channel_id`

**¿Qué hace?**  
Elimina un canal específico del workspace.

**Validaciones:**
- Verificar si el canal **existe** → Si no, responder con **status 404**.
- (Recomendado) Permitir la eliminación solo a usuarios con rol adecuado (por ejemplo: evitar que `user` o `member` puedan eliminar) → Si no tiene permisos, **status 403**.

**Respuesta esperada (caso exitoso):**
```json
{
  "message": "Canal eliminado",
  "ok": true,
  "status": 200,
  "data": {
    "channels": [
      // Lista actualizada de canales
    ]
  }
}
```

---

## 🖥️ Frontend (pendiente)

En próximos pasos se documentará cómo consumir estas APIs desde el cliente.