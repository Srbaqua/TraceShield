export default function MCPIntegrationPanel() {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        padding: "16px",
        borderRadius: "10px",
        background: "black",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
        Agent Integration
      </h3>

      <p style={{ marginTop: "10px" }}>
        Provider: <strong>Nullshot MCP</strong>
      </p>

      <p>
        Status: <span style={{ color: "green" }}>Connected</span>
      </p>

      <h4 style={{ marginTop: "10px" }}>Available Tools</h4>

      <ul>
        <li>sentinel-analyze-transaction</li>
        <li>sentinel-get-governance-logs</li>
        <li>sentinel-suggest-policy</li>
      </ul>

      <p style={{ marginTop: "10px", fontSize: "12px", color: "#dbe0e9" }}>
        MCP Endpoint
        <br />
       <a href = "http://127.0.0.1:8787/sse" target="_blank" rel="noreferrer">http://127.0.0.1:8787/sse</a>
      </p>
    </div>
  )
}