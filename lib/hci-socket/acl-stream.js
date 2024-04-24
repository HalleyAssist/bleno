const debug = require('debug')('bleno:acl-stream');

const { EventEmitter } = require('events');

const Smp = require('./smp');

class AclStream extends EventEmitter {
  constructor(hci, handle, localAddressType, localAddress, remoteAddressType, remoteAddress, blenoOptions) {
    super();
    this._hci = hci;
    this._handle = handle;
    this.encypted = false;

    this._initSmp(localAddressType, localAddress, remoteAddressType, remoteAddress, blenoOptions)
  }

  _initSmp(localAddressType, localAddress, remoteAddressType, remoteAddress, blenoOptions){
    this._smp = new Smp(this, localAddressType, localAddress, remoteAddressType, remoteAddress, blenoOptions);
  }

  write(cid, data) {
    this._hci.queueAclDataPkt(this._handle, cid, data);
  }

  push(cid, data) {
    if (data) {
      this.emit('data', cid, data);
    } else {
      this.emit('end');
    }
  }

  pushEncrypt(encrypt) {
    this.encrypted = !!encrypt;

    this.emit('encryptChange', this.encrypted);
  }

  pushLtkNegReply() {
    this.emit('ltkNegReply');
  }
}

module.exports = AclStream;
