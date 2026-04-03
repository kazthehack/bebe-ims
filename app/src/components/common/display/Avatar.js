import React from 'react'
import PropTypes from 'prop-types'
import colors from 'styles/colors'

const styles = {
  imgStyle: {
    height: '30px',
    width: '27px',
  },
  divStyle: {
    backgroundColor: colors.blue,
    color: colors.white,
    height: '30px',
    width: '27px',
    fontFamily: 'Roboto,sans-serif',
    fontSize: '13px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    lineHeight: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    userSelect: 'none',
  },
}

const Avatar = (props) => {
  if (props.src) {
    return (
      <div>
        <img alt="user-avatar" src={props.src} style={styles.imgStyle} />
      </div>
    )
  }
  return (
    <div style={styles.divStyle} >
      <div>
        {props.fullName[0]}
      </div>
    </div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  fullName: PropTypes.string,
}

Avatar.defaultProps = {
  fullName: 'john doe',
}

export default Avatar
