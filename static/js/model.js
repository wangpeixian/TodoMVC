//MODEL
(function(global){
'use strict';
	
//PUBLIC
var model = {};
global.$model = model;

//PRIVATE
var todoData = [];
var filter = "all";

//IMPLEMENTATION
model.setFilter = function(value){
	filter = value;
	model.saveFilter();
}

model.getFilter = function(){
	return filter;
}

model.getNum = function(completed){
	var count = 0;
	if (completed !== undefined){
		todoData.forEach(function(v){if (v.completed === completed){count++}})
		return count;
	}else{
		return todoData.length;
	}	
}

model.setTitle = function(index, parameter){
	todoData[index].title = parameter;
	model.save();
}

model.getTitle = function(index){
	return todoData[index].title;
}

model.addItem = function(value){
	todoData.push({title:value, completed:false});
	model.save();
}

model.deleteItem = function(index){
	todoData.splice(index, 1);
	model.save();
}

model.getCompletedStatus = function(index){
	return todoData[index].completed;
}

model.toggleCompletedStatus = function(index){
	todoData[index].completed = !todoData[index].completed;
	model.save();
}

model.toggleAll = function(){
	var completedCount = 0;
	todoData.forEach(function(v){if (v.completed === true){completedCount++}});
	if (completedCount >= todoData.length/2){
		todoData.forEach(function(v){v.completed = false});
		model.save(); 
		return false;
	}else{
		todoData.forEach(function(v){v.completed = true});
		model.save();
		return true;
	}
}

//remove completed items, use reverse counter splice method 
model.clearCompleted = function(){
	var removedItems = [];

	for (let i = todoData.length-1;i>=0;i--){
		if (todoData[i].completed === true){todoData.splice(i,1);removedItems.push(i)}
	}
	model.save();
	return removedItems;
}

model.getData = function(){
	return todoData;
}

model.save = function(){
	localStorage.todoData = JSON.stringify(todoData);
}

model.saveFilter = function(){
	localStorage.todoFilter = filter;
}

model.load = function(){
	if (localStorage.todoData === undefined){localStorage.todoData = JSON.stringify(todoData);localStorage.todoFilter = filter;return false}
	else {todoData = JSON.parse(localStorage.todoData);filter = localStorage.todoFilter;return true}
}

})(window);