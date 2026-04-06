import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from 'components/reusable/modals/FormModal'
import { CUSTOM_DESIGN_SOURCE_VALUE } from 'pages/products/constants/designSources'

const Label = styled.label`
  display: grid;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #4b6176;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const Textarea = styled.textarea`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  min-height: 82px;
  margin: 0;
  padding: 8px 10px;
  background: #f0f3f6;
  resize: vertical;
`

const Select = styled.select`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  background: #f0f3f6;
`

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`

const UploadButton = styled.button`
  height: 34px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  padding: 0 10px;
  cursor: not-allowed;
  opacity: 0.75;
`

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
`

const ErrorMeta = styled.div`
  margin-top: 8px;
  color: #9f1f1f;
  background: #fdeaea;
  border: 1px solid #f3b7b7;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 12px;
`

const Hint = styled.div`
  border: 1px solid #d7e0ec;
  background: #eef3f8;
  border-radius: 4px;
  min-height: 38px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #516981;
`

const AddProductModal = ({
  open,
  skuPreview,
  name,
  productLine,
  category,
  listPrice,
  designSource,
  customDesignSource,
  thirdPartySourceUrl,
  localWorkingFiles,
  imageUrl,
  categoryOptions,
  designSourceOptions,
  productLineOptions,
  formError,
  onChangeName,
  onChangeProductLine,
  onChangeCategory,
  onChangeListPrice,
  onChangeDesignSource,
  onChangeCustomDesignSource,
  onChangeThirdPartySourceUrl,
  onChangeLocalWorkingFiles,
  onChangeImageUrl,
  onClose,
  onSubmit,
  lockProductLine,
}) => {
  if (!open) return null

  return (
    <FormModal
      open={open}
      title="Add Product"
      onClose={onClose}
      onConfirm={onSubmit}
      confirmLabel="Create"
      cancelLabel="Cancel"
      width="480px"
      actionsAlign="right"
      closeControl="glyph"
    >

      <Label>
        Product Line *
        <Select
          value={productLine}
          onChange={event => onChangeProductLine(event.target.value)}
          disabled={lockProductLine}
        >
          <option value="">Select product line</option>
          {productLineOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
      </Label>

      <Label>Product Name *<Input value={name} onChange={event => onChangeName(event.target.value)} /></Label>

      <Label>
        Pricing Tier
        <Select value={category} onChange={event => onChangeCategory(event.target.value)}>
          <option value="">Select pricing tier</option>
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
      </Label>

      <Label>List Price (PHP)<Input type="number" value={listPrice} onChange={event => onChangeListPrice(event.target.value)} /></Label>
      <Label>
        Design Source
        <Select value={designSource} onChange={event => onChangeDesignSource(event.target.value)}>
          <option value="">Select design source</option>
          {designSourceOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
          <option value={CUSTOM_DESIGN_SOURCE_VALUE}>Custom...</option>
        </Select>
      </Label>
      {designSource === CUSTOM_DESIGN_SOURCE_VALUE && (
        <Label>
          Custom Design Source
          <Input value={customDesignSource} onChange={event => onChangeCustomDesignSource(event.target.value)} />
        </Label>
      )}
      <Label>3rd-party Source URL<Input value={thirdPartySourceUrl} onChange={event => onChangeThirdPartySourceUrl(event.target.value)} /></Label>
      <Label>
        Local Working Files (one per line)
        <Textarea value={localWorkingFiles} onChange={event => onChangeLocalWorkingFiles(event.target.value)} />
      </Label>
      <Label>Image URL<Input value={imageUrl} onChange={event => onChangeImageUrl(event.target.value)} /></Label>
      <UploadRow>
        <UploadButton type="button" disabled>Upload to S3</UploadButton>
        <Meta>AWS upload helper scaffolded. UI integration is coming next.</Meta>
      </UploadRow>

      <Label>
        Product ID (Auto-generated)
        <Hint>{skuPreview || 'Will be generated on save'}</Hint>
      </Label>

      {formError && <ErrorMeta>{formError}</ErrorMeta>}
    </FormModal>
  )
}

AddProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  skuPreview: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  productLine: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  listPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  designSource: PropTypes.string.isRequired,
  customDesignSource: PropTypes.string.isRequired,
  thirdPartySourceUrl: PropTypes.string.isRequired,
  localWorkingFiles: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  categoryOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  designSourceOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  productLineOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  formError: PropTypes.string.isRequired,
  onChangeName: PropTypes.func.isRequired,
  onChangeProductLine: PropTypes.func.isRequired,
  onChangeCategory: PropTypes.func.isRequired,
  onChangeListPrice: PropTypes.func.isRequired,
  onChangeDesignSource: PropTypes.func.isRequired,
  onChangeCustomDesignSource: PropTypes.func.isRequired,
  onChangeThirdPartySourceUrl: PropTypes.func.isRequired,
  onChangeLocalWorkingFiles: PropTypes.func.isRequired,
  onChangeImageUrl: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  lockProductLine: PropTypes.bool,
}

AddProductModal.defaultProps = {
  lockProductLine: false,
}

export default AddProductModal
