import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import { FormToggle } from 'components/common/input/Toggle'
import { Form } from 'react-final-form'
import Title from 'components/common/display/Title'
import Spinner from 'components/common/display/Spinner'
import Button from 'components/common/input/Button'
import { FormTextField } from 'components/common/input/TextField'
import colors from 'styles/colors'

const StyledTitle = styled(Title)`
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: 24px 0 16px 0;
`

const Panel = styled.div`
  background-color: white;
  height: 328px;
  flex-grow: 100;
  position: relative;
`

const StyledTextField = styled(FormTextField)`
  margin-right: 76px;
  float: right;
  max-width: 100%;
`

const ButtonDiv = styled.div`
  text-align: center;
  margin: 32px 0 24px 0;
  width: 100%;
  position: absolute;
  bottom: 0;
`

const FieldDiv = styled.div`
  margin-top: 32px;
  height: 40px;
  display: flex;
`

const Label = styled.div`
  display: inline;
  font-size: 16px;
  color: #5e5e5e;
  margin: 0 76px 0 76px;
  line-height: 40px;
  width: 136px;
`

// TODO: possibly make a Menu common component
const Menu = styled.div`
  width: 304px;
  display: block;
  margin-right: 64px;
  float: left;
`

const MenuItem = styled.div`
  width: 302px;
  background-color: ${props => (props.selected ? colors.blue : colors.grayLight2)};
  color: ${props => (props.selected ? colors.white : colors.black)};
  border-radius: 2px;
  margin-bottom: 1px;
  height: 48px;
  border: solid 1px ${props => (props.selected ? colors.blue : colors.grayLight2)};
  text-align: center;
  line-height: 50px;
  font-family: Roboto, sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px 0 ${colors.trans.black10}, 0 2px 4px 0 ${colors.trans.black20};
`

class AppPanel extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      editing: false,
      selected: 'metrc',
    }

    this.edit = this.edit.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  menuChange = e => this.setState({ selected: e.target.getAttribute('value') })

  edit() {
    this.setState({ editing: true })
  }

  cancel() {
    this.setState({ editing: false })
  }

  render() {
    const { data, onSubmit } = this.props

    const initialValuesMap = { // TODO: remove this dummy data.
      userKey: 'mPvn7Di5mhA6o42MluOIXkXX8ovUYprQ3rZGai7c0gzEsKSQjbtvpcXiior7ojr0',
      licenseNumber: 'u0jjRIAhPIur',
      metrc: data.node.integrations.metrc || false,
    }

    const FormRender = ({ handleSubmit, form, pristine, submitting }) => (
      <div key={2} style={{ width: '100%', display: 'flex' }}>
        {submitting && <Spinner wrapStyle={{ paddingTop: '48px', position: 'absolute' }} />}
        <Panel>
          <form>
            {/*
              <FormToggle
                name="metrc"
                disabled={!this.state.editing || submitting}
                labelStyle={{
                  margin: '27px 0 0 32px',
                  display: 'inline-block',
                  position: 'absolute'
                }}
              />
            // TODO metrc not toggled, but will need this for other connected apps in the future
            */}
            <StyledTitle>Metrc</StyledTitle>
            <FieldDiv>
              <Label>API key</Label>
              <StyledTextField
                name="userKey"
                type="text"
                disabled={!this.state.editing || submitting}
              />
            </FieldDiv>
            <FieldDiv>
              <Label>License</Label>
              <StyledTextField
                name="licenseNumber"
                type="text"
                disabled={!this.state.editing || submitting}
              />
            </FieldDiv>
            <ButtonDiv>
              { this.state.editing ?
                <div>
                  <Button
                    style={{ marginLeft: '48px', float: 'left' }}
                    disabled={submitting}
                    onClick={() => {
                      form.reset()
                      this.cancel()
                    }}
                  >Cancel
                  </Button>
                  <Button
                    primary
                    style={{ marginRight: '48px', float: 'right' }}
                    disabled={pristine || submitting}
                    type="submit"
                    onClick={() => {
                      handleSubmit() // handleSubmit is called here instead of by the <form>
                      this.cancel() // so that we can also call cancel
                    }}
                  >Save
                  </Button>
                </div>
                :
                <Button primary disabled={submitting} onClick={this.edit}>
                  Edit
                </Button>
              }
            </ButtonDiv>
          </form>
        </Panel>
      </div>
    )

    return (
      <div style={{ width: '100%', display: 'flex', position: 'absolute' }}>
        <Menu>
          <MenuItem value="metrc" onClick={this.menuChange} selected={this.state.selected === 'metrc'}>
            METRC
          </MenuItem>
        </Menu>
        <Form
          onSubmit={onSubmit}
          initialValues={initialValuesMap}
          render={FormRender}
        />
      </div>
    )
  }
}

AppPanel.propTypes = {
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default AppPanel
