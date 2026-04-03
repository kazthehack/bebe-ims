//  Copyright (c) 2018 First Foundry Inc. All rights reserved.


import React from 'react'
import PropTypes from 'prop-types'
import Subheader from 'components/common/display/Subheader'
import Toggle from 'components/common/input/Toggle'
import TextField from 'components/common/input/TextField'
import Button from 'components/common/input/Button'
import styled from 'styled-components'
import 'react-tippy/dist/tippy.css'
import { TooltipWithIcon } from 'components/common/display/Tooltip'

const StyledButton = styled(Button)`
`

const SpacerSpan = styled.span`
  margin: 5px;
`

// Test button function
const exampleClicked = () => {
}

const Example = props => (
  <SpacerSpan style={{ display: 'inherit' }}>{props.children}</SpacerSpan>
)

Example.propTypes = {
  children: PropTypes.node.isRequired,
}

const shortText = `
  Mattis enim ut.
`

const mediumText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
`
const longText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
  incididunt ut labore et dolore magna aliqua. Elit duis tristique sollicitudin nibh sit. Maecenas 
  sed enim ut sem viverra aliquet eget. Sit amet mauris commodo quis imperdiet massa tincidunt nunc 
  pulvinar. Dui id ornare arcu odio ut.
`

const ToolTipExamples = () => (
  <div style={{ width: '100%' }}>
    <Subheader textSizeOption={2}>Tooltips</Subheader>
    <a href="https://tvkhoa.github.io/testlib/">More Demos Here</a>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', margin: '20px 150px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
        <Subheader textSizeOption={2}>Very Short Text</Subheader>
        <Example>
          <SpacerSpan>hover - top</SpacerSpan>
          <TooltipWithIcon
            text={shortText}
            iconColor="purple"
          />
        </Example>
        <Example>
          <SpacerSpan link>hover - bottom</SpacerSpan>
          <TooltipWithIcon
            // options
            text={shortText}
            position="bottom"
            iconColor="purple"
          />
        </Example>
        <Example>
          <TooltipWithIcon
            // options
            text={shortText}
            position="left"
            iconColor="purple"
          />
          <SpacerSpan link>hover - left</SpacerSpan>
        </Example>
        <Example>
          <SpacerSpan link>hover - right</SpacerSpan>
          <TooltipWithIcon
            // options
            text={shortText}
            position="right"
            iconColor="purple"
          />
        </Example>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
        <Subheader textSizeOption={2}>Medium Text</Subheader>
        <Example>
          <SpacerSpan link>hover - top</SpacerSpan>
          <TooltipWithIcon
            // options
            text={mediumText}
            iconColor="purple"
          />
        </Example>
        <Example>
          <SpacerSpan link>hover - bottom</SpacerSpan>
          <TooltipWithIcon
            // options
            text={mediumText}
            position="bottom"
            iconColor="purple"
          />
        </Example>
        <Example>
          <TooltipWithIcon
            // options
            text={mediumText}
            position="left"
            iconColor="purple"
          />
          <SpacerSpan link>hover - left</SpacerSpan>
        </Example>
        <Example>
          <SpacerSpan link>hover - right</SpacerSpan>
          <TooltipWithIcon
            // options
            text={mediumText}
            iconColor="purple"
            position="right"
          />
        </Example>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
        <Subheader textSizeOption={2}>Long Text</Subheader>
        <Example>
          <SpacerSpan link>hover - top</SpacerSpan>
          <TooltipWithIcon
            // options
            text={longText}
            iconColor="purple"
          />
        </Example>
        <Example>
          <SpacerSpan link>hover - bottom</SpacerSpan>
          <TooltipWithIcon
            // options
            text={longText}
            iconColor="purple"
            position="bottom"
          />
        </Example>
        <Example>
          <TooltipWithIcon
            // options
            text={longText}
            iconColor="purple"
            position="left"
          />
          <SpacerSpan link>hover - left</SpacerSpan>
        </Example>
        <Example>
          <SpacerSpan link>hover - right</SpacerSpan>
          <TooltipWithIcon
            // options
            text={longText}
            iconColor="purple"
            position="right"
            size="small"
          />
        </Example>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Subheader textSizeOption={2}>Other Elements</Subheader>
        <Example>
          <StyledButton primary onClick={exampleClicked}>Top - Hover</StyledButton>
          <SpacerSpan />
          <TooltipWithIcon
            // options
            text="Welcome to React"
            iconColor="purple"
          />
        </Example>
        <Example>
          <Toggle label="green" greenBackground />
          <SpacerSpan />
          <TooltipWithIcon
            // options
            text="Welcome to React"
            iconColor="purple"
          />
        </Example>
        <Example>
          <TextField prefix="oz" placeholder="left - hover - follow" />
          <SpacerSpan />
          <TooltipWithIcon
            // options
            text="Welcome to React"
            iconColor="purple"
            followCursor
          />
        </Example>
        <Example>
          <Button link>right - click - interactive</Button>
          <SpacerSpan />
          <TooltipWithIcon
            // options
            text="Welcome to React"
            iconColor="purple"
            position="right"
            interactive
          />
        </Example>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', margin: '20px 150px' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Subheader textSizeOption={2}>Pros</Subheader>
        <Example>
          <ul>
            <li>Does not require a specific component library</li>
            <li>Good positioning system</li>
            <li>Easy to use, just wrap element or use the HOC</li>
            <li>Defaults are clean and pretty</li>
            <li>Can completely change HTML of tooltip if you want</li>
            <li>Lots of features
              <ul>
                <li>Auto Flip position when there is no room (Optional)</li>
                <li>Fades, Delays, Other animations</li>
                <li>Sizes, Light/Dark Themes</li>
                <li>Follow Cursor feature, callbacks, triggers</li>
              </ul>
            </li>
          </ul>
        </Example>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Subheader textSizeOption={2}>Cons</Subheader>
        <Example>
          <ul>
            <li>none yet...</li>
          </ul>
        </Example>
      </div>
    </div>
  </div>
)

const ToolTipsReferencePage = () => (
  <div>
    <ToolTipExamples />
  </div>
)

export default ToolTipsReferencePage
