import styled from 'styled-components'
import PropTypes from 'prop-types'
import React from 'react'
import colors from 'styles/colors'

import Icon from 'components/common/display/Icon'

export const checkRequirements = (password1 = '', password2 = '') => [
  { description: 'At least 8 characters in length',
    criteriaMet: password1.length >= 8 },
  { description: 'At least 1 lowercase letter',
    criteriaMet: /[a-z]/.test(password1) },
  { description: 'At least 1  uppercase letter',
    criteriaMet: /[A-Z]/.test(password1) },
  { description: 'At least 1 symbol',
    criteriaMet: !!/[!@#$%^&*]/.test(password1) },
  { description: 'Passwords must match',
    // convert to BOOL to prevent initialization causing a string to occur in the expected bool
    criteriaMet: Boolean(password1 && password2 && password1 === password2) },
]

const RequirementsContainer = styled.div`
`

const RequirementsBox = styled.div.attrs({
  width: 308.8,
})`
  position: absolute;
  background-color: ${colors.grayLight2};
  width: ${({ width }) => width}px;
  border-radius: 2px;
`

const RequirementsInner = styled.div`
  color: #4c4c4c;
  margin: 18px 17px 18px 16px;
  font-size: 16px;
  line-height: 1.81;
`

const RequirementsBoxTriangle = styled.div.attrs({
  width: 12.8,
  height: 15,
})`
  position: absolute;
  transform: translate(-100%, -50%);
  width: 0;
  height: 0;
  margin-left: 1px;
  top: 10%;
  border-right: ${({ width }) => width}px solid ${colors.grayLight2};
  border-top: ${({ height }) => height}px solid transparent;
  border-bottom: ${({ height }) => height}px solid transparent;
`

const Met = ({ className }) => (
  <span
    className={className}
    aria-label="requirement met"
  >
    <Icon name="check" style={{ color: colors.blue, marginRight: 6 }} />
  </span>
)

Met.propTypes = {
  className: PropTypes.object,
}

const NotMet = ({ className }) => (
  <span
    className={className}
    aria-label="requirement not met"
  >
    <Icon name="cross" style={{ color: colors.red, marginRight: 6 }} />
  </span>
)

NotMet.propTypes = {
  className: PropTypes.object,
}

const PasswordRequirementsHeader = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  margin-bottom: 4px;
  font-weight: bold;
  color: ${colors.grayDark2};
`

const RequirementItem = ({ criteriaMet, children }) => (
  <div>
    { criteriaMet ? <Met /> : <NotMet />}
    { children }
  </div>
)
RequirementItem.propTypes = {
  criteriaMet: PropTypes.bool.isRequired,
  children: PropTypes.node,
}

// TODO: Refactor this component to make it more reusable, particularly the styling organization
// Currently the default styles here are used on the login page
// The ChangePasswordModal of the employee page uses some of these props to make the styling work
// Probably a good time to refactor this would be when we get to refactoring the login page as this
// styling will probably not work well for it anymore
const PasswordRequirements = ({ requirements, contentStyle, triangleStyle }, ...props) => (
  <RequirementsContainer {...props} >
    <RequirementsBox style={contentStyle}>
      <RequirementsBoxTriangle style={triangleStyle} />
      <RequirementsInner>
        <PasswordRequirementsHeader>
          PASSWORD REQUIREMENTS
        </PasswordRequirementsHeader>
        { requirements.map(({ criteriaMet, description }) => (
          <RequirementItem
            criteriaMet={criteriaMet}
            key={description}
          >
            {description}
          </RequirementItem>
        ))}
      </RequirementsInner>
    </RequirementsBox>
  </RequirementsContainer>
)

PasswordRequirements.propTypes = {
  requirements: PropTypes.arrayOf(PropTypes.shape({
    criteriaMet: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
  triangleStyle: PropTypes.object,
  contentStyle: PropTypes.object,
}

export default PasswordRequirements
