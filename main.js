
    let todos = [];
    let currently_editing;

    retrive_from_session();

    const submit_btn = document.getElementById("submit-btn");

    submit_btn.addEventListener("click", get_todo_from_input);

    function set_listeners() {
      const delete_btn = document.querySelectorAll(".btn--delete-todo");
      const edit_btn = document.querySelectorAll(".btn--edit-todo");
      delete_btn.forEach((btn) => {
        btn.addEventListener("click", initiate_delete, false);
      });
      edit_btn.forEach((btn) => {
        btn.addEventListener("click", initiate_edit, false);
      });
    }

    function listen_for_edit() {
      let edit_btn = document.getElementById("edit-btn");
      edit_btn.addEventListener("click", saveedit);
    }

    function save_to_session() {
      let coverted_todo = JSON.stringify(todos);
      return sessionStorage.setItem("todo", coverted_todo);
    }

    function retrive_from_session() {
      todos = JSON.parse(sessionStorage.getItem("todo")) || [];
      return parse_todos();
    }

    function add_todo_to_array(todo_name) {
      let new_todo = {
        name: todo_name,
      };
      todos.push(new_todo);
      save_to_session();
      return parse_todos();
    }

    function check_todo_value(todo) {
      if (todo.length > 0) {
        clear_input();
        return add_todo_to_array(todo);
      }
      return false;
    }

    function get_todo_from_input() {
      let todo = document.getElementById("todo").value;
      return check_todo_value(todo);
    }

    function clear_input() {
      document.getElementById("todo").value = "";
    }

    function parse_todos() {
      let list_parent = document.getElementById("todo-list");
      list_parent.innerHTML = "";
      todos.forEach((todo, index) => {
        create_HTML(todo.name, index);
        return set_listeners();
      });
    }

    function create_HTML(todo_name, index) {
      let new_list_elem = document.createElement("li");
      let parent_todo_elem = document.createElement("div");
      parent_todo_elem.className = "my-todos__item";
      new_list_elem.appendChild(parent_todo_elem);

      let todo_elem_name = document.createElement("h4");
      todo_elem_name.className = "my-todos__item-name";
      todo_elem_name.textContent = todo_name;
      parent_todo_elem.appendChild(todo_elem_name);

      let action_btn_parent = document.createElement("div");
      action_btn_parent.className = "my-todos__item-actions";

      let edit_btn = document.createElement("button");
      edit_btn.textContent = "Edit";
      edit_btn.classList.add("btn", "btn--edit-todo");
      edit_btn.setAttribute("data-index", index);
      action_btn_parent.appendChild(edit_btn);

      let delete_btn = document.createElement("button");
      delete_btn.textContent = "Delete";
      delete_btn.classList.add("btn", "btn--delete-todo");
      delete_btn.setAttribute("data-index", index);
      action_btn_parent.appendChild(delete_btn);

      parent_todo_elem.appendChild(action_btn_parent);

      let list_parent = document.getElementById("todo-list");

      return list_parent.appendChild(new_list_elem);
    }

    function initiate_edit(ev) {
      console.log(currently_editing);
      if (currently_editing) {
        document.getElementById("edit-todo-form").remove();
        currently_editing = undefined;
      }
      let index = ev.target.getAttribute("data-index");
      let todo = todos[parseInt(index)];
      let edit_form = create_edit_input(todo.name);
      currently_editing = parseInt(index);
      ev.target.parentElement.appendChild(edit_form);
      return listen_for_edit();
    }

    function create_edit_input(input_value) {
      let edit_form_container = document.createElement("div");
      edit_form_container.id = "edit-todo-form";
      let edit_input = document.createElement("input");
      edit_input.className = "todo-input";
      edit_input.id = "edit_input";
      edit_input.value = input_value;
      edit_form_container.appendChild(edit_input);

      let edit_btn = document.createElement("button");
      edit_btn.classList.add("btn", "btn--add-todo");
      edit_btn.id = "edit-btn";
      edit_btn.textContent = "Save";
      edit_form_container.appendChild(edit_btn);

      return edit_form_container;
    }
    function saveedit() {
      let new_value = document.querySelector("#edit_input").value;

      todos[currently_editing].name = new_value;
      save_to_session();
      currently_editing = undefined;
      return parse_todos();
    }
    function delete_todo(index) {
      todos.splice(index, 1);
      save_to_session();
      return parse_todos();
    }

    function initiate_delete(ev) {
      let e = ev.target;
      let index = e.getAttribute("data-index");
      return delete_todo(parseInt(index));
    }
