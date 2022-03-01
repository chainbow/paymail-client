import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import _regeneratorRuntime from "@babel/runtime/regenerator";
import Promise$1 from 'bluebird';
import fetch from 'cross-fetch';

var bsv = require('bsv');

var brfc = function brfc(title, authors, version) {
  var autorString = authors.join(', ').trim();
  var stringToHash = [title.trim() + autorString + (version.toString() || '')].join('').trim();
  var hash = bsv.crypto.Hash.sha256sha256(Buffer.from(stringToHash));
  hash = hash.reverse();
  return hash.toString('hex').substring(0, 12);
};

var CapabilityCodes = {
  pki: 'pki',
  paymentDestination: 'paymentDestination',
  requestSenderValidation: brfc('bsvalias Payment Addressing (Payer Validation)', ['andy (nChain)'], ''),
  verifyPublicKeyOwner: brfc('bsvalias public key verify (Verify Public Key Owner)', [], ''),
  publicProfile: brfc('Public Profile (Name & Avatar)', ['Ryan X. Charles (Money Button)'], '1'),
  receiveTransaction: brfc('Send raw transaction', ['Miguel Duarte (Money Button)', 'Ryan X. Charles (Money Button)', 'Ivan Mlinaric (Handcash)', 'Rafa (Handcash)'], '1.1'),
  p2pPaymentDestination: brfc('Get no monitored payment destination (p2p payment destination)', ['Miguel Duarte (Money Button)', 'Ryan X. Charles (Money Button)', 'Ivan Mlinaric (Handcash)', 'Rafa (Handcash)'], '1.1'),
  witnessPublic: brfc('Public API of the Controllable UTXO Token Witness', ['LI Long (ChainBow)'], '1'),
  witnessCheckBaton: brfc('Check Baton API of the Controllable UTXO Token Witness', ['LI Long (ChainBow)'], '1'),
  witnessCheckToken: brfc('Check Token API of the Controllable UTXO Token Witness', ['LI Long (ChainBow)'], '1'),
  witnessCheckSale: brfc('Check Sale API of the Controllable UTXO Token Witness', ['LI Long (ChainBow)'], '1'),
  //expect: 'c89beec44e80',
  witnessCheckBuy: brfc('Check Buy API of the Controllable UTXO Token Witness', ['LI Long (ChainBow)'], '1'),
  //expect: '598b080631c4',
  tokenLogo: brfc('Logo URI of the Controllable UTXO Token', ['LI Long (ChainBow)'], '1'),
  tokenInformation: brfc('Infomation URI of the Controllable UTXO Token', ['LI Long (ChainBow)'], '1')
};

