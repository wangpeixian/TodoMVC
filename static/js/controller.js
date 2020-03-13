//CONTROLLER
(function(global){
'use strict';	

//PUBLIC
global.$controllerCallback = controllerCallback;

//PRIVATE
var controller = {};
var editItemNum = -1;

//IMPLEMENTATION
function controllerCallback(method, parameter){
	//need to block own toggle calls if edit is showing i.e. index -1
	if ((method === "toggleCompleted" || method === "deleteItem") && parameter === -1){method = "none";}
	if (method === "edited" || method === "cancelEdit"){
		if (parameter !== undefined && parameter !== ""){$model.setTitle(editItemNum, parameter);}
		method = "replaceItem";
		parameter = editItemNum;
		if (editItemNum === -1){method = "none";}
		editItemNum = -1;
	}
	if(method !== "none"){controller[method](parameter);}
}

controller.addItem = function(value) {
    if (value !== "") {
        $startTimer("Add Item");
        if ($model.getNum() === 0) {
            $view.showHideControls(true);
        }
        $model.addItem(value);
        $view.addItem(value, "still-todo");
        $view.updateItemCount($model.getNum(false));
        $stopTimer();
    }
};

controller.replaceItem = function(index){
	var className = $model.getCompletedStatus(index) === false ? "still-todo" : "completed-todo"; 
	$view.replaceItem($model.getTitle(index), index, className);
};

controller.filter = function(value){
	var filter;
	
	$startTimer("Filter");
	$model.setFilter(value);
	if (value === "all"){value = "all";filter = 0;}
	if (value === "active"){value = false;filter = 1;}
	if (value === "completed"){value = true;filter = 2;}
	$view.setFilter(value);
	$view.changeFilterActive(filter);
	$stopTimer();	
};

controller.deleteItem = function(index){
	$startTimer("Delete Item");
	$model.deleteItem(index);
	$view.deleteItem(index);
	$view.updateItemCount($model.getNum(false));
	if ($model.getNum() === 0){$view.showHideControls(false);}
	if ($model.getNum(true) > 0){$view.showHideClear(true);}else{$view.showHideClear(false);}
	$stopTimer();
}

controller.toggleCompleted = function(index){
	$startTimer("toggle Completed");
	$model.toggleCompletedStatus(index);
	if ($model.getCompletedStatus(index) === false){$view.toggleCompleted(index, false);}
	else {$view.toggleCompleted(index, true);}
	if ($model.getNum(true) > 0){$view.showHideClear(true);}else{$view.showHideClear(false);}
	$view.updateItemCount($model.getNum(false));
	$stopTimer();
}

controller.toggleAll = function(){
	var completedStatus;

	$startTimer("Toggle all");
	if ($model.getNum() > 0){
		completedStatus = $model.toggleAll();
		$view.toggleAll(completedStatus);
		$view.updateItemCount($model.getNum(false));
		if ($model.getNum(true) > 0){$view.showHideClear(true);}else{$view.showHideClear(false);}
	}
	$stopTimer();
}

controller.clearCompleted = function(){
	var removedItems;

	$startTimer("Clear completed");
	if ($model.getNum(true) > 0){
		removedItems = $model.clearCompleted();
		for (let i = 0;i<removedItems.length;i++){
			$view.deleteItem(removedItems[i]);
		}
	}
	if ($model.getNum() === 0){$view.showHideControls(false);}
	if ($model.getNum(true) > 0){$view.showHideClear(true);}else{$view.showHideClear(false);}
	$stopTimer();
}

controller.editItem = function(index){
	editItemNum = index;
	$view.addEditBox(index, $model.getTitle(index));
}

if ($model.load() === true){
	if ($model.getNum() === 0){$view.showHideControls(false);}else{$view.showHideControls(true);}
	if ($model.getNum(true) > 0){$view.showHideClear(true);}else{$view.showHideClear(false);}
	$view.refresh($model.getData());
	$view.updateItemCount($model.getNum(false));
	$stopTimer();
	controller.filter($model.getFilter());
}else{$view.showHideControls(false);$stopTimer();};

})(window);