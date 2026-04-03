import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { noop } from 'lodash'

import { Table } from 'components/Table'
import SingleItemGrid from 'components/common/container/grid/SingleItemGrid'
import Title from 'components/common/display/Title'
import DASpinner, { BasicSpinner } from 'components/common/display/Spinner'
import Button from 'components/common/input/Button'
import { FormTextField } from 'components/common/input/TextField'
import SettingsNavigation from 'components/pages/settings/SettingsNavigation'
import { Grid, Row } from 'react-styled-flexboxgrid'
import { Form } from 'react-final-form'

const TwoLine = ({ top, bottom }) => (
  <div>
    <div>{top}</div>
    <div>{bottom}</div>
  </div>
)

TwoLine.propTypes = {
  top: PropTypes.string,
  bottom: PropTypes.string,
}

const columns = [{
  Header: 'Status',
  accessor: 'node.active',
  Cell: ({ value }) => <div>{value}</div>, // eslint-disable-line react/prop-types
}, {
  Header: <TwoLine top="Full" bottom="Name" />,
  accessor: 'node.name',
  Cell: ({ value }) => <div>{value}</div>, // eslint-disable-line react/prop-types
}, {
  Header: 'Nickname',
  accessor: 'node.shortName',
}, {
  Header: 'Role',
  accessor: 'node.roles',
  // TODO update this when roles is changed
  Cell: ({ value }) => value[0].name,
}]

const Container = styled.div`
  border-style: solid;
  border-width: 1px;
  border-color: gray;
  height: 300px;
  position: relative;
`
const StyledTextField = styled(FormTextField)`
  margin-right: 76px;
  float: right;
  width: 50%;
`

const ButtonDiv = styled.div`
  text-align: center;
  margin: 32px 0 24px 0;
`

const FieldDiv = styled.div`
  margin-top: 32px;
  height: 40px;
`

const Label = styled.div`
  display: inline;
  font-size: 16px;
  color: #5e5e5e;
  margin: 0 76px 0 76px;
  line-height: 40px;
`

class LoadingTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      interval: 3,
      size: 6,
      sizeIndex: 0,
      sizes: [6, 12, 18, 24],
      loading: true,
    }
  }

  toggleInterval = () => {
    this.setState({
      interval: this.state.interval === 3 ? 0.3 : 3,
    })
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    })
  }

  toggleSize = () => {
    if (this.state.sizeIndex + 1 >= this.state.sizes.length) {
      this.setState({
        size: this.state.sizes[0],
        sizeIndex: 0,
      })
    } else {
      this.setState({
        size: this.state.sizes[this.state.sizeIndex + 1],
        sizeIndex: this.state.sizeIndex + 1,
      })
    }
  }

  render() {
    const { loading } = this.state
    return (
      <Fragment>
        <button onClick={this.toggleInterval}>Speed</button>
        <button onClick={this.toggleSize}>Size</button>
        <button onClick={this.toggleLoading}>Loading</button>
        <br />
        basic spinner
        <Container>
          { loading &&
            <BasicSpinner
              size={this.state.size * 15}
              interval={this.state.interval}
            />
          }
        </Container>
        DA spinner
        <Container>
          { loading &&
            <DASpinner
              size={this.state.size}
              interval={this.state.interval}
            />
          }
        </Container>
        Table
        <Container>
          <SingleItemGrid>
            <Table
              columns={columns}
              data={[]}
              loadingText={(
                <DASpinner
                  size={this.state.size}
                  interval={this.state.interval}
                  wrapStyle={{ paddingTop: '48px' }}
                />
              )}
              loading={loading}
            />
          </SingleItemGrid>
        </Container>
        Populating Form
        <Container>
          <div>
            <Title>Connected Apps</Title>
            <SettingsNavigation />
            <Grid fluid style={{ padding: 0, margin: 0 }}>
              <Row style={{ margin: '48px 0 0 0' }}>
                <DASpinner
                  size={6}
                  interval={2}
                  wrapStyle={{
                    paddingTop: '48px',
                  }}
                />
              </Row>
            </Grid>
            <div style={{ clear: 'both' }} />
          </div>
        </Container>
        Submitting Form
        <Container>
          <Form
            onSubmit={noop}
            initialValues={[]}
            render={() => (
              <Fragment>
                { /* position: 'absolute is useful here' */ }
                { /* normally do {submitting && <Spinner ... />} */ }
                <DASpinner size={6} interal={2} wrapStyle={{ paddingTop: '48px' }} />
                <FieldDiv>
                  <Label>DAT1</Label>
                  <StyledTextField name="DAT1" type="text" disabled />
                </FieldDiv>
                <FieldDiv>
                  <Label>DAT2</Label>
                  <StyledTextField name="DAT2" type="text" disabled />
                </FieldDiv>
                <ButtonDiv>
                  <Button
                    style={{ marginLeft: '48px', float: 'left' }}
                    onClick={noop}
                  >Cancel
                  </Button>
                  <Button
                    primary
                    style={{ marginRight: '48px', float: 'right' }}
                    disabled
                    onClick={noop}
                    type="submit"
                  >Save
                  </Button>
                </ButtonDiv>
              </Fragment>
            )}
          />
        </Container>
      </Fragment>
    )
  }
}

export default LoadingTest
