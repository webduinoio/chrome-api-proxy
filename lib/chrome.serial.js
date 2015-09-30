chrome = chrome || {};

chrome.serial = chrome.serial || (function (window) {

  'use strict';

  var slice = Array.prototype.slice,
    wnd = window.top,
    undef = undefined,
    callbackHash = {},
    listenerHash = {},
    apiCalls = 0;

  function proxyRequest(api) {
    return function () {
      var params = slice.call(arguments),
        id = ++apiCalls + '';

      if (typeof params[params.length - 1] === 'function') {
        callbackHash[id] = params.pop();
      }
      invoke(id, api, params);
    };
  }

  function proxyAddListener(api) {
    return function (listener) {
      var id = ++apiCalls + '';

      if (typeof listener === 'function') {
        listenerHash[id] = listener;
        invoke(id, api, []);
      }
    };
  }

  function proxyRemoveListener(api) {
    return function (listener) {
      Object.keys(listenerHash).some(function (id) {
        if (listenerHash[id] === listener) {
          delete listenerHash[id];
          invoke(id, api, []);
        }
      });
    };
  }

  function invoke(id, method, params) {
    wnd.postMessage({
      jsonrpc: '2.0',
      id: id,
      method: method,
      params: params
    }, '*');
  }

  wnd.addEventListener('message', function (event) {
    var msg = event.data;

    if (msg.jsonrpc && !msg.method) {
      if (msg.error) {
        throw msg.error;
      } else if (msg.result) {
        if (callbackHash[msg.id]) {
          callbackHash[msg.id].apply(undef, msg.result);
          delete callbackHash[msg.id];
        } else if (listenerHash[msg.id]) {
          listenerHash[msg.id].apply(undef, msg.result);
        }
      }
    }
  }, false);

  return {
    getDevices: proxyRequest('chrome.serial.getDevices'),

    getConnections: proxyRequest('chrome.serial.getConnections'),

    connect: proxyRequest('chrome.serial.connect'),

    disconnect: proxyRequest('chrome.serial.disconnect'),

    send: function (connectionId, data, callback) {
      proxyRequest('chrome.serial.send')
        .apply(undef, [connectionId, slice.call(new Uint8Array(data)), callback]);
    },

    onReceive: {
      addListener: proxyAddListener('chrome.serial.onReceive.addListener'),
      removeListener: proxyRemoveListener('chrome.serial.onReceive.removeListener')
    },

    onReceiveError: {
      addListener: proxyAddListener('chrome.serial.onReceiveError.addListener'),
      removeListener: proxyRemoveListener('chrome.serial.onReceiveError.removeListener')
    }
  };

}(window));
