const {EventEmitter} = require('events');

const debug = require('debug')('characteristic');

const UuidUtil = require('./uuid-util');

class Characteristic extends EventEmitter {
  constructor(options) {
    super();

    this.uuid = UuidUtil.removeDashes(options.uuid);
    this.properties = options.properties || [];
    this.secure = options.secure || [];
    this.value = options.value || null;
    this.descriptors = options.descriptors || [];

    if (this.value && (this.properties.length !== 1 || this.properties[0] !== 'read')) {
      throw new Error('Characteristics with value can be read only!');
    }

    if (options.onReadRequest) {
      this.onReadRequest = options.onReadRequest;
    }

    if (options.onWriteRequest) {
      this.onWriteRequest = options.onWriteRequest;
    }

    if (options.onSubscribe) {
      this.onSubscribe = options.onSubscribe;
    }

    if (options.onUnsubscribe) {
      this.onUnsubscribe = options.onUnsubscribe;
    }

    if (options.onNotify) {
      this.onNotify = options.onNotify;
    }

    if (options.onIndicate) {
      this.onIndicate = options.onIndicate;
    }

    this.on('readRequest', this.onReadRequest.bind(this));
    this.on('writeRequest', this.onWriteRequest.bind(this));
    this.on('subscribe', this.onSubscribe.bind(this));
    this.on('unsubscribe', this.onUnsubscribe.bind(this));
    this.on('notify', this.onNotify.bind(this));
    this.on('indicate', this.onIndicate.bind(this));
  }

  toString() {
    return JSON.stringify({
      uuid: this.uuid,
      properties: this.properties,
      secure: this.secure,
      value: this.value,
      descriptors: this.descriptors
    });
  }

  onReadRequest(offset, callback) {
    callback(Characteristic.RESULT_UNLIKELY_ERROR, null);
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    callback(Characteristic.RESULT_UNLIKELY_ERROR);
  }

  onSubscribe(maxValueSize, updateValueCallback, callback) {
    this.maxValueSize = maxValueSize;
    this.updateValueCallback = updateValueCallback;
    callback(Characteristic.RESULT_UNLIKELY_ERROR);
  }

  onUnsubscribe(callback) {
    this.maxValueSize = null;
    this.updateValueCallback = null;
    callback(Characteristic.RESULT_UNLIKELY_ERROR);
  }

  onNotify() {
  }

  onIndicate() {
  }
}

Characteristic.RESULT_SUCCESS = 0x00;
Characteristic.RESULT_INVALID_HANDLE = 0x01;
Characteristic.RESULT_READ_NOT_PERM = 0x02;
Characteristic.RESULT_WRITE_NOT_PERM = 0x03;
Characteristic.RESULT_INVALID_PDU = 0x04;
Characteristic.RESULT_AUTHENTICATION = 0x05;
Characteristic.RESULT_REQ_NOT_SUPP = 0x06;
Characteristic.RESULT_INVALID_OFFSET = 0x07;
Characteristic.RESULT_AUTHORIZATION = 0x08;
Characteristic.RESULT_PREP_QUEUE_FULL = 0x09;
Characteristic.RESULT_ATTR_NOT_FOUND = 0x0a;
Characteristic.RESULT_ATTR_NOT_LONG = 0x0b;
Characteristic.RESULT_INSUFF_ENCR_KEY_SIZE = 0x0c;
Characteristic.RESULT_INVALID_ATTRIBUTE_LENGTH = 0x0d;
Characteristic.RESULT_UNLIKELY_ERROR = 0x0e;
Characteristic.RESULT_INSUFF_ENC = 0x0f;
Characteristic.RESULT_UNSUPP_GRP_TYPE = 0x10;
Characteristic.RESULT_INSUFF_RESOURCES = 0x11;




module.exports = Characteristic;
