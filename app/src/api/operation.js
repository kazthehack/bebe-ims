export const op = (strings, ...values) => {
  const source = strings.reduce((acc, part, index) => acc + part + (values[index] || ''), '')
  const normalized = source.replace(/\s+/g, ' ').trim()
  const match = normalized.match(/\b(query|mutation)\s+([A-Za-z_][A-Za-z0-9_]*)/i)
  const operation = match ? match[1].toLowerCase() : 'query'
  const name = match ? match[2] : 'anonymousOperation'

  return {
    kind: 'Document',
    source,
    definitions: [
      {
        kind: 'OperationDefinition',
        operation,
        name: { value: name },
      },
    ],
  }
}

export default op
