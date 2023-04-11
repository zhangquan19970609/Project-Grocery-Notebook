import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list'); // 从 local storage 中找到 list;

  if (list){ // 若 list 存在，从 localS 上 get 到其， 并用 JSON.parse 这个list，形成 JSON array.
    return JSON.parse(localStorage.getItem('list'));
  } else { // 若不存在则返回 empty array 初始状态。
    return [];
  }
}

function App() {

  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage()); // 调用 getLocalStorage, 从 local storage 中提取！

  // 用于 conditional rendering，当进入 Editing Mode 后;
  const [isEditing, setIsEditing] = useState(false);
  
  // 用于 query 目前在 editing 的 item;
  const [editID, setEditID] = useState(null);
  
  // 用于设置 alert 框的不同种类: 
    // 是否 show，
    // show 之后 message 是什么，
    // 以及 type 是 success 还是 danger
  const [alert, setAlert] = useState({show: false, msg:'', type:''})

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      if (!name) { // 当 name 为空时，则 !name 为 true，并执行 empty alert.
        // show empty alert}
        
        // 每次调用 setAlert 都会新建一个 object，较为麻烦，
        // 可以考虑使用 showAlert 代替！(见配置部分尾部)
        showAlert(true, 'Please Enter Value', 'danger');

      } else if (name && isEditing) {
        // edit 某个 element, 并形成新的 list
        showAlert(true, 'Item Edited!', 'success'); // show Alert!
        const newList = list.map((item) => {
          // query 到 Edit Item 之后，更改 title
          if (item.id === editID) {
            return {...item, title: name}
          } 
          // 剩余的 item 则不变
          return item
        })
        setList(newList);
        // 将几个辅助的 state 还原，准备下一次操作。
        setName('');
        setEditID(null);
        setIsEditing(false);
    } else {
      showAlert(true, 'Item added', 'success');
      const newItem = {id: new Date().getTime().toString(), title: name};
      setList((prevList) => {return [...prevList, newItem]}); // 或可简写为： setList([...list, newItem])
      setName('');
    }
    } catch (error) {
      console.log(error);
    }
  }

  // showAlert take 3 个变量! 且 show 的初始值为 false！
    // 即仅调用 showAlert() 而不传入值时，
    // 会将 alert 的 show property，默认 set 为 false。
    // 这个特点可以用来设置 useEffect
  const showAlert = (show=false, msg='', type='') => {
    // 当传入值时，调用 setAlert({ show, type, msg })
    setAlert({ show, type, msg })
    // 将 show 设置为 true 之后，会自动 render <Alert /> component，
    // 并执行 1500 的 timeOut
  }

  const deleteOne = (id) => {
    showAlert(true, 'Item deleted!', 'danger');
    const newList = list.filter((item) => {return item.id !== id});
    setList(newList);
  }

  const clearItems = () => {
    showAlert(true,'Empty List!', 'danger');
    setList([]);
    setName('');
  }

  const editItem = (id) => {
    setIsEditing(true);
    // 用 find method 找到特定的 element，
    const specificeItem = list.find((item) => {return item.id === id});
    // query 到这个 element 后，用 edit state 锁定其，并将其放上输入框。
    setEditID(specificeItem.id);
    setName(specificeItem.title)
  }

  useEffect(() => {
    // 在 chrome 开发人员工具的 application 中 可以看到 local storage
    // 将 list stringnify 之后存入 JSON，再将其 setItem 存入 string: 'list'
    localStorage.setItem('list',JSON.stringify(list));
  },[list]);
    // 不仅如此，还需要每次 refresh 时，自动获取 local storage 中的 list.
    // 在最顶端 import 结束后，设置一个 getLocalStorage

  return <section className='section-center'>
    <form className='grocery-form' onSubmit={handleSubmit}>
      {/* 插入 alert，仅当 property show 为 true 时。  */}
      {/* 使用 ternary operator 代替 if！ */}
      {alert.show && <Alert 
        alert={alert} 
        list={list} 
        removeAlert={showAlert} // 传入 showAlert 的 default 值，用以设置 timeOut!
      />}
      <h3>grocery bud</h3>
      <div className='form-control'>
        <input 
          type='text' 
          className='grocery' 
          placeholder='e.g. eggs'
          value={name}
          onChange={(event) => {setName(event.target.value)}}
        ></input>
        {/* 当 isEdit 激活时，按钮内文改为 edit. */}
        <button type='submit' className='submit-btn'>
          {isEditing ? 'edit' : 'submit'}
        </button>
      </div>
    </form>
    {/* 如何解决没有 list 也显示 clear items 的问题？
    用 Ternary Operator 设置，
    仅当 list 不为空时，才注入 <List />! */}
    {/* 使用 ternary operator 代替 if！ */}
    {list.length > 0 && <div className='grocery-container'>
        <List 
          list={list} 
          deleteOne={deleteOne}
          editItem={editItem}
        />
        <button className='clear-btn' onClick={clearItems}>clear items</button>
      </div>
    }

  </section>
}

export default App

// 独自做遇到的困难：很难从 array 中用 props + delete function 去除一个 元素。