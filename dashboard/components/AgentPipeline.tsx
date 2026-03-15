export default function AgentPipeline() {
  return (
    <div
      style={{
        border: "1px solid #fafafa",
        padding: "16px",
        borderRadius: "10px",
        background: "black",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
         IQAI Agent Pipeline
      </h3>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <span style={agent}>Auditor Agent</span>
        →
        <span style={agent}>Risk Agent</span>
        →
        <span style={agent}>Policy Agent</span>
        →
        <span style={agent}>Negotiator Agent</span>
      </div>
    </div>
  )
}

const agent = {
  background: "#132407",
  padding: "8px 12px",
  borderRadius: "6px",
}