import React, { useEffect } from 'react'

const Alert = ({alert,removeAlert, list}) => {

  useEffect(() => {
    const timeOut = setTimeout(() => {
      removeAlert(); // 等于调用一个默认的 showAlert，show 为 false.
    },3000);
    return () => {
      clearTimeout(timeOut);
    }
  },[alert,list]); // 在 dependency list 中加入 alert 或 list，可以令每次更新后，都产生一次 alert + 等待三秒。

  const {msg, type} = alert;
  return <p className={`alert alert-${type}`}>{msg}</p>
}

export default Alert
