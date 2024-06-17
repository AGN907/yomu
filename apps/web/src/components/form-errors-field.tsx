type FormErrorsFieldProps = {
  result: {
    validationErrors?: Record<string, string[]>
    data?: {
      error?: string
      success?: string
    }
  }
}

function FormErrorsField({ result }: FormErrorsFieldProps) {
  return (
    <div>
      {result?.validationErrors ? (
        <ul className="bg-destructive/10 text-destructive list-disc space-y-1 rounded-lg border p-2 text-[0.8rem] font-medium">
          {Object.values(result.validationErrors).flatMap((err, index) => (
            <li className="ml-4" key={index}>
              {err}
            </li>
          ))}
        </ul>
      ) : result?.data?.error ? (
        <p className="bg-destructive/10 text-destructive rounded-lg border p-2 text-[0.8rem] font-medium">
          {result.data.error}
        </p>
      ) : null}
    </div>
  )
}

export { FormErrorsField }
