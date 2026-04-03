import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactGA from 'react-ga'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { get } from 'lodash'
import LogoSVG from 'assets/logo.png'
import colors from 'styles/colors'
import { Form } from 'react-final-form'
import { trackPageView } from 'utils/google-analytics'
import * as GATypes from 'constants/GoogleAnalyticsTypes'
import { FormTextField } from 'components/common/input/TextField'
import { FormCheckbox } from 'components/common/input/Checkbox'
import {
  combineValidators,
  required,
  emailValidator,
  sanitizedStringValidator,
} from 'utils/validators'
import Button from 'components/common/input/Button'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`

const StyledForm = styled.form`
  width: 700px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 78px;
  padding-right: 2rem;
  padding-left: 2rem;
`

const StyledLogo = styled.img`
  align-self: center;
  width: 420px;
  max-width: 100%;
  height: auto;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
`

const StyledTitle = styled.h3`
  color: ${colors.grayDark2};
  font-size: 26px;
  text-align: center;
  font-weight: 500;
  margin-top: 1.2em;
  margin-bottom: 2em;   
`

const StyledFormGroup = styled.div`
  display: flex;
  margin: 0 17px 17px 17px;
  align-items: center;
  label {
    flex: 3 0 30%;
    font-size: 16px;
    color: ${colors.grayDark2};
    max-width: 125px;
    display: inline-block;
    margin-left: 45px;
    text-align: start;
  }
`

const StylesLabelRequired = styled.label`
  &:after {
    content: " *";
    position: relative;
    top: -5px;
  }
`

const StyledFormTextField = styled(FormTextField)`
  width: 100%;
  max-width: none;
`

const StyledErrorMessage = styled.p`
  && {
    color: ${colors.red};
    text-align: center;
  }
  margin: 10px 0;
  min-height: 24px;
`

const StyledButton = styled(Button)`
  align-self: center;
`

const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  padding: 0px 30px 30px 30px;
`

const StyledCheckboxLink = styled.a`
  margin-top: 6px;
  margin-left: 4px;
`

const initialValuesMap = {
  email: '',
  jobRole: null,
  businessName: null,
  firstName: null,
}

const TryPage = ({
  errorMessage,
  onSubmitCreateDemoUser,
}) => {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location)
  }, [location])

  return (
    <Form
      onSubmit={({ email, jobRole, firstName, businessName }) => {
        ReactGA.event({
          category: GATypes.eventCategories.demo,
          action: GATypes.eventActions.created,
          label: 'Store',
        })
        onSubmitCreateDemoUser({ email, jobRole, firstName, businessName })
      }}
      initialValues={initialValuesMap}
      render={({ handleSubmit, values }) => (
        <StyledForm onSubmit={handleSubmit} keepDirtyOnReinitialize={false}>
          <StyledContainer>
            <StyledLogo src={LogoSVG} alt="Bloom Manager Portal" />
            <StyledTitle>Try Bloom!</StyledTitle>
            <StyledFormGroup>
              <StylesLabelRequired>Email</StylesLabelRequired>
              <StyledFormTextField
                type="text"
                name="email"
                placeholder="email"
                onBlur={() => {
                  ReactGA.event({
                    category: GATypes.eventCategories.demo,
                    action: GATypes.eventActions.changed,
                    label: 'Email',
                  })
                }}
                validate={combineValidators(
                  required,
                  sanitizedStringValidator,
                  emailValidator,
                )}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <label>First Name</label>
              <StyledFormTextField
                type="text"
                name="firstName"
                placeholder="name"
                onBlur={() => {
                  ReactGA.event({
                    category: GATypes.eventCategories.demo,
                    action: GATypes.eventActions.changed,
                    label: 'First Name',
                  })
                }}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Business Name</label>
              <StyledFormTextField
                type="text"
                name="businessName"
                placeholder="name"
                onBlur={() => {
                  ReactGA.event({
                    category: GATypes.eventCategories.demo,
                    action: GATypes.eventActions.changed,
                    label: 'Business Name',
                  })
                }}
              />
            </StyledFormGroup>
            <StyledErrorMessage>
              {errorMessage}
            </StyledErrorMessage>
            <StyledCheckboxGroup>
              <FormCheckbox
                name="acceptPrivacyPolicy"
                label="I agree to Bloom's"
              />
              <StyledCheckboxLink
                href="https://www.bloomup.co/privacy-policy"
                target="_blank"
              >
                Privacy Policy
              </StyledCheckboxLink>
            </StyledCheckboxGroup>
            <StyledButton
              primary
              type="submit"
              disabled={!get(values, 'acceptPrivacyPolicy')}
            >
              Try it now!
            </StyledButton>
          </StyledContainer>
        </StyledForm>
      )}
    />
  )
}

TryPage.propTypes = {
  errorMessage: PropTypes.string,
  onSubmitCreateDemoUser: PropTypes.func.isRequired,
}

export default TryPage
