chrome.serial = chrome.serial || (function (_api) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    proxyRequest = _api.proxyRequest,
    proxyAddListener = _api.proxyAddListener,
    proxyRemoveListener = _api.proxyRemoveListener;

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

}(chrome._api));
