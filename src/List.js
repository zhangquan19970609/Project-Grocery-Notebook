import React from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'

const List = ({list, deleteOne, editItem}) => {

  return <div className='grocery-list'>
    {list.map((item, index) => {
      const {id, title} = item;
      return <article key={id} className='grocery-item'>
        <p className='title'>{title}</p>
        <div className='btn-container'>
          <button type='button' className='edit-btn' onClick={() => editItem(id)}>
            <FaEdit />
          </button>
          <button type='button' className='delete-btn'  onClick={() => deleteOne(id)}>
            <FaTrash />
          </button>
        </div>
      </article>
    })}
  </div>
}

export default List
