//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/4/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'
import PropTypes from 'prop-types'
import Chip from 'components/common/display/Chip'
import { v4 as uuid } from 'uuid'

// TODO: a wrapper to control the selections in this file, preferably with withStateHandlers or
// withState. Make component work with react-final-form. Update styling.
const TagSelect = props => (
  <div className={props.className}>
    {props.tags.map(tag => (
      <Chip
        key={uuid()}
        active={(props.selections.indexOf(tag) >= 0)}
        onClick={props.onTagClick}
      >{tag}
      </Chip>
    ))}
  </div>
)

TagSelect.propTypes = {
  className: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selections: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTagClick: PropTypes.func.isRequired,
}

export default TagSelect