var DnsOverHttps = /*#__PURE__*/function () {
  function DnsOverHttps(fetch, config) {
    _classCallCheck(this, DnsOverHttps);

    this.fetch = fetch;
    this.config = config;
  }

  _createClass(DnsOverHttps, [{
    key: "resolveSrv",
    value: function () {
      var _resolveSrv = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(aDomain) {
        var response, body;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.fetch("".concat(this.config.baseUrl, "?name=").concat(aDomain, "&type=SRV&cd=0"));

              case 2:
                response = _context.sent;
                _context.next = 5;
                return response.json();

              case 5:
                body = _context.sent;
                return _context.abrupt("return", body);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resolveSrv(_x) {
        return _resolveSrv.apply(this, arguments);
      }

      return resolveSrv;
    }()
  }, {
    key: "queryBsvaliasDomain",
    value: function () {
      var _queryBsvaliasDomain = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(aDomain) {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.resolveSrv("_bsvalias._tcp.".concat(aDomain)));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function queryBsvaliasDomain(_x2) {
        return _queryBsvaliasDomain.apply(this, arguments);
      }

      return queryBsvaliasDomain;
    }()
  }]);

  return DnsOverHttps;
}();

var DnsClient = /*#__PURE__*/function () {
  function DnsClient(dns, fetch) {
    _classCallCheck(this, DnsClient);

    this.dns = dns;
    this.dohAli = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.alidns.com/resolve'
    });
    this.dohGoogle = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.google.com/resolve'
    });
  }

  _createClass(DnsClient, [{
    key: "checkSrv",
    value: function () {
      var _checkSrv = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(aDomain) {
        var _this = this;

        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", new Promise$1(function (resolve, reject) {
                  _this.dns.resolveSrv("_bsvalias._tcp.".concat(aDomain), /*#__PURE__*/function () {
                    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(err, result) {
                      var _result$, domainFromDns, port, isSecure;

                      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _context3.prev = 0;

                              if (!(err && (err.code === 'ENODATA' || err.code === 'ENOTFOUND'))) {
                                _context3.next = 3;
                                break;
                              }

                              return _context3.abrupt("return", resolve({
                                domain: aDomain,
                                port: 443,
                                isSecure: true
                              }));

                            case 3:
                              if (!err) {
                                _context3.next = 5;
                                break;
                              }

                              return _context3.abrupt("return", reject(err));

                            case 5:
                              _result$ = result[0], domainFromDns = _result$.name, port = _result$.port, isSecure = _result$.isSecure;
                              resolve({
                                domain: domainFromDns,
                                port: port,
                                isSecure: _this.checkDomainIsSecure(domainFromDns, aDomain) || isSecure
                              });
                              _context3.next = 12;
                              break;

                            case 9:
                              _context3.prev = 9;
                              _context3.t0 = _context3["catch"](0);
                              return _context3.abrupt("return", reject(_context3.t0));

                            case 12:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3, null, [[0, 9]]);
                    }));

                    return function (_x4, _x5) {
                      return _ref.apply(this, arguments);
                    };
                  }());
                }).then(function (result) {
                  if (result.isSecure) {
                    return result;
                  } else {
                    return _this.validateDnssec(aDomain);
                  }
                }, function (err) {
                  console.error(err);
                  return err;
                }));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function checkSrv(_x3) {
        return _checkSrv.apply(this, arguments);
      }

      return checkSrv;
    }()
  }, {
    key: "checkDomainIsSecure",
    value: function checkDomainIsSecure(srvResponseDomain, originalDomain) {
      if (this.domainsAreEqual(srvResponseDomain, originalDomain)) {
        return true;
      } else if (this.responseIsWwwSubdomain(srvResponseDomain, originalDomain)) {
        return true;
      } else if (this.isHandcashDomain(originalDomain)) {
        // tell rafa to fix handcash and we can remove the special case :)
        return this.domainsAreEqual('handcash-paymail-production.herokuapp.com', srvResponseDomain) || this.domainsAreEqual('handcash-cloud-production.herokuapp.com', srvResponseDomain);
      } else if (this.isHandcashInternalDomain(originalDomain)) {
        return this.domainsAreEqual('handcash-cloud-staging.herokuapp.com', srvResponseDomain);
      } else if (this.domainsAreEqual('localhost', srvResponseDomain)) {
        return true;
      } else if (this.isMoneyButtonDomain(srvResponseDomain)) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "isMoneyButtonDomain",
    value: function isMoneyButtonDomain(aDomain) {
      return this.domainsAreEqual(aDomain, 'moneybutton.com') || this.domainsAreEqual(aDomain, 'www.moneybutton.com');
    }
  }, {
    key: "responseIsWwwSubdomain",
    value: function responseIsWwwSubdomain(srvResponseDomain, originalDomain) {
      return this.domainsAreEqual(srvResponseDomain, "www.".concat(originalDomain));
    }
  }, {
    key: "isHandcashDomain",
    value: function isHandcashDomain(aDomain) {
      return this.domainsAreEqual('handcash.io', aDomain);
    }
  }, {
    key: "isHandcashInternalDomain",
    value: function isHandcashInternalDomain(aDomain) {
      return this.domainsAreEqual('internal.handcash.io', aDomain);
    }
  }, {
    key: "validateDnssec",
    value: function () {
      var _validateDnssec = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(aDomain) {
        var dnsResponse, data, port, responseDomain;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return Promise$1.any([this.dohAli.queryBsvaliasDomain(aDomain), this.dohGoogle.queryBsvaliasDomain(aDomain)]);

              case 2:
                dnsResponse = _context5.sent;

                if (!(dnsResponse.Status !== 0 || !dnsResponse.Answer)) {
                  _context5.next = 5;
                  break;
                }

                throw new Error('Insecure domain.');

              case 5:
                data = dnsResponse.Answer[0].data.split(' ');
                port = data[2];
                responseDomain = data[3]; // if (!dnsResponse.AD && !this.domainsAreEqual(aDomain, responseDomain)) {
                //   throw new Error('Insecure domain.')
                // }

                return _context5.abrupt("return", {
                  port: port,
                  domain: responseDomain,
                  isSecure: dnsResponse.AD
                });

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function validateDnssec(_x6) {
        return _validateDnssec.apply(this, arguments);
      }

      return validateDnssec;
    }()
  }, {
    key: "domainsAreEqual",
    value: function domainsAreEqual(domain1, domain2) {
      return domain1.toLowerCase().replace(/\.$/, '') === domain2.toLowerCase().replace(/\.$/, '');
    }
  }]);

  return DnsClient;
}();

var Http = /*#__PURE__*/function () {
  function Http(fetch) {
    _classCallCheck(this, Http);

    this.fetch = fetch;
  }

  _createClass(Http, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(url) {
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this._basicRequest(url));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function get(_x7) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "postJson",
    value: function () {
      var _postJson = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(url, body) {
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", this._basicRequest(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                }));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function postJson(_x8, _x9) {
        return _postJson.apply(this, arguments);
      }

      return postJson;
    }()
  }, {
    key: "_basicRequest",
    value: function () {
      var _basicRequest2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(url) {
        var options,
            timeout,
            _args8 = arguments;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                options = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
                timeout = 5000;
                return _context8.abrupt("return", Promise.race([this.fetch(url, _objectSpread(_objectSpread({}, options), {}, {
                  credentials: 'omit'
                })), new Promise(function (_, reject) {
                  return setTimeout(function () {
                    return reject(new Error('timeout'));
                  }, timeout);
                })]));

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _basicRequest(_x10) {
        return _basicRequest2.apply(this, arguments);
      }

      return _basicRequest;
    }()
  }]);

  return Http;
}();

