export const CUSTOM_DESIGN_SOURCE_VALUE = '__custom_design_source__'

export const DESIGN_SOURCE_OPTIONS = [
  { value: 'in_house', label: 'In-house' },
  { value: 'third_party_designer', label: '3rd-party Designer' },
  { value: 'client_provided', label: 'Client Provided' },
]

export const displayLabelForDesignSource = (value) => {
  const option = DESIGN_SOURCE_OPTIONS.find((item) => item.value === value)
  if (option) return option.label
  if (!value) return 'N/A'
  return value
}
