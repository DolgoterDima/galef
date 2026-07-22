# Figma API Usage Notes

Use these rules before making Figma API requests from this project.

## Token

- Read the token from environment variables only.
- Prefer `FIGMA_PERSONAL_ACCESS_TOKEN`.
- Fallback: `FIGMA_API_KEY`.
- Never print the token value to the console or write it into files.

PowerShell check:

```powershell
Get-ChildItem Env:*FIGMA* | ForEach-Object { "$($_.Name)=<set length=$($_.Value.Length)>" }
```

## URL Parsing

For a Figma URL like:

```text
https://www.figma.com/design/Ws4eJeriga2jxeqBasuHAb/Galef_project--Copy-?node-id=513-14521
```

Use:

```text
file_key = Ws4eJeriga2jxeqBasuHAb
node_id = 513:14521
```

Convert `node-id=513-14521` to `513:14521` before calling the API.

## Preferred Request

Request only the needed node, not the whole file:

```text
GET https://api.figma.com/v1/files/{file_key}/nodes?ids={node_id}
```

PowerShell:

```powershell
$token = $env:FIGMA_PERSONAL_ACCESS_TOKEN
if (-not $token) { $token = $env:FIGMA_API_KEY }

$fileKey = "Ws4eJeriga2jxeqBasuHAb"
$nodeId = "513:14521"
$url = "https://api.figma.com/v1/files/$fileKey/nodes?ids=$nodeId"

Invoke-RestMethod -Uri $url -Headers @{ "X-Figma-Token" = $token } -Method Get
```

## Rate Limit Rules

- Do not make parallel Figma API requests.
- Do not retry immediately after a failed request.
- If the API returns `429`, inspect `Retry-After` and wait that exact time.
- A request every 5 minutes is still too frequent if `Retry-After` is larger.
- Avoid using another editor/MCP/agent with the same token while Codex is querying Figma.

Header inspection:

```powershell
try {
  Invoke-WebRequest -Uri $url -Headers @{ "X-Figma-Token" = $token } -Method Get | Out-Null
  "OK"
} catch {
  $resp = $_.Exception.Response
  if ($resp) {
    "status=$([int]$resp.StatusCode)"
    foreach ($name in @("Retry-After", "X-Figma-Plan-Tier", "X-Figma-Rate-Limit-Type", "X-Figma-Upgrade-Link")) {
      $value = $resp.Headers[$name]
      if ($value) { "$name=$value" } else { "$name=<missing>" }
    }
  }
  if ($_.ErrorDetails.Message) { "body=$($_.ErrorDetails.Message)" }
}
```

## Cache

Cache every successful response before using it for implementation.

Recommended folder:

```text
.figma-cache/
```

Recommended filename format:

```text
{file_key}__{node_id_with_dash}.json
```

Example:

```text
.figma-cache/Ws4eJeriga2jxeqBasuHAb__513-14521.json
```

PowerShell save:

```powershell
New-Item -ItemType Directory -Force -Path ".figma-cache" | Out-Null
$cachePath = ".figma-cache/Ws4eJeriga2jxeqBasuHAb__513-14521.json"
$data = Invoke-RestMethod -Uri $url -Headers @{ "X-Figma-Token" = $token } -Method Get
$data | ConvertTo-Json -Depth 100 | Set-Content -Path $cachePath -Encoding UTF8
```

When a matching cache file exists, read the cache instead of querying Figma again.

## User-Provided Exports

If Figma API is rate-limited, user-provided files are enough for implementation when both are available:

- JSON export for the exact frame/node.
- PNG screenshot/export for the same frame and viewport.

The JSON does not have to be raw Figma REST API output. Plugin exports such as `Figma to JSON Exporter` are acceptable if they include:

- `metadata`
- `designTokens`
- `structure`
- `summary`

For this project, the desktop checkout reference is cached as:

```text
.figma-cache/Ws4eJeriga2jxeqBasuHAb__513-14521.json
.figma-cache/Ws4eJeriga2jxeqBasuHAb__513-14521.png
```

Source Figma URL:

```text
https://www.figma.com/design/Ws4eJeriga2jxeqBasuHAb/Galef_project--Copy-?node-id=513-14521&t=8ICUPgRwJAIzcv62-4
```

Known breakpoint rule from the user:

```text
Wide screens down to 1200px use the desktop layout.
From 1200px down to 960px, the layout is the same, but content width becomes 100%.
```

## Workflow

1. Parse the Figma URL into `file_key` and `node_id`.
2. Check whether `.figma-cache/{file_key}__{node_id}.json` already exists.
3. If cache exists, use it.
4. If cache is missing, make one node request.
5. Save the response to `.figma-cache`.
6. Implement from the cached JSON and local screenshots/build output.
7. On `429`, stop Figma requests and report `Retry-After`, plan tier, and rate limit type.
