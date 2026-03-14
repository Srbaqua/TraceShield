export default function GovernancePipeline({ trace }: any) {

  if (!trace) return null

  return (
    <div className="mt-6 p-4 border rounded bg-gray-900 text-white">
      <h2 className="text-lg font-bold mb-4">
        Governance Pipeline
      </h2>

      <div className="flex flex-col gap-3">

        {trace.steps.map((step: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >

            <div className="w-3 h-3 bg-green-400 rounded-full" />

            <div>
              <div className="font-semibold">
                {step.agent}
              </div>

              <div className="text-sm text-gray-300">
                {step.action}
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}