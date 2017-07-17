function createElement(value, index) {
  var myElem = document.createElement('a');
  myElem.innerHTML = value;
  myElem.setAttribute('href', '#');
	myElem.setAttribute('title', 'click to delete this element');
  myElem.setAttribute('data-index', index);
  myElem.onclick = deleteTask;
  $('#taskContainer').append(myElem);
}


function deleteTask() {
	var index = $(this).data('index');

	$(this).remove();
	tasks[index].isDeleted = true;

	tasks = jQuery.grep(tasks, function( itemOfArray ) {
	  return itemOfArray.isDeleted !== true;
	});

	changeDataIndexes();
	saveToLocalStorage();
}


function changeDataIndexes() {
	$( '#taskContainer a' ).each(function( index ) {
		$( this ).data('index', index);
	});
}


function saveToLocalStorage() {
	var tasksInJSONFormat = JSON.stringify(tasks);

	if(typeof(Storage) !== "undefined") {
	 		localStorage.allTasks = tasksInJSONFormat;
    } else {
    	alert('Sorry, your browser does not support web storage...');
    }
}


function checkForFilledInput(value) {
	var result = value.search(regExp);

	if (!value || result == -1) {
		alert('Field is empty, please enter info into field');
		return false;
	}

	return true;
}


function loadFromLocalStorage() {
	if(typeof(Storage) !== "undefined") {
 		
 		if (!localStorage.allTasks) return;

 		var tasksInJSONFormat = localStorage.allTasks;
		tasks = JSON.parse(tasksInJSONFormat);

		if (!tasks) return;

		for (var index = 0; index < tasks.length; index++) {
			createElement(tasks[index].content, index);
		}

  } else {
  	alert('Sorry, your browser does not support web storage...');
  }
}


function onClickAddTask() {
    var taskValue = $('#task').val();
    $('#task').val('');

    if (!checkForFilledInput(taskValue)) return;

    var myTask = Object.create(defaultTask);
    myTask.content = taskValue;
    tasks.push(myTask); // add new task to array

    createElement(taskValue, tasks.length - 1);

    saveToLocalStorage();
}


function sendDataToServerByAjax() {
    var tasksInJSONFormat = JSON.stringify(tasks);
    var root = 'https://jsonplaceholder.typicode.com';

    $.ajax({
        type: "POST",
        url: root + '/posts',
        data: tasksInJSONFormat
    }).done(function (msg) {
        alert("Data Saved: " + JSON.stringify(msg));
    }).fail(function (msg) {
        alert("Error" + JSON.stringify(msg));
    });

}


function sendDataToServerByWebSockets() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) {
        onOpen(evt)
    };
    websocket.onclose = function (evt) {
        onClose(evt)
    };
    websocket.onmessage = function (evt) {
        onMessage(evt)
    };
    websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onOpen() {
    writeToScreen("CONNECTED");
    var tasksInJSONFormat = JSON.stringify(tasks);
    doSend(tasksInJSONFormat);
}


function onClose() {
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    writeToScreen('RESPONSE: ' + evt.data);
    websocket.close();
}

function onError(evt) {
    writeToScreen('ERROR: ' + evt.data);
}

function doSend(message) {
    writeToScreen("SENT: " + message);
    websocket.send(message);
}

function writeToScreen(message) {
    console.log(message);
}

