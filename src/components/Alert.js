import React from 'react'

const Alert = (props) => {
  return (
    <>
      {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} style={{ position: "absolute", width: "100%" }} role="alert">
        <strong>{props.alert.msg}</strong> 
      </div>}
    </>
  )
}

export default Alert