//VIEW 
//Thin layer above DOM for DOM manipulation and Event handling
(function(global){
'use strict';

//PUBLIC
var view = {};
global.$view = view;

//PRIVATE
var todoList = document.getElementById("todoList");
var todoInput = document.querySelector('input[name=todo]');
var todoFilters = document.getElementsByClassName("todo-filters");
var itemCount = document.getElementById("itemCount");
var todoClear = document.getElementById("clearCompleted");
var editbox = document.createElement("input");
var toggleAll = document.getElementById("toggleAll");
var todoButtonArea = document.getElementById("todoButtonArea");

//IMPLEMENTATION
view.updateItemCount = function(length){
	if (length === 1){itemCount.firstChild.nodeValue = `${length} item left`;}
	else{itemCount.firstChild.nodeValue = `${length} items left`;}
}

view.showHideControls = function(value){
	if (value === false){
		toggleAll.style.display = "none";
		todoButtonArea.style.display = "none";
	}
	else{
		toggleAll.style.display = "block";
		todoButtonArea.style.display = "block";
	}	
}

view.showHideClear = function(value){
	if (value === false){todoClear.style.display = "none";}
	if (value === true){todoClear.style.display = "block";}
}

//addItem to DOM
view.addItem = function(data, itemClass){
	var newLi = document.createElement("LI");

	newLi.innerText = data;
	newLi.className = itemClass;
	todoList.appendChild(newLi);
}

//replace and item in the DOM
view.replaceItem = function(data, index, itemClass){
	var replaceLi;

	replaceLi = document.createElement("LI");
	replaceLi.innerText = data;
	replaceLi.className = itemClass;
	todoList.replaceChild(replaceLi, todoList.childNodes[index]);
}

//deleted selected node from DOM
view.deleteItem = function(index){
	todoList.removeChild(todoList.childNodes[index]);
}

//toggle completed class of Item
view.toggleCompleted = function(index, value){
	value = (value === false)?"still-todo":"completed-todo";
	todoList.childNodes[index].className = value;
}

//toggle the classlists to all completed or active
view.toggleAll = function(value){
	if (value === false){
		for(let i=0;i<todoList.childNodes.length;i++){
			if (todoList.childNodes[i].classList.contains("completed-todo")){
				todoList.childNodes[i].classList.remove("completed-todo")
				todoList.childNodes[i].classList.add("still-todo")
			}
		}
	}else{
		for(let i = 0;i<todoList.childNodes.length;i++){
			if (todoList.childNodes[i].classList.contains("still-todo")){
				todoList.childNodes[i].classList.remove("still-todo")
				todoList.childNodes[i].classList.add("completed-todo")
			}
		}
	}
}

//set the view filter state
view.setFilter = function(completed){
	var className;

	className = (completed === false)?"still-todo":"completed-todo";
	for (let i = 0;i <todoList.childNodes.length;i++){
		if (todoList.childNodes[i].classList.contains(className) || completed === "all"){
			if (todoList.childNodes[i].classList.contains("hide-todo")){
				todoList.childNodes[i].classList.remove("hide-todo");
			};	
		}else{todoList.childNodes[i].classList.add("hide-todo");}
	}
}

//change the active class of the filters so the current one is active
view.changeFilterActive = function(index){
	for(let i = 0;i<todoFilters.length;i++){
		if (todoFilters[i].classList.contains("filter-active")){
			todoFilters[i].classList.remove("filter-active");
		}
	}
	todoFilters[index].classList.add("filter-active");
}

//substitue list item data for an editbox so value can be changed
view.addEditBox = function(index, value){
	var fragment,newLi;
	
	fragment = document.createDocumentFragment();
	newLi = document.createElement("LI")
	editbox.type = "text";
	editbox.value = value;
	editbox.placeholder = "enter todo title";
	newLi.className = "edit-item";
	newLi.appendChild(editbox);
	fragment.appendChild(newLi);
	todoList.replaceChild(fragment, todoList.childNodes[index]);
	todoList.childNodes[index].firstChild.focus();
}

//refresh the entrie list
view.refresh = function(data){
	var fragment, newLi;
	
	fragment = document.createDocumentFragment();
	while (todoList.firstChild){todoList.removeChild(todoList.firstChild);}
	for (let i = 0; i<data.length;i++){
		newLi = document.createElement("LI")
		newLi.innerText = data[i].title;
		newLi.className = (data[i].completed === false)?"still-todo":"completed-todo"; 
		fragment.appendChild(newLi);
	}
	todoList.appendChild(fragment);
}

//register event from User and dispatch to controller
view.event = function(method, value){
	if (method === "liclick"){
		if (value.target.offsetWidth-value.offsetX < 50){method = "deleteItem";value = Array.from(todoList.children).indexOf(value.target);}
		else if (value.offsetX < 50){method = "toggleCompleted";value = Array.from(todoList.children).indexOf(value.target);}
		else {method = "none";value = -1;};
	}	
	if (method === "editItem"){
		if (value.target.offsetWidth-value.offsetX > 70 && value.offsetX > 70){value.preventDefault(); method = "editItem";value = Array.from(todoList.children).indexOf(value.target);}
		else {method = "none";value = -1;};
	}	
	$controllerCallback(method, value);
}

//event listeners for DOM
todoList.addEventListener("click", (event) => view.event("liclick", event));
todoList.addEventListener("dblclick", (event) => view.event("editItem", event));
editbox.addEventListener("keydown", function(event){
	if(event.key === "Enter"){view.event("edited", editbox.value);}
});
todoInput.addEventListener("keydown", function(event){
	if (event.key === "Enter") {
		let value = todoInput.value;
		todoInput.value = "";
		event.preventDefault();
		view.event("addItem", value);
	}
});
todoFilters[0].addEventListener("click", () => view.event("filter", "all"));
todoFilters[1].addEventListener("click", () => view.event("filter", "active"));
todoFilters[2].addEventListener("click", () => view.event("filter", "completed"));
todoClear.addEventListener("click", () => view.event("clearCompleted"));
toggleAll.addEventListener("click", () => view.event("toggleAll"));
editbox.addEventListener("blur", () => view.event("cancelEdit"));
//for removing blue highlight on dblclick
document.addEventListener('mousedown', function (event) {if (event.detail > 1) {event.preventDefault();}}, false);

})(window);