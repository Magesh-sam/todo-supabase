import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import '/styles.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)
export const App = () => {
  const [todoList, setTodoList] = useState([])
  const [taskName, settaskName] = useState('')
  const getTodos = async () => {
    const { data, error } = await supabase.from("todos").select('*').order('id', {ascending: true})
    if (!error) {
      setTodoList(data)
    }
  }
  
  useEffect(() => {
    
    getTodos();
  },[])

  const handleStatus = async (todo) => {
    const {id, iscompleted} = todo;

    const todoStatus = !iscompleted;
  

    try {
      const data = await supabase.from("todos").update({ iscompleted: todoStatus }).eq("id", id);
      if (data.error) {
        throw data.error;
      }
    } catch (error) {
      alert(error.message);
    }
    getTodos();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("todos").insert({todo: taskName, iscompleted: false});
      if (!error) {
        setTodoList(data);
        settaskName('');
      }
    } catch (error) {
      alert(error.message);
    }
    getTodos();
  }


  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (!error) {
        getTodos();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main>
      <h1 style={{ textDecoration: 'underline', textAlign:'center' }} >Todo List</h1>
      <form onSubmit={(e) => handleSubmit(e)} >
        <input required  value={taskName} type="text" name="todo" placeholder="Add Todo" id="todo" onChange={(e) => settaskName(e.target.value)} />
        <button className="submitBtn" type="submit" >Add task</button>
      </form>
      {todoList?.map((todo) => (
        <ul key={todo.id}><li className={todo.iscompleted ? "completed" : ""}><h2>{todo.todo}</h2></li>
          <div style={{display:'flex',gap:'10px'}}><input type="checkbox" name="todostatus" id="todostatus" className={todo.iscompleted ? "completed" : ""} checked={todo.iscompleted} onChange={() => handleStatus(todo)} />
          <button onClick={() => handleDelete(todo.id)} >delete</button>
          </div>
        </ul>
      ))}
    </main>
    
  )
}
