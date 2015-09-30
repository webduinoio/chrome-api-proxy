+(function () {

  'use strict';

  var node;

  document.addEventListener('DOMContentLoaded', function () {
    node = document.querySelector('#serial-port-status');

    getNode('refresh').addEventListener('click', function () {
      refreshStatus(node);
    }, false);

    getNode('disconnect').addEventListener('click', function () {
      chrome.serial.disconnect(parseInt(getNode('disconnId').value), function (e) {
        refreshStatus(node);
        if (e !== true) {
          alert(e + '');
        }
      });
    });

    refreshStatus(node);
  }, false);

  function refreshStatus(node) {
    var status = {};

    getNode('disconnId').value = '';
    getNode('disconnStatus').innerHTML = '';

    chrome.serial.getDevices(function (devs) {
      status.devices = devs;
      chrome.serial.getConnections(function (conns) {
        status.connections = conns;
        node.innerHTML = '';
        node.appendChild(JsonHuman.format(status));
      });
    });
  }

  function getNode(id) {
    return document.getElementById(id);
  }

}());
