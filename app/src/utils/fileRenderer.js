/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'

// eslint-disable-next-line no-useless-escape
const mimeTypeRegexp = /^(application|audio|example|image|message|model|multipart|text|video)\/[a-z0-9\.\+\*-]+$/
const extRegexp = /\.[a-zA-Z0-9]*$/

// decoupled file helpers
const mimeTypeLeft = m => m.split('/')[0]
const mimeTypeRight = m => m.split('/')[1]
const fileExtension = (file) => {
  const { name } = file
  const extensionSplit = name.split('.')
  if (extensionSplit.length > 1) {
    return extensionSplit[extensionSplit.length - 1]
  }

  return 'none'
}
const fileSizeReadable = (size) => {
  if (size >= 1000000000) {
    return `${Math.ceil(size / 1000000000)}GB`
  } else if (size >= 1000000) {
    return `${Math.ceil(size / 1000000)}MB`
  } else if (size >= 1000) {
    return `${Math.ceil(size / 1000)}kB`
  }

  return `${Math.ceil(size)}B`
}

const defaultProps = {
  // eslint-disable-next-line no-unused-vars
  onChange: (files) => {},
  // eslint-disable-next-line no-unused-vars
  onError: (error, file) => {},
  className: 'files-dropzone',
  dropActiveClassName: 'files-dropzone-active',
  accepts: null,
  multiple: true,
  maxFiles: Infinity,
  maxFileSize: Infinity,
  minFileSize: 0,
  name: 'file',
  clickable: true,
  disabled: false,
}

const defaultState = {
  id: 0,
  files: [],
  dropzone: { className: '' },
}

const FileRenderer = (props = defaultProps) => {
  const [state, setState] = useState(defaultState)
  let inputElement = {
    value: null,
    click: () => {},
  }
  let dropzone = { className: '' }

  // helpers
  const onError = (error, file) => props.onError(error, file)

  const fileTypeAcceptable = (file) => {
    const { accepts } = props
    if (!accepts) {
      return true
    }

    const { type, extension, name } = file

    const result = accepts.some((accept) => {
      if (type && accept.match(mimeTypeRegexp)) {
        const typeLeft = mimeTypeLeft(type)
        const typeRight = mimeTypeRight(type)
        const acceptLeft = accept.split('/')[0]
        const acceptRight = accept.split('/')[1]
        if (acceptLeft && acceptRight) {
          if (acceptLeft === typeLeft && acceptRight === '*') {
            return true
          }
          if (acceptLeft === typeLeft && acceptRight === typeRight) {
            return true
          }
        }
      } else if (extension && accept.match(extRegexp)) {
        const ext = accept.substr(1)
        return extension.toLowerCase() === ext.toLowerCase()
      }
      return false
    })

    if (!result) {
      onError({
        code: 1,
        message: `${name} is not a valid file type`,
      }, file)
    }

    return result
  }

  const fileSizeAcceptable = (file) => {
    if (!file) { return false }

    const { maxFileSize, minFileSize } = props
    const { size, name } = file
    if (size > maxFileSize) {
      onError({
        code: 2,
        message: `${name} is too large`,
      }, file)
      return false
    } else if (size < minFileSize) {
      onError({
        code: 3,
        message: `${name} is too small`,
      }, file)
      return false
    }

    return true
  }

  // events

  const onDragLeave = () => {
    const { className } = dropzone
    const { dropActiveClassName } = props

    const el = dropzone
    el.className = className.replace(` ${dropActiveClassName}`, '')
    setState({ ...state, dropzone: el })
  }

  const onDrop = (e) => {
    if (e) { e.preventDefault() }
    onDragLeave(e)
    const { multiple, maxFiles } = props
    // Collect added files, perform checking, cast pseudo-array to Array,
    // then return to method
    let filesAdded = e.dataTransfer ? e.dataTransfer.files : e.target.files
    // Multiple files dropped when not allowed
    if (multiple === false && filesAdded.length > 1) {
      filesAdded = [filesAdded[0]]
    }

    const files = []
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < filesAdded.length; i++) {
      const file = filesAdded[i]
      const { size, type } = file
      let { id } = state
      // Assign file an id
      // eslint-disable-next-line no-plusplus
      file.id = `files-${id++}`
      // Tell file it's own extension
      file.extension = fileExtension(file)
      // Tell file it's own readable size
      file.sizeReadable = fileSizeReadable(size)
      // Add preview, either image or file extension
      if (file.type && mimeTypeLeft(type) === 'image') {
        file.preview = {
          type: 'image',
          url: window.URL.createObjectURL(file),
        }
      } else {
        file.preview = {
          type: 'file',
        }
      }
      // Check for file max limit
      if (state.files.length + files.length >= maxFiles) {
        onError({
          code: 4,
          message: 'maximum file count reached',
        }, file)
        break
      }

      // If file is acceptable, push or replace
      if (fileTypeAcceptable(file) && fileSizeAcceptable(file)) {
        files.push(file)
      }
    }

    setState({
      ...state,
      files: multiple === false
        ? files
        : [...state.files, ...files],
    })
  }

  const onDragOver = (e) => { if (e) { e.preventDefault(); e.stopPropagation() } }

  const onDragEnter = () => {
    const { dropActiveClassName } = props
    const el = dropzone
    el.className += ` ${dropActiveClassName}`
    setState({ ...state, dropzone: el })
  }


  // additional helpers

  const openFileChooser = () => {
    inputElement.value = null
    inputElement.click()
    setState({ ...state })
  }

  // will be used outside
  // eslint-disable-next-line no-unused-vars
  const removeFile = (file) => {
    setState({
      ...state,
      files: state.files.filter(f => f.id !== file.id),
    })
  }

  // will be used outside
  // eslint-disable-next-line no-unused-vars
  const removeFiles = () => {
    setState({
      ...state,
      files: [],
    })
  }

  const inputAttributes = {
    type: 'file',
    accept: props.accepts ? props.accepts.join() : '',
    multiple: props.multiple,
    name: props.name,
    style: { display: 'none' },
    ref: (element) => { inputElement = element },
    onChange: onDrop,
  }

  useEffect(() => props.onChange(state.files), [state.files])

  return (
    <>
      <input
        {...inputAttributes}
      />
      <div
        className={props.className}
        onClick={
          props.clickable && !props.disabled
            ? openFileChooser
            : null
        }
        onDrop={!props.disabled ? onDrop : () => {}}
        onDragOver={!props.disabled ? onDragOver : () => {}}
        onDragEnter={!props.disabled ? onDragEnter : () => {}}
        onDragLeave={!props.disabled ? onDragLeave : () => {}}
        ref={(d) => { dropzone = d }}
        style={props.style}
      >
        {props.children}
      </div>
    </>
  )
}

export default FileRenderer
