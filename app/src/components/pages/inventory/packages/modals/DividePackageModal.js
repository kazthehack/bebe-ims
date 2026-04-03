import React from 'react'
import PropTypes from 'prop-types'
import ButtonModal from 'components/Modal/ButtonModal'
import Button from 'components/common/input/Button'
import { withModals, connectModal, withConfirm } from 'components/Modal'
import { Form } from 'react-final-form'
import { toNumber } from 'lodash'
import { compose, withStateHandlers } from 'recompose'
import DividePackageForm from './partials/DividePackageForm'

const styles = {
  footer: {
    button: {
      height: '56px',
    },
    footer: {
      height: '56px',
    },
  },
  content: {
    content: {
      width: '732px',
      marginTop: '40px',
    },
  },
}

const originalPackageMocks = {
  name: '!Bubba Kush High Shelf!',
  strain: '!Bubba Kush!',
  tag: '!ABCDEF012345670000010042!',
  source: '!Green Farms!',
  category: '!Buds!',
}

const initialValuesMap = {
  oldPackageQuantity: '500',

  newPackageName: 'Bubba Kush - Shake',
  newPackageCategory: 'SHAKE',
  newPackageQuantity: '0',

  newProductActive: true,
  newProductMedical: false,
  newProductName: 'Bubba Kush - Shake',
  newProductCategory: 'FLOWER',
  newProductType: 'SHAKE',

  connectedProduct: undefined,
}

const ConnectedButtonModal = connectModal('DividePackageModal')(ButtonModal)

const buttonText = (display) => {
  if (display === 0) return 'Divide Package'
  else if (display === 1) return 'Proceed'
  return 'Create Product'
}

const primaryButtonDisabled = (
  quantity, display, connectedProduct, newPackageNameError,
) => {
  const val = toNumber(quantity)
  return (
    ((display === 0) && (!val || !!newPackageNameError))
    ||
    ((display === 1) && !connectedProduct)
  )
}

const parseQuantity = (value, form, initialValue, otherValueName) => {
  let newValue = toNumber(value) // newValue is what the opposite value is calculated from.
  let returnValue = newValue // returnValue is what this input will be parsed to.
  const periodIndex = value.indexOf('.')
  if (value === '' || value === '.') {
    form.change(otherValueName, initialValue)
    return value
  } else if (periodIndex > -1) {
    const start = value.substring(0, periodIndex)
    const end = value.substring(periodIndex + 1)
    if (end === '') {
      returnValue = value
      newValue = toNumber(start)
    } else if (Number.isNaN(toNumber(end)) || Number.isNaN(toNumber(start)) || end.indexOf('.') > -1 || end.indexOf('-') > -1) {
      returnValue = 0
      newValue = 0
    } else {
      const trimmedEnd = end.substring(0, 2)
      returnValue = `${start}.${trimmedEnd}`
      newValue = toNumber(`${start}.${trimmedEnd}`)
    }
  } else if (Number.isNaN(newValue)) {
    form.change(otherValueName, initialValue)
    return 0
  }

  if (newValue < 0) {
    form.change(otherValueName, initialValue)
    return 0
  } else if (newValue > initialValue) {
    form.change(otherValueName, 0)
    return initialValue
  }
  newValue *= 100
  const startingValue = initialValue * 100
  const val = (Math.round(startingValue - newValue)) / 100
  form.change(otherValueName, val)
  return returnValue
}

const exampleMutation = data => console.log('Mutation here', data) // eslint-disable-line no-console

const DividePackageModal = ({ pushModal, popModal, display, changeDisplay, confirm }) => (
  <Form
    onSubmit={exampleMutation}
    initialValues={initialValuesMap}
    render={({ handleSubmit, values, form, initialValues, pristine, errors }) => (
      <form>
        <Button
          primary
          onClick={() => {
            form.reset()
            changeDisplay(0)
            pushModal('DividePackageModal')
          }}
        >
          DIVIDE PACKAGE
        </Button>
        <ConnectedButtonModal
          title="Divide Package"
          header="Divide Package"
          primaryButton={{
            text: buttonText(display),
            onClick: () => {
              if (display === 0) {
                changeDisplay(1)
              } else if (display === 1) {
                // splitPackage mutation
                handleSubmit(values)
                popModal()
                changeDisplay(0)
              } else {
                // createProduct mutation
                exampleMutation(values)
                changeDisplay(1)
              }
            },
            disabled: primaryButtonDisabled(
              values.newPackageQuantity, display, values.connectedProduct, errors.newPackageName,
            ),
          }}
          secondaryButton={{
            text: 'back',
            onClick: () => {
              if (display === 1) {
                changeDisplay(0)
              } else if (display === 2) {
                changeDisplay(1)
              } else if (pristine) {
                popModal()
              } else {
                confirm({ message: 'This will discard your changes' }).then(
                  (confirmed) => {
                    if (confirmed) popModal()
                  },
                )
              }
            },
          }}
          footerStyle={styles.footer}
          contentStyle={styles.content}
        >
          <DividePackageForm
            display={display}
            originalPackageData={originalPackageMocks}
            data={values}
            newProductFunc={() => {
              form.change('connectedProduct', undefined)
              changeDisplay(2)
            }}
            oldPackageParse={value => parseQuantity(value, form, initialValues.oldPackageQuantity, 'newPackageQuantity')}
            newPackageParse={value => parseQuantity(value, form, initialValues.oldPackageQuantity, 'oldPackageQuantity')}
            moveAllFunc={() => {
              form.change('newPackageQuantity', initialValues.oldPackageQuantity)
              form.change('oldPackageQuantity', 0)
            }}
            onQuantityBlur={(field) => { if (values[field] === '') form.change(field, 0) }}
          />
        </ConnectedButtonModal>
      </form>
    )}
  />
)

DividePackageModal.propTypes = {
  pushModal: PropTypes.func,
  popModal: PropTypes.func,
  display: PropTypes.number,
  changeDisplay: PropTypes.func,
  confirm: PropTypes.func.isRequired,
}

export default compose(
  withConfirm(),
  withModals,
  withStateHandlers(
    { display: 0 },
    { changeDisplay: () => display => ({ display }) },
  ),
)(DividePackageModal)