var EndpointResolver = /*#__PURE__*/function () {
  function EndpointResolver() {
    var dns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var fetch = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, EndpointResolver);

    this.dnsClient = new DnsClient(dns, fetch);
    this.http = new Http(fetch);
    this._cache = {};
  }

  _createClass(EndpointResolver, [{
    key: "getIdentityUrlFor",
    value: function () {
      var _getIdentityUrlFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(aPaymail) {
        var _aPaymail$split, _aPaymail$split2, alias, domain, apiDescriptor, identityUrl;

        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _aPaymail$split = aPaymail.split('@'), _aPaymail$split2 = _slicedToArray(_aPaymail$split, 2), alias = _aPaymail$split2[0], domain = _aPaymail$split2[1];
                _context9.next = 3;
                return this.ensureCapabilityFor(domain, CapabilityCodes.pki);

              case 3:
                _context9.next = 5;
                return this.getApiDescriptionFor(domain);

              case 5:
                apiDescriptor = _context9.sent;
                identityUrl = apiDescriptor.capabilities.pki.replace('{alias}', alias).replace('{domain.tld}', domain);
                return _context9.abrupt("return", identityUrl);

              case 8:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getIdentityUrlFor(_x11) {
        return _getIdentityUrlFor.apply(this, arguments);
      }

      return getIdentityUrlFor;
    }()
  }, {
    key: "getAddressUrlFor",
    value: function () {
      var _getAddressUrlFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(aPaymail) {
        var _aPaymail$split3, _aPaymail$split4, alias, domain, apiDescriptor, addressUrl;

        return _regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _aPaymail$split3 = aPaymail.split('@'), _aPaymail$split4 = _slicedToArray(_aPaymail$split3, 2), alias = _aPaymail$split4[0], domain = _aPaymail$split4[1];
                _context10.next = 3;
                return this.ensureCapabilityFor(domain, CapabilityCodes.paymentDestination);

              case 3:
                _context10.next = 5;
                return this.getApiDescriptionFor(domain);

              case 5:
                apiDescriptor = _context10.sent;
                addressUrl = apiDescriptor.capabilities.paymentDestination.replace('{alias}', alias).replace('{domain.tld}', domain);
                return _context10.abrupt("return", addressUrl);

              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getAddressUrlFor(_x12) {
        return _getAddressUrlFor.apply(this, arguments);
      }

      return getAddressUrlFor;
    }()
  }, {
    key: "getVerifyUrlFor",
    value: function () {
      var _getVerifyUrlFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(aPaymail, aPubkey) {
        var _aPaymail$split5, _aPaymail$split6, alias, domain, apiDescriptor, url;

        return _regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _aPaymail$split5 = aPaymail.split('@'), _aPaymail$split6 = _slicedToArray(_aPaymail$split5, 2), alias = _aPaymail$split6[0], domain = _aPaymail$split6[1];
                _context11.next = 3;
                return this.ensureCapabilityFor(domain, CapabilityCodes.verifyPublicKeyOwner);

              case 3:
                _context11.next = 5;
                return this.getApiDescriptionFor(domain);

              case 5:
                apiDescriptor = _context11.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.verifyPublicKeyOwner].replace('{alias}', alias).replace('{domain.tld}', domain).replace('{pubkey}', aPubkey);
                return _context11.abrupt("return", url);

              case 8:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getVerifyUrlFor(_x13, _x14) {
        return _getVerifyUrlFor.apply(this, arguments);
      }

      return getVerifyUrlFor;
    }()
  }, {
    key: "getPublicProfileUrlFor",
    value: function () {
      var _getPublicProfileUrlFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(aPaymail) {
        var _aPaymail$split7, _aPaymail$split8, alias, domain, apiDescriptor, url;

        return _regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _aPaymail$split7 = aPaymail.split('@'), _aPaymail$split8 = _slicedToArray(_aPaymail$split7, 2), alias = _aPaymail$split8[0], domain = _aPaymail$split8[1];
                _context12.next = 3;
                return this.ensureCapabilityFor(domain, CapabilityCodes.publicProfile);

              case 3:
                _context12.next = 5;
                return this.getApiDescriptionFor(domain);

              case 5:
                apiDescriptor = _context12.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.publicProfile].replace('{alias}', alias).replace('{domain.tld}', domain);
                return _context12.abrupt("return", url);

              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getPublicProfileUrlFor(_x15) {
        return _getPublicProfileUrlFor.apply(this, arguments);
      }

      return getPublicProfileUrlFor;
    }()
  }, {
    key: "getSendTxUrlFor",
    value: function () {
      var _getSendTxUrlFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13(aPaymail) {
        var _aPaymail$split9, _aPaymail$split10, alias, domain, apiDescriptor, url;

        return _regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _aPaymail$split9 = aPaymail.split('@'), _aPaymail$split10 = _slicedToArray(_aPaymail$split9, 2), alias = _aPaymail$split10[0], domain = _aPaymail$split10[1];
                _context13.next = 3;
                return this.ensureCapabilityFor(domain, CapabilityCodes.receiveTransaction);

              case 3:
                _context13.next = 5;
                return this.getApiDescriptionFor(domain);

              case 5:
                apiDescriptor = _context13.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.receiveTransaction].replace('{alias}', alias).replace('{domain.tld}', domain);
                return _context13.abrupt("return", url);

              case 8:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function getSendTxUrlFor(_x16) {
        return _getSendTxUrlFor.apply(this, arguments);
      }

      return getSendTxUrlFor;
    }()
  }, {
    key: "getP2pPatmentDestinationUrlFor",
    value: function () {
      var _getP2pPatmentDestinationUrlFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14(aPaymail) {
        var _aPaymail$split11, _aPaymail$split12, alias, domain, apiDescriptor, url;

        return _regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _aPaymail$split11 = aPaymail.split('@'), _aPaymail$split12 = _slicedToArray(_aPaymail$split11, 2), alias = _aPaymail$split12[0], domain = _aPaymail$split12[1];
                _context14.next = 3;
                return this.ensureCapabilityFor(domain, CapabilityCodes.p2pPaymentDestination);

              case 3:
                _context14.next = 5;
                return this.getApiDescriptionFor(domain);

              case 5:
                apiDescriptor = _context14.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.p2pPaymentDestination].replace('{alias}', alias).replace('{domain.tld}', domain);
                return _context14.abrupt("return", url);

              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function getP2pPatmentDestinationUrlFor(_x17) {
        return _getP2pPatmentDestinationUrlFor.apply(this, arguments);
      }

      return getP2pPatmentDestinationUrlFor;
    }()
  }, {
    key: "domainHasCapability",
    value: function () {
      var _domainHasCapability = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(aDomain, capability) {
        var apiDescriptor;
        return _regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.getApiDescriptionFor(aDomain);

              case 2:
                apiDescriptor = _context15.sent;
                return _context15.abrupt("return", !!apiDescriptor.capabilities[capability]);

              case 4:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function domainHasCapability(_x18, _x19) {
        return _domainHasCapability.apply(this, arguments);
      }

      return domainHasCapability;
    }()
  }, {
    key: "getApiDescriptionFor",
    value: function () {
      var _getApiDescriptionFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(aDomain) {
        var _yield$this$getWellKn, domain, port, apiDescriptor;

        return _regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (!this._cache[aDomain]) {
                  _context16.next = 2;
                  break;
                }

                return _context16.abrupt("return", this._cache[aDomain]);

              case 2:
                _context16.next = 4;
                return this.getWellKnownBaseUrl(aDomain);

              case 4:
                _yield$this$getWellKn = _context16.sent;
                domain = _yield$this$getWellKn.domain;
                port = _yield$this$getWellKn.port;
                _context16.next = 9;
                return this.fetchApiDescriptor(domain, port);

              case 9:
                apiDescriptor = _context16.sent;
                this._cache[aDomain] = apiDescriptor;
                return _context16.abrupt("return", apiDescriptor);

              case 12:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function getApiDescriptionFor(_x20) {
        return _getApiDescriptionFor.apply(this, arguments);
      }

      return getApiDescriptionFor;
    }()
  }, {
    key: "fetchApiDescriptor",
    value: function () {
      var _fetchApiDescriptor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(domain, port) {
        var protocol, requestPort, requestDomain, wellKnown, apiDescriptor;
        return _regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                protocol = domain === 'localhost' || domain === 'localhost.' ? 'http' : 'https';
                requestPort = port === undefined || port.toString() === '443' ? '' : ":".concat(port);
                requestDomain = /^(.*?)\.?$/.exec(domain)[1]; // Get value from capture group

                if (requestDomain) {
                  _context17.next = 5;
                  break;
                }

                throw new Error("Invalid domain: ".concat(domain));

              case 5:
                _context17.next = 7;
                return this.http.get("".concat(protocol, "://").concat(requestDomain).concat(requestPort, "/.well-known/bsvalias"));

              case 7:
                wellKnown = _context17.sent;
                _context17.next = 10;
                return wellKnown.json();

              case 10:
                apiDescriptor = _context17.sent;
                return _context17.abrupt("return", apiDescriptor);

              case 12:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function fetchApiDescriptor(_x21, _x22) {
        return _fetchApiDescriptor.apply(this, arguments);
      }

      return fetchApiDescriptor;
    }()
  }, {
    key: "getWellKnownBaseUrl",
    value: function () {
      var _getWellKnownBaseUrl = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18(aDomain) {
        return _regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                return _context18.abrupt("return", this.dnsClient.checkSrv(aDomain));

              case 1:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function getWellKnownBaseUrl(_x23) {
        return _getWellKnownBaseUrl.apply(this, arguments);
      }

      return getWellKnownBaseUrl;
    }()
  }, {
    key: "ensureCapabilityFor",
    value: function () {
      var _ensureCapabilityFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee19(aDomain, aCapability) {
        return _regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return this.domainHasCapability(aDomain, aCapability);

              case 2:
                if (_context19.sent) {
                  _context19.next = 4;
                  break;
                }

                throw new Error("Unknown capability \"".concat(aCapability, "\" for \"").concat(aDomain, "\""));

              case 4:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function ensureCapabilityFor(_x24, _x25) {
        return _ensureCapabilityFor.apply(this, arguments);
      }

      return ensureCapabilityFor;
    }()
  }], [{
    key: "create",
    value: function create(dnsClient, fetch) {
      var instance = new EndpointResolver(null, fetch);
      instance.dnsClient = dnsClient;
      return instance;
    }
  }]);

  return EndpointResolver;
}();

var VerifiableMessage = /*#__PURE__*/function () {
  function VerifiableMessage(parts) {
    var bsv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, VerifiableMessage);

    if (bsv === null) {
      bsv = require('bsv');
      bsv.Message = require('bsv/message');
    }

    this.bsv = bsv;
    var concatenated = Buffer.from(parts.join(''));
    this.message = new this.bsv.Message(concatenated);
  }

  _createClass(VerifiableMessage, [{
    key: "sign",
    value: function sign(wifPrivateKey) {
      return this.message.sign(this.bsv.PrivateKey.fromWIF(wifPrivateKey));
    }
  }, {
    key: "verify",
    value: function verify(keyAddress, signature) {
      return this.message.verify(keyAddress, signature);
    }
  }], [{
    key: "forBasicAddressResolution",
    value: function forBasicAddressResolution(_ref2) {
      var senderHandle = _ref2.senderHandle,
          amount = _ref2.amount,
          dt = _ref2.dt,
          purpose = _ref2.purpose;

      if (dt && dt.toISOString) {
        dt = dt.toISOString();
      }

      return new VerifiableMessage([senderHandle, amount || '0', dt, purpose]);
    }
  }]);

  return VerifiableMessage;
}();

var RequestBodyFactory = /*#__PURE__*/function () {
  function RequestBodyFactory(clock) {
    _classCallCheck(this, RequestBodyFactory);

    this.clock = clock;
  }

  _createClass(RequestBodyFactory, [{
    key: "buildBodyToRequestAddress",
    value: function buildBodyToRequestAddress(senderInfo) {
      var privateKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var senderHandle = senderInfo.senderHandle,
          amount = senderInfo.amount,
          senderName = senderInfo.senderName,
          purpose = senderInfo.purpose,
          pubkey = senderInfo.pubkey,
          providedSignature = senderInfo.signature;

      if (!providedSignature && privateKey === null) {
        throw new Error('Missing private key or signature');
      }

      var dt, signature;

      if (providedSignature) {
        if (!senderInfo.dt) {
          throw new Error('missing datetime for given signature');
        }

        dt = senderInfo.dt;
        signature = providedSignature;
      } else {
        dt = this.clock.now();
        signature = VerifiableMessage.forBasicAddressResolution({
          senderHandle: senderHandle,
          amount: amount,
          dt: dt,
          purpose: purpose
        }).sign(privateKey);
      }

      return {
        senderHandle: senderHandle,
        senderName: senderName,
        purpose: purpose,
        dt: dt,
        amount: amount || null,
        pubkey: pubkey,
        signature: signature
      };
    }
  }, {
    key: "buildBodySendTx",
    value: function buildBodySendTx(hexTransaction, reference, metadata) {
      return {
        hex: hexTransaction,
        metadata: metadata,
        reference: reference
      };
    }
  }, {
    key: "buildBodyP2pPaymentDestination",
    value: function buildBodyP2pPaymentDestination(satoshis) {
      return {
        satoshis: satoshis
      };
    }
  }]);

  return RequestBodyFactory;
}();

var Clock = /*#__PURE__*/function () {
  function Clock() {
    _classCallCheck(this, Clock);
  }

  _createClass(Clock, [{
    key: "now",
    value: function now() {
      return new Date();
    }
  }]);

  return Clock;
}();

var PaymailNotFound = /*#__PURE__*/function (_Error) {
  _inherits(PaymailNotFound, _Error);

  var _super = _createSuper(PaymailNotFound);

  function PaymailNotFound(message, paymail) {
    var _this2;

    _classCallCheck(this, PaymailNotFound);

    _this2 = _super.call(this, message);
    _this2.paymail = paymail;
    return _this2;
  }

  return _createClass(PaymailNotFound);
}( /*#__PURE__*/_wrapNativeSuper(Error));

var BrowserDns = /*#__PURE__*/function () {
  function BrowserDns(fetch) {
    _classCallCheck(this, BrowserDns);

    this.dohAli = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.alidns.com/resolve'
    });
    this.dohGoogle = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.google.com/resolve'
    });
  }

  _createClass(BrowserDns, [{
    key: "resolveSrv",
    value: function () {
      var _resolveSrv2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee20(aDomain, aCallback) {
        var response, data;
        return _regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.prev = 0;
                _context20.next = 3;
                return Promise$1.any([this.dohAli.resolveSrv(aDomain), this.dohGoogle.resolveSrv(aDomain)]);

              case 3:
                response = _context20.sent;

                if (response.Status === 0 && response.Answer) {
                  data = response.Answer.map(function (record) {
                    var _record$data$split = record.data.split(' '),
                        _record$data$split2 = _slicedToArray(_record$data$split, 4),
                        priority = _record$data$split2[0],
                        weight = _record$data$split2[1],
                        port = _record$data$split2[2],
                        name = _record$data$split2[3];

                    return {
                      priority: priority,
                      weight: weight,
                      port: port,
                      name: name,
                      isSecure: response.AD
                    };
                  });
                  aCallback(null, data);
                } else if (!response.Answer) {
                  // ignore check response.Status === 0
                  aCallback({
                    code: 'ENODATA'
                  });
                } else {
                  aCallback(new Error('error during dns query'));
                }

                _context20.next = 10;
                break;

              case 7:
                _context20.prev = 7;
                _context20.t0 = _context20["catch"](0);
                aCallback(_context20.t0);

              case 10:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this, [[0, 7]]);
      }));

      function resolveSrv(_x26, _x27) {
        return _resolveSrv2.apply(this, arguments);
      }

      return resolveSrv;
    }()
  }]);

  return BrowserDns;
}();

