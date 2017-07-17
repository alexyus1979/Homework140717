"use strict";

var tasks = [];
var wsUri = "ws://echo.websocket.org/"; // just free WS-server for tests
var websocket;


var defaultTask = {
  content: 'No_content',
  isDeleted: false
};

var regExp = /([А-Яа-яA-Za-z0-9-+.,!@#$%^&*();\/\\\|:<>"'?=_]+)/g;

$(document).ready(function () {
	loadFromLocalStorage();

  $('#addTask').on('click', onClickAddTask);

  $('#sendByAjax').on('click', sendDataToServerByAjax);

  $('#sendByWebSockets').on('click', sendDataToServerByWebSockets);

});


