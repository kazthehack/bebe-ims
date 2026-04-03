import React, { Component, Fragment } from 'react'
import FillBar from 'components/common/display/FillBar'
import colors from 'styles/colors'
import styled from 'styled-components'

const Wrap = styled.div`
  height: 50px;
  width: 500px;
  margin-bottom: 50px;
`

class FillTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      booster: 0,
    }
  }

  EngageBoosters = () => {
    setInterval(() => {
      this.setState({
        booster: this.state.booster + 5,
      })
    }, 15)
  }

  render() {
    return (
      <Fragment>
        <button onClick={this.EngageBoosters}>E N G A G E</button>
        <Wrap><FillBar /></Wrap>
        <Wrap><FillBar percent={10} /></Wrap>
        <Wrap><FillBar amount={125.92 + this.state.booster} total={420.4200000} units="g" strokeWidth={6} strokeColor={colors.blue} /></Wrap>
        <Wrap><FillBar amount={9 + this.state.booster} total={10} units="ea" strokeWidth={8} strokeColor="cyan" /></Wrap>
        <Wrap><FillBar amount={1 + this.state.booster} total={0} units="ea" strokeWidth={8} strokeColor="cyan" /></Wrap>
        <Wrap><FillBar amount={125.92 + this.state.booster} total={420.4200000} units="g" strokeWidth={10} strokeColor="gray" /></Wrap>
        <Wrap><FillBar amount={1000000 + this.state.booster} total={9000} units="POWERLEVEL" trailWidth={12} strokeWidth={12} strokeColor="purple" /></Wrap>
      </Fragment>
    )
  }
}

export default FillTest