var PaymailClient = /*#__PURE__*/function () {
  function PaymailClient() {
    var dns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var fetch2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var clock = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var bsv = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, PaymailClient);

    if (fetch2 === null) {
      fetch2 = fetch;
    }

    if (dns === null) {
      dns = new BrowserDns(fetch2);
    }

    if (bsv === null) {
      bsv = require('bsv');
    }

    this.bsv = bsv;
    this.resolver = new EndpointResolver(dns, fetch2);
    this.http = new Http(fetch2);
    this.requestBodyFactory = new RequestBodyFactory(clock !== null ? clock : new Clock());
  }
  /**
   * Get witness public.
   *
   * @param {String} domain - a domain
   */


  _createClass(PaymailClient, [{
    key: "witnessPublic",
    value: function () {
      var _witnessPublic = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee21(domain) {
        var apiDescriptor, url, response;
        return _regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return this.resolver.getApiDescriptionFor(domain);

              case 2:
                apiDescriptor = _context21.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.witnessPublic];
                _context21.next = 6;
                return this.http.get(url);

              case 6:
                response = _context21.sent;
                _context21.next = 9;
                return response.json();

              case 9:
                return _context21.abrupt("return", _context21.sent);

              case 10:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function witnessPublic(_x28) {
        return _witnessPublic.apply(this, arguments);
      }

      return witnessPublic;
    }()
    /**
     * witness check baton.
     *
     * @param {String} domain - a domain
     */

  }, {
    key: "witnessCheckBaton",
    value: function () {
      var _witnessCheckBaton = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee22(domain, args) {
        var apiDescriptor, url, response;
        return _regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this.resolver.getApiDescriptionFor(domain);

              case 2:
                apiDescriptor = _context22.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckBaton];
                _context22.next = 6;
                return this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));

              case 6:
                response = _context22.sent;
                _context22.next = 9;
                return response.json();

              case 9:
                return _context22.abrupt("return", _context22.sent);

              case 10:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function witnessCheckBaton(_x29, _x30) {
        return _witnessCheckBaton.apply(this, arguments);
      }

      return witnessCheckBaton;
    }()
    /**
     * witness check token.
     *
     * @param {String} domain - a domain
     */

  }, {
    key: "witnessCheckToken",
    value: function () {
      var _witnessCheckToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee23(domain, args) {
        var apiDescriptor, url, response;
        return _regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return this.resolver.getApiDescriptionFor(domain);

              case 2:
                apiDescriptor = _context23.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckToken];
                _context23.next = 6;
                return this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));

              case 6:
                response = _context23.sent;
                _context23.next = 9;
                return response.json();

              case 9:
                return _context23.abrupt("return", _context23.sent);

              case 10:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function witnessCheckToken(_x31, _x32) {
        return _witnessCheckToken.apply(this, arguments);
      }

      return witnessCheckToken;
    }()
    /**
    * witness check sale contract.
    *
    * @param {String} domain - a domain
    */

  }, {
    key: "witnessCheckSale",
    value: function () {
      var _witnessCheckSale = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee24(domain, args) {
        var apiDescriptor, url, response;
        return _regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return this.resolver.getApiDescriptionFor(domain);

              case 2:
                apiDescriptor = _context24.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckSale];
                _context24.next = 6;
                return this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));

              case 6:
                response = _context24.sent;
                _context24.next = 9;
                return response.json();

              case 9:
                return _context24.abrupt("return", _context24.sent);

              case 10:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function witnessCheckSale(_x33, _x34) {
        return _witnessCheckSale.apply(this, arguments);
      }

      return witnessCheckSale;
    }()
    /**
    * witness check buy contract.
    *
    * @param {String} domain - a domain
    */

  }, {
    key: "witnessCheckBuy",
    value: function () {
      var _witnessCheckBuy = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee25(domain, args) {
        var apiDescriptor, url, response;
        return _regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return this.resolver.getApiDescriptionFor(domain);

              case 2:
                apiDescriptor = _context25.sent;
                url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckBuy];
                _context25.next = 6;
                return this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));

              case 6:
                response = _context25.sent;
                _context25.next = 9;
                return response.json();

              case 9:
                return _context25.abrupt("return", _context25.sent);

              case 10:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function witnessCheckBuy(_x35, _x36) {
        return _witnessCheckBuy.apply(this, arguments);
      }

      return witnessCheckBuy;
    }()
    /**
     * Get token's logo uri.
     *
     * @param {String} domain - a domain
     * @param {String} contractId - contractId of Token
     * return uri string
     */

  }, {
    key: "tokenLogo",
    value: function () {
      var _tokenLogo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee26(domain, contractId) {
        var apiDescriptor, uri;
        return _regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return this.resolver.getApiDescriptionFor(domain);

              case 2:
                apiDescriptor = _context26.sent;
                uri = apiDescriptor.capabilities[CapabilityCodes.tokenLogo];
                uri = uri.replace('{contractId}', contractId);
                return _context26.abrupt("return", {
                  uri: uri
                });

              case 6:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function tokenLogo(_x37, _x38) {
        return _tokenLogo.apply(this, arguments);
      }

      return tokenLogo;
    }()
    /**
    * Get token's info json.
    *
    * @param {String} domain - a domain
    * @param {String} contractId - contractId of Token
    */

  }, {
    key: "tokenInformation",
    value: function () {
      var _tokenInformation = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee27(domain, contractId) {
        var apiDescriptor, uri, response;
        return _regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                _context27.next = 2;
                return this.resolver.getApiDescriptionFor(domain);

              case 2:
                apiDescriptor = _context27.sent;
                uri = apiDescriptor.capabilities[CapabilityCodes.tokenInformation];
                uri = uri.replace('{contractId}', contractId);
                _context27.next = 7;
                return this.http.get(uri);

              case 7:
                response = _context27.sent;
                _context27.next = 10;
                return response.json();

              case 10:
                return _context27.abrupt("return", _context27.sent);

              case 11:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function tokenInformation(_x39, _x40) {
        return _tokenInformation.apply(this, arguments);
      }

      return tokenInformation;
    }()
    /**
     * Uses pki flow to query for an identity key for a given paymail address.
     *
     * @param {String} paymail - a paymail address
     */

  }, {
    key: "getPublicKey",
    value: function () {
      var _getPublicKey = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee28(paymail) {
        var identityUrl, response, _yield$response$json, pubkey;

        return _regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return this.resolver.getIdentityUrlFor(paymail);

              case 2:
                identityUrl = _context28.sent;
                _context28.next = 5;
                return this.http.get(identityUrl);

              case 5:
                response = _context28.sent;
                _context28.next = 8;
                return response.json();

              case 8:
                _yield$response$json = _context28.sent;
                pubkey = _yield$response$json.pubkey;
                return _context28.abrupt("return", pubkey);

              case 11:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function getPublicKey(_x41) {
        return _getPublicKey.apply(this, arguments);
      }

      return getPublicKey;
    }()
    /**
     * Uses `Basic Address Resolution` flow to query for a payment for output for the
     * given paymail address.
     *
     * @param {String} aPaymail - a paymail address
     * @param {Object} senderInfo - Object containing sender info
     * @param {String} senderInfo.senderHandle - Sender paymail address
     * @param {String} senderInfo.amount - Optional. Required amount.
     * @param {String} senderInfo.senderName - Optional. Sender name.
     * @param {String} senderInfo.purpose - Optional. Purpose of the payment.
     * @param {String} senderInfo.pubkey - Optional. Public key used to sign the message.
     * @param {String} senderInfo.signature - Optional. Valid signature according to paymail specification.
     * @param {String} privateKey - Optional. private key to sign the request.
     */

  }, {
    key: "getOutputFor",
    value: function () {
      var _getOutputFor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee29(aPaymail, senderInfo) {
        var privateKey,
            addressUrl,
            response,
            _yield$response$json2,
            output,
            _args29 = arguments;

        return _regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                privateKey = _args29.length > 2 && _args29[2] !== undefined ? _args29[2] : null;
                _context29.next = 3;
                return this.resolver.getAddressUrlFor(aPaymail);

              case 3:
                addressUrl = _context29.sent;
                _context29.next = 6;
                return this.http.postJson(addressUrl, this.requestBodyFactory.buildBodyToRequestAddress(senderInfo, privateKey));

              case 6:
                response = _context29.sent;

                if (response.ok) {
                  _context29.next = 9;
                  break;
                }

                throw new PaymailNotFound("Paymail not found: ".concat(aPaymail), aPaymail);

              case 9:
                _context29.next = 11;
                return response.json();

              case 11:
                _yield$response$json2 = _context29.sent;
                output = _yield$response$json2.output;
                return _context29.abrupt("return", output);

              case 14:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function getOutputFor(_x42, _x43) {
        return _getOutputFor.apply(this, arguments);
      }

      return getOutputFor;
    }()
    /**
     * Verify if the given public address belongs to the given
     * paymail address.
     *
     * @param {String} pubkey - Public key to check.
     * @param {String} paymail - a paymail address
     */

  }, {
    key: "verifyPubkeyOwner",
    value: function () {
      var _verifyPubkeyOwner = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee30(pubkey, paymail) {
        var url, response, body, match;
        return _regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return this.resolver.getVerifyUrlFor(paymail, pubkey);

              case 2:
                url = _context30.sent;
                _context30.next = 5;
                return this.http.get(url);

              case 5:
                response = _context30.sent;
                _context30.next = 8;
                return response.json();

              case 8:
                body = _context30.sent;
                match = body.match;
                return _context30.abrupt("return", match);

              case 11:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function verifyPubkeyOwner(_x44, _x45) {
        return _verifyPubkeyOwner.apply(this, arguments);
      }

      return verifyPubkeyOwner;
    }()
    /**
     * Verifies if a given signature is valid for a given message. It uses
     * different strategies depending on the capabilities of the server
     * and the parameters Given. The priority order is.
     * - If paymail is not provided, then normal signature verification is performed.
     * - Use provided key (and check that belongs to given paymail address).
     * - Get a new pubkey for given paymail address using pki.
     * - If there is no way to intereact with the owner of the domain to verify the public key it returns false.
     *
     * @param {Message} message - Message to verify
     * @param {String} signature - Signature
     * @param {String} paymail - Signature owner paymail
     * @param {String} pubkey - Optional. Public key that validates the signature.
     */

  }, {
    key: "isValidSignature",
    value: function () {
      var _isValidSignature = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee31(message, signature) {
        var paymail,
            pubkey,
            senderPublicKey,
            hasPki,
            identityKey,
            senderKeyAddress,
            verified,
            _args31 = arguments;
        return _regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                paymail = _args31.length > 2 && _args31[2] !== undefined ? _args31[2] : null;
                pubkey = _args31.length > 3 && _args31[3] !== undefined ? _args31[3] : null;

                if (!(paymail == null && pubkey === null)) {
                  _context31.next = 4;
                  break;
                }

                throw new Error('Must specify either paymail or pubkey');

              case 4:
                if (!paymail) {
                  _context31.next = 31;
                  break;
                }

                _context31.t0 = pubkey;

                if (!_context31.t0) {
                  _context31.next = 10;
                  break;
                }

                _context31.next = 9;
                return this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.verifyPublicKeyOwner);

              case 9:
                _context31.t0 = _context31.sent;

              case 10:
                if (!_context31.t0) {
                  _context31.next = 20;
                  break;
                }

                _context31.next = 13;
                return this.verifyPubkeyOwner(pubkey, paymail);

              case 13:
                if (!_context31.sent) {
                  _context31.next = 17;
                  break;
                }

                senderPublicKey = this.bsv.PublicKey.fromString(pubkey);
                _context31.next = 18;
                break;

              case 17:
                return _context31.abrupt("return", false);

              case 18:
                _context31.next = 31;
                break;

              case 20:
                _context31.next = 22;
                return this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.pki);

              case 22:
                hasPki = _context31.sent;

                if (!hasPki) {
                  _context31.next = 30;
                  break;
                }

                _context31.next = 26;
                return this.getPublicKey(paymail);

              case 26:
                identityKey = _context31.sent;
                senderPublicKey = this.bsv.PublicKey.fromString(identityKey);
                _context31.next = 31;
                break;

              case 30:
                return _context31.abrupt("return", false);

              case 31:
                senderKeyAddress = this.bsv.Address.fromPublicKey(senderPublicKey || pubkey);
                _context31.prev = 32;
                verified = message.verify(senderKeyAddress.toString(), signature);
                return _context31.abrupt("return", verified);

              case 37:
                _context31.prev = 37;
                _context31.t1 = _context31["catch"](32);
                return _context31.abrupt("return", false);

              case 40:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this, [[32, 37]]);
      }));

      function isValidSignature(_x46, _x47) {
        return _isValidSignature.apply(this, arguments);
      }

      return isValidSignature;
    }()
    /**
     * Gets the public profile information using the "Public Profile" protocol.
     *
     * @param {String} paymail - a paymail address
     * @param {String} s - the preferred size of the image
     */

  }, {
    key: "getPublicProfile",
    value: function () {
      var _getPublicProfile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee32(paymail) {
        var publicProfileUrl, response, body, _yield$response$json3, avatar, name;

        return _regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                _context32.next = 2;
                return this.resolver.getPublicProfileUrlFor(paymail);

              case 2:
                publicProfileUrl = _context32.sent;
                _context32.next = 5;
                return this.http.get(publicProfileUrl);

              case 5:
                response = _context32.sent;

                if (response.ok) {
                  _context32.next = 11;
                  break;
                }

                _context32.next = 9;
                return response.json();

              case 9:
                body = _context32.sent;
                throw new Error("Server failed with: ".concat(JSON.stringify(body)));

              case 11:
                _context32.next = 13;
                return response.json();

              case 13:
                _yield$response$json3 = _context32.sent;
                avatar = _yield$response$json3.avatar;
                name = _yield$response$json3.name;
                return _context32.abrupt("return", {
                  avatar: avatar,
                  name: name
                });

              case 17:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function getPublicProfile(_x48) {
        return _getPublicProfile.apply(this, arguments);
      }

      return getPublicProfile;
    }()
  }, {
    key: "sendRawTx",
    value: function () {
      var _sendRawTx = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee33(targetPaymail, hexTransaction, reference) {
        var metadata,
            receiveTxUrl,
            response,
            body,
            _args33 = arguments;
        return _regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                metadata = _args33.length > 3 && _args33[3] !== undefined ? _args33[3] : {};

                if (hexTransaction) {
                  _context33.next = 3;
                  break;
                }

                throw new Error('transaction hex cannot be empty');

              case 3:
                _context33.next = 5;
                return this.resolver.getSendTxUrlFor(targetPaymail);

              case 5:
                receiveTxUrl = _context33.sent;
                _context33.next = 8;
                return this.http.postJson(receiveTxUrl, this.requestBodyFactory.buildBodySendTx(hexTransaction, reference, metadata));

              case 8:
                response = _context33.sent;

                if (response.ok) {
                  _context33.next = 14;
                  break;
                }

                _context33.next = 12;
                return response.json();

              case 12:
                body = _context33.sent;
                throw new Error("Server failed with: ".concat(JSON.stringify(body)));

              case 14:
                return _context33.abrupt("return", response.json());

              case 15:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function sendRawTx(_x49, _x50, _x51) {
        return _sendRawTx.apply(this, arguments);
      }

      return sendRawTx;
    }()
  }, {
    key: "getP2pPaymentDestination",
    value: function () {
      var _getP2pPaymentDestination = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee34(targetPaymail, satoshis) {
        var paymentDestinationUrl, response, _body, body;

        return _regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                if (satoshis) {
                  _context34.next = 2;
                  break;
                }

                throw new Error('Amount in satohis needs to be specified');

              case 2:
                _context34.next = 4;
                return this.resolver.getP2pPatmentDestinationUrlFor(targetPaymail);

              case 4:
                paymentDestinationUrl = _context34.sent;
                _context34.next = 7;
                return this.http.postJson(paymentDestinationUrl, this.requestBodyFactory.buildBodyP2pPaymentDestination(satoshis));

              case 7:
                response = _context34.sent;

                if (response.ok) {
                  _context34.next = 13;
                  break;
                }

                _context34.next = 11;
                return response.json();

              case 11:
                _body = _context34.sent;
                throw new Error("Server failed with: ".concat(JSON.stringify(_body)));

              case 13:
                _context34.next = 15;
                return response.json();

              case 15:
                body = _context34.sent;

                if (body.outputs) {
                  _context34.next = 18;
                  break;
                }

                throw new Error('Server answered with a wrong format. Missing outputs');

              case 18:
                return _context34.abrupt("return", body);

              case 19:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function getP2pPaymentDestination(_x52, _x53) {
        return _getP2pPaymentDestination.apply(this, arguments);
      }

      return getP2pPaymentDestination;
    }()
  }]);

  return PaymailClient;
}();

export { BrowserDns, CapabilityCodes, Clock, PaymailClient, PaymailNotFound, RequestBodyFactory, VerifiableMessage, brfc };
//# sourceMappingURL=index.esm.js.map
