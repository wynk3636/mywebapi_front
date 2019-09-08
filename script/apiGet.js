//put button
function checkboxListener(event){
    const checkbox = event.currentTarget;
    const id = checkbox.dataset.id;

    const body = new FormData();
    body.append('done', checkbox.checked.toString());

    //fetch(`http://localhost:8080/api/put/${id}`,{method:'PUT',body})
    fetch(`https://ogwynk36jsondemo.azurewebsites.net/api/put/${id}`,{method:'PUT',body})
        .then(() => fetchTodoList());
}

//delete button
function deleteButtonListener(event){
    const button = event.currentTarget;
    const id = button.dataset.id;

    console.log(id);

    fetch(`https://ogwynk36jsondemo.azurewebsites.net/api/delete/${id}`,{method:'DELETE'})
    //fetch(`http://localhost:8080/api/delete/${id}`,{method:'DELETE'})
        .then(() => fetchTodoList());
}

//todolist describe
function renderTodoList(todoList){
    const todoContainer = document.querySelector('#todo-container');

    const deleteButtonList = todoContainer.querySelectorAll('.delete-button');
    deleteButtonList.forEach((button) => button.removeEventListener('click', deleteButtonListener))
    const checkButtonList = todoContainer.querySelectorAll('checkbox');
    checkButtonList.forEach((button) => button.removeEventListener('change', putButtonListener));

    todoContainer.innerHTML='';

    for(const item of todoList){
        const li = document.createElement('li');
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.classList.add('checkbox');
        checkbox.type = 'checkbox';
        checkbox.checked = item.done;
        checkbox.dataset.id = item.id;
        checkbox.addEventListener('change',checkboxListener);
        const text = new Text(item.title);
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'delete';
        deleteButton.classList.add('delete-button');
        deleteButton.dataset.id = item.id;
        deleteButton.addEventListener('click',deleteButtonListener);

        label.appendChild(checkbox);
        label.appendChild(text);
        label.appendChild(deleteButton);

        li.appendChild(label);

        todoContainer.appendChild(li);
    }
}

//get todoList from api
async function fetchTodoList(){
    return fetch('https://ogwynk36jsondemo.azurewebsites.net/api/get')
    //return fetch('http://localhost:8080/api/get')
            .then((response) => response.json())
            .then((todoList) => {
                renderTodoList(todoList);
            })
}

//Post new todoItem
async function postNewTodoItem(todoItem){
    const body = new FormData();
    body.append('title', todoItem.title);

    return fetch('https://ogwynk36jsondemo.azurewebsites.net/api/post',{
    //return fetch('http://localhost:8080/api/post',{
        method:'POST',
        body
    }).then((response) => response.json());
}

const newTodoItemTitleInput = document.querySelector('#new-todo-item-title');
const newTodoAddButton = document.querySelector('#new-todo-item-add-button');
//addbutton click
newTodoAddButton.addEventListener('click',(event) => {
    const title = newTodoItemTitleInput.value;

    if(title){
        postNewTodoItem({title})
            .then((item) => fetchTodoList());
    }
})

//initialize data read
fetchTodoList();