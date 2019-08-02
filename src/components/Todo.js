import React, {
  Fragment,
  useEffect,
  useReducer,
  useRef,
  useMemo,
  useState
} from 'react';
import axios from 'axios';
import List from './List';

const Todo = () => {
  const todoInputRef = useRef();

  const [isValidInput, setInput] = useState(false);

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case 'ADD':
        return state.concat(action.payload);
      case 'SET':
        return action.payload;
      case 'REMOVE':
        return state.filter(todo => todo.id !== action.payload);
      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    try {
      fetchData();
      async function fetchData() {
        const response = await axios.get(
          'https://todo-807da.firebaseio.com/todos.json'
        );
        const todoData = response.data;
        const todos = [];
        for (const key in todoData) {
          todos.push({ id: key, name: todoData[key].name });
        }
        dispatch({ type: 'SET', payload: todos });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const todoAddHandler = async () => {
    const todoName = todoInputRef.current.value;
    try {
      const result = await axios.post(
        'https://todo-807da.firebaseio.com/todos.json',
        { name: todoName }
      );
      const todoItem = { id: result.data.name, name: todoName };
      dispatch({ type: 'ADD', payload: todoItem });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async id => {
    dispatch({ type: 'REMOVE', payload: id });
    try {
      await axios.delete(`https://todo-807da.firebaseio.com/todos/${id}.json`);
    } catch (error) {
      console.log(error);
    }
  };

  const checkValidInput = event => {
    if (event.target.value.trim() === '') {
      setInput(false);
    } else {
      setInput(true);
    }
  };

  return (
    <Fragment>
      <input
        type='text'
        placeholder='Todo'
        ref={todoInputRef}
        onChange={checkValidInput}
        style={{ backgroundColor: isValidInput ? 'transparent' : 'red' }}
      />
      <button onClick={todoAddHandler}>Add</button>
      {useMemo(
        () => (
          <List items={todoList} deleteItem={deleteTodo} />
        ),
        [todoList]
      )}
    </Fragment>
  );
};

export default Todo;
