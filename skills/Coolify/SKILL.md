---
name: Coolify
description: Deploy and manage services on Coolify. USE WHEN Coolify, deploy service, docker-compose, create project, manage containers, configure domain, env vars Coolify.
---

# Coolify Skill

Deploy and manage services on the Coolify instance at `https://coolify.bunnichrist.fr`.

## Credentials

- **URL:** `https://coolify.bunnichrist.fr`
- **Token:** `F:\Downloads\Kirito cc\coolify api token.txt`
- **Auth header:** `Authorization: Bearer <token>`

## Critical Rules

1. **All API calls MUST go via SSH from the VPS** — the PC IP is not whitelisted.
   ```bash
   ssh root@173.249.27.216 "curl -4 -s -X GET 'https://coolify.bunnichrist.fr/api/v1/...' -H 'Authorization: Bearer TOKEN'"
   ```
2. **Always force IPv4:** `curl -4` (IPv6 not accepted).
3. **For multi-step scripts:** write a `.sh` locally, SCP to VPS, execute via SSH.
   ```bash
   scp "F:/Downloads/Kirito cc/script.sh" root@173.249.27.216:/tmp/script.sh && ssh root@173.249.27.216 "bash /tmp/script.sh"
   ```

---

## Known Infrastructure

| UUID | Name | Type |
|------|------|------|
| `x40os8k4owk4swwo48wogkos` | localhost (VPS) | Server |
| `dg8gsosgccwwgk0w004c000g` | n8n | Service |
| `vo04cg0gwg4808ko8k8cgc0s` | shlink | Service |

---

## API Reference

### Projects

```
GET    /api/v1/projects                  → list all projects
POST   /api/v1/projects                  → create {name, description}
GET    /api/v1/projects/{uuid}           → detail + environments (contains environment_name)
PATCH  /api/v1/projects/{uuid}           → update
DELETE /api/v1/projects/{uuid}           → delete
```

### Servers

```
GET    /api/v1/servers                   → list servers (get server_uuid)
GET    /api/v1/servers/{uuid}            → detail
```

### Services (multi-container docker-compose)

```
GET    /api/v1/services                  → list all services
GET    /api/v1/services/{uuid}           → detail (applications[].uuid/fqdn/status, databases[], status)
PATCH  /api/v1/services/{uuid}           → update (only: name, description, instant_deploy, docker_compose_raw, connect_to_docker_network)
DELETE /api/v1/services/{uuid}           → delete
GET    /api/v1/services/{uuid}/start     → start
GET    /api/v1/services/{uuid}/restart   → restart
GET    /api/v1/services/{uuid}/stop      → stop
```

> ⚠️ `POST /api/v1/services` is for **one-click apps only** (n8n, Ghost, etc.)
> For custom docker-compose, use `POST /api/v1/applications/dockercompose`

#### Create a custom docker-compose service

```
POST /api/v1/applications/dockercompose
{
  "project_uuid": "...",
  "server_uuid": "...",
  "environment_name": "production",
  "name": "my-service",
  "description": "...",
  "docker_compose_raw": "<base64>",   ← MUST be base64 encoded
  "instant_deploy": false
}
```

Encode the compose file:
```bash
COMPOSE_B64=$(base64 -w 0 /tmp/my-compose.yml)
```

### Environment Variables (service)

```
GET    /api/v1/services/{uuid}/envs              → list (uuid + key, value NOT returned)
POST   /api/v1/services/{uuid}/envs              → create {key, value}
PATCH  /api/v1/services/{uuid}/envs              → update by key {key, value}
PATCH  /api/v1/services/{uuid}/envs/bulk         → bulk update {data: [{key, value}, ...]}
DELETE /api/v1/services/{uuid}/envs/{env_uuid}   → delete
```

### Applications (standalone)

```
GET    /api/v1/applications                      → list
GET    /api/v1/applications/{uuid}               → detail
PATCH  /api/v1/applications/{uuid}               → update (domains, name, etc.)
```

### Domains for service applications (ServiceApplication)

**No API endpoint exists.** Update directly in the Coolify database:

```bash
docker exec coolify-db psql -U coolify -d coolify -c \
  "UPDATE service_applications SET fqdn='https://my.domain.fr' WHERE uuid='<app_uuid>';"
```

The app UUIDs are found in `GET /api/v1/services/{uuid}` → `applications[].uuid`.

---

## Deployment Workflow (docker-compose custom)

```
1. Read token from file
2. Generate secrets (node -e "require('crypto').randomBytes(32).toString('base64url')")
3. POST /api/v1/projects → get project_uuid
4. GET /api/v1/projects/{uuid} → get environment_name
5. GET /api/v1/servers → get server_uuid
6. Write docker-compose.yml locally, SCP to VPS
7. POST /api/v1/applications/dockercompose (base64 compose) → get service_uuid
8. PATCH /api/v1/services/{uuid}/envs (for each env var)
9. DB update: service_applications fqdn for each app
10. GET /api/v1/services/{uuid}/start
11. Verify: curl health endpoints + docker ps | grep <name>
```

---

## Common Gotchas

- **Port mismatch:** always verify the actual port the image listens on (`docker exec <container> nginx -T | grep listen`). Never assume port 80.
- **env vars parsed from compose:** Coolify auto-creates env vars from `${VAR}` in compose — they exist but have no value. Use PATCH (not POST) to set values.
- **FQDN set before start:** the DB fqdn update is read at start time. Set it before starting the service.
- **Traefik labels applied at start:** modifying docker_compose_raw requires a restart to regenerate labels.
- **Service status cache:** Coolify API status may lag behind reality. Cross-check with `docker ps`.
- **SSH quoting:** avoid complex inline SSH commands with mixed quotes. Write a `.sh` script, SCP, then execute.
