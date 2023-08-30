import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import "./AddTaskForm.css";

function AddTaskForm(props) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (value.trim()) {
      props.onAddTask(value);
      setValue("");
    }

    inputRef.current.focus();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-input">Tarefa:</label>
      <input
        ref={inputRef}
        type="text"
        id="task-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className="add-task-form-button">
        <FaPlus />
      </button>
    </form>
  );
}

export default AddTaskForm;
