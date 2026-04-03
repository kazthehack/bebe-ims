import React from 'react'
import PropTypes from 'prop-types'

const MobileTearSheet = ({
  height = 500,
  children,
}) => {
  const styles = {
    root: {
      marginBottom: '1.6rem',
      marginRight: '1.6rem',
      maxWidth: 360,
      width: '100%',
    },
    container: {
      border: 'solid 1px #d9d9d9',
      borderBottom: 'none',
      height,
      overflow: 'hidden',
    },
    bottomTear: {
      display: 'block',
      position: 'relative',
      marginTop: -10,
      maxWidth: 360,
    },
  }

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        {children}
      </div>
      <img alt="" style={styles.bottomTear} src="images/bottom-tear.svg" />
    </div>
  )
}

MobileTearSheet.propTypes = {
  children: PropTypes.node,
  height: PropTypes.number,
}

export default MobileTearSheet
