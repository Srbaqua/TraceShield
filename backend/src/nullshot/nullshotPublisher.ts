import axios from "axios"

export async function publishPolicyToNullshot(rule: any) {

  try {

    const response = await axios.post(
      "https://api.nullshot.ai/jam/policy",
      {
        ruleName: rule.name,
        field: rule.field,
        operator: rule.operator,
        value: rule.value,
        action: rule.action,
        reason: rule.reason
      }
    )

    return response.data

  } catch (error) {

    console.log("Nullshot publish failed", error)

  }

}