/* eslint-disable no-tabs */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from 'components/common/input/Button'
import FileRenderer from 'utils/fileRenderer'
import { ObjectApi } from 'api/client'
import { getTenantId } from 'api/imsBridge'
import { compose } from 'recompose'
import { withSessionState } from 'utils/hoc'
import { BasicSpinner } from 'components/common/display/Spinner'

const MAX_IMAGE_FILESIZE_B = 6000000 // max bytes for 1000 x 1000 px at 600 dpi on 48 bit depth
const MAX_IMAGE_PIXEL_X2 = 1080
const ACCEPTABLE_IMAGE_TYPE = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp']

const StyledLogo = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

const LogoContainer = styled.div`
  width: 320px;
  height: 320px;
  background-color: ${({ disabled }) => (disabled ? '#c7c7c7' : '#ffffff')};
  border-radius: 2px;
  border: solid 1px #c7c7c7;
`

const StyledUploadButton = styled(Button)`
  width: 208px;
  height: 48px;
  border-radius: 2px;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  background-color: #1875f0;
`

export const setStoreLogo = async ({ storeId, logoUrl }) => {
  const tenantId = getTenantId()
  const existing = await ObjectApi.get('store', storeId, tenantId).catch(() => null)
  const existingPayload = existing && existing.payload ? existing.payload : {}
  await ObjectApi.update('store', storeId, tenantId, {
    ...existingPayload,
    logoUrl,
  })
  return { success: true }
}

const StoreLogoUploader = ({ disabled, storeId, existingLogoUrl }) => {
  const [imgFile, setImgFile] = useState({ preview: { url: '' } })
  const [imgDimensions, setImgDimensions] = useState({ height: 250, width: 250 })
  const [isUploading, setIsUploading] = useState(false)
  // TODO: make this an alert of sorts?
  const [errorMessage, setErrorMessage] = useState('')

  const { preview } = imgFile
  const { url: logoFilePath } = preview

  const defaultSubMessage = `Logo Dimensions ${imgDimensions.height} x ${imgDimensions.width}px`
  const subMessage = isUploading ? 'Uploading...' : 'Click or Drag a new image to replace'
  const finalSubMessage = disabled ? defaultSubMessage : subMessage
  const handleLogoUpload = (e) => {
    setErrorMessage('')
    let errorMsg = ''
    const img = e[e.length ? e.length - 1 : 0]
    if (img) {
      setImgFile(img)
      const imgObj = new Image()
      imgObj.src = img.preview.url
      imgObj.onload = () => {
        const { height, width } = imgObj
        setImgDimensions({ height, width })
        if (height > MAX_IMAGE_PIXEL_X2 || width > MAX_IMAGE_PIXEL_X2) {
          setErrorMessage(`Max upload size: ${MAX_IMAGE_PIXEL_X2} x ${MAX_IMAGE_PIXEL_X2}px`)
          errorMsg = `Max upload size: ${MAX_IMAGE_PIXEL_X2} x ${MAX_IMAGE_PIXEL_X2}px`
        }
      }
      imgObj.onabort = () => { imgObj.parentNode.removeChild(imgObj) }

      if (!errorMsg) {
        const logoUrl = img.preview.url
        setIsUploading(true)
        setStoreLogo({ storeId, logoUrl })
          .then((result) => {
            if (!result.success) {
              setErrorMessage('Oops, something went wrong. Please try again.')
              return
            }
            setImgFile({ ...imgFile, preview: { url: logoUrl } })
          })
          .catch((err) => { setErrorMessage(err) })
          .finally(() => { setIsUploading(false) })
      }
    }
  }

  useEffect(() => {
    setErrorMessage('')
    setImgFile({ ...imgFile, preview: { url: existingLogoUrl } })
    const imgObj = new Image()
    imgObj.src = existingLogoUrl
    imgObj.onload = () => {
      const { height, width } = imgObj
      setImgDimensions({ height, width })
      if (height > MAX_IMAGE_PIXEL_X2 || width > MAX_IMAGE_PIXEL_X2) {
        setErrorMessage(`Max upload size: ${MAX_IMAGE_PIXEL_X2} x ${MAX_IMAGE_PIXEL_X2}px`)
      }
    }
    imgObj.onabort = () => { imgObj.parentNode.removeChild(imgObj) }

    return () => {
      // fix "Can't perform a React state update on an unmounted component" error
      // cancelling the load image request
      imgObj.src = ''
    }
  }, [existingLogoUrl])

  return (
    <>
      <FileRenderer
        maxFileSize={MAX_IMAGE_FILESIZE_B}
        onChange={handleLogoUpload}
        onError={(e) => { setErrorMessage(e) }}
        accepts={ACCEPTABLE_IMAGE_TYPE}
        clickable
        disabled={disabled}
      >
        <LogoContainer
          disabled={disabled}
          style={{
            display: 'flex', // TODO: for some reason can't make this work with styled-components
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {logoFilePath &&
            <StyledLogo
              src={logoFilePath}
              alt="Store Logo"
              disabled={disabled}
            />
          }
          {!logoFilePath &&
            <StyledUploadButton
              disabled={disabled}
              primary
              onClick={e => e.preventDefault()}
            >
              UPLOAD LOGO
            </StyledUploadButton>
          }
        </LogoContainer>
      </FileRenderer>
      <div
        style={{
          display: 'flex',
          width: '320px',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '250px',
            marginTop: '9px',
            fontSize: '14px',
            color: disabled ? '#ababab' : 'black',
            textAlign: 'center',
          }}
        >
          {errorMessage &&
            <div style={{ color: 'red' }}>
              {`${errorMessage}`}
              <br />
            </div>
          }
          {`${finalSubMessage}`}
          {isUploading && <BasicSpinner size={10} />}
        </div>
      </div>
    </>
  )
}

export default compose(withSessionState)(StoreLogoUploader)
