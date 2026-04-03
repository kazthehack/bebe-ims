import React from 'react'
import colors from 'styles/colors'
import PropTypes from 'prop-types'

// TODO more styling - during priceGroup refactoring BLOOM-660

const styles = {
  button: {
    width: '200px',
    height: '50px',
    backgroundColor: colors.white,
    display: 'inline-block',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    color: colors.grayDark2,
    fontWeight: 'bold',
    border: `solid 3px ${colors.trans.black05}`,
    borderBottom: 0,
    marginRight: '10px',
  },
  inactiveButton: {
    backgroundColor: colors.trans.black05,
  },
  buttonContainer: {
    backgroundColor: colors.trans.black05,
  },
  label: {
    lineHeight: '50px',
    marginBottom: '25px',
  },
  tabs: {
    backgroundColor: colors.white,
  },
}

export const Tab = ({ value, active, children, className }) => (
  (value === active) ? (<div className={className}>{children}</div>) : (null)
)

Tab.propTypes = {
  value: PropTypes.number.isRequired,
  active: PropTypes.number.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
}

Tab.defaultProps = {
  children: {},
}


export const Tabs = ({ labels, active, onChange, className, children }) => {
  const buttonContainer = (
    <div style={styles.buttonContainer}>
      {labels.map((label, index) => (
        <div
          key={label}
          onClick={() => { onChange(index) }}
          style={active === index ? styles.button : { ...styles.button, ...styles.inactiveButton }}
        >
          <span style={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div style={styles.tabs} className={className}>
      {buttonContainer}
      {children}
    </div>
  )
}

Tabs.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  active: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
}

Tabs.defaultProps = {
  children: {},
}
