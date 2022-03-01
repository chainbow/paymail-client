import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import "core-js/modules/es.string.trim.js";
import "core-js/modules/es.regexp.to-string.js";
import "core-js/modules/es.array.reverse.js";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.split.js";
import "core-js/modules/es.string.replace.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/web.url-search-params.js";
import "core-js/modules/es.string.match.js";
import Promise$1 from 'bluebird';
import fetch from 'cross-fetch';

const bsv = require('bsv');

const brfc = (title, authors, version) => {
  const autorString = authors.join(', ').trim();
  const stringToHash = [title.trim() + autorString + (version.toString() || '')].join('').trim();
  let hash = bsv.crypto.Hash.sha256sha256(Buffer.from(stringToHash));
  hash = hash.reverse();
  return hash.toString('hex').substring(0, 12);
};

const CapabilityCodes = {
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

class DnsOverHttps {
  constructor(fetch, config) {
    this.fetch = fetch;
    this.config = config;
  }

  async resolveSrv(aDomain) {
    const response = await this.fetch("".concat(this.config.baseUrl, "?name=").concat(aDomain, "&type=SRV&cd=0"));
    const body = await response.json();
    return body;
  }

  async queryBsvaliasDomain(aDomain) {
    return this.resolveSrv("_bsvalias._tcp.".concat(aDomain));
  }

}

class DnsClient {
  constructor(dns, fetch) {
    this.dns = dns;
    this.dohAli = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.alidns.com/resolve'
    });
    this.dohGoogle = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.google.com/resolve'
    });
  }

  async checkSrv(aDomain) {
    return new Promise$1((resolve, reject) => {
      this.dns.resolveSrv("_bsvalias._tcp.".concat(aDomain), async (err, result) => {
        try {
          if (err && (err.code === 'ENODATA' || err.code === 'ENOTFOUND')) {
            return resolve({
              domain: aDomain,
              port: 443,
              isSecure: true
            });
          }

          if (err) {
            return reject(err);
          }

          const {
            name: domainFromDns,
            port,
            isSecure
          } = result[0];
          resolve({
            domain: domainFromDns,
            port,
            isSecure: this.checkDomainIsSecure(domainFromDns, aDomain) || isSecure
          });
        } catch (err) {
          return reject(err);
        }
      });
    }).then(result => {
      if (result.isSecure) {
        return result;
      } else {
        return this.validateDnssec(aDomain);
      }
    }, err => {
      console.error(err);
      return err;
    });
  }

  checkDomainIsSecure(srvResponseDomain, originalDomain) {
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

  isMoneyButtonDomain(aDomain) {
    return this.domainsAreEqual(aDomain, 'moneybutton.com') || this.domainsAreEqual(aDomain, 'www.moneybutton.com');
  }

  responseIsWwwSubdomain(srvResponseDomain, originalDomain) {
    return this.domainsAreEqual(srvResponseDomain, "www.".concat(originalDomain));
  }

  isHandcashDomain(aDomain) {
    return this.domainsAreEqual('handcash.io', aDomain);
  }

  isHandcashInternalDomain(aDomain) {
    return this.domainsAreEqual('internal.handcash.io', aDomain);
  }

  async validateDnssec(aDomain) {
    const dnsResponse = await Promise$1.any([this.dohAli.queryBsvaliasDomain(aDomain), this.dohGoogle.queryBsvaliasDomain(aDomain)]);

    if (dnsResponse.Status !== 0 || !dnsResponse.Answer) {
      throw new Error('Insecure domain.');
    }

    const data = dnsResponse.Answer[0].data.split(' ');
    const port = data[2];
    const responseDomain = data[3]; // if (!dnsResponse.AD && !this.domainsAreEqual(aDomain, responseDomain)) {
    //   throw new Error('Insecure domain.')
    // }

    return {
      port,
      domain: responseDomain,
      isSecure: dnsResponse.AD
    };
  }

  domainsAreEqual(domain1, domain2) {
    return domain1.toLowerCase().replace(/\.$/, '') === domain2.toLowerCase().replace(/\.$/, '');
  }

}

class Http {
  constructor(fetch) {
    this.fetch = fetch;
  }

  async get(url) {
    return this._basicRequest(url);
  }

  async postJson(url, body) {
    return this._basicRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }

  async _basicRequest(url) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const timeout = 5000;
    return Promise.race([this.fetch(url, _objectSpread(_objectSpread({}, options), {}, {
      credentials: 'omit'
    })), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))]);
  }

}

class EndpointResolver {
  constructor() {
    let dns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let fetch = arguments.length > 1 ? arguments[1] : undefined;
    this.dnsClient = new DnsClient(dns, fetch);
    this.http = new Http(fetch);
    this._cache = {};
  }

  static create(dnsClient, fetch) {
    const instance = new EndpointResolver(null, fetch);
    instance.dnsClient = dnsClient;
    return instance;
  }

  async getIdentityUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.pki);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const identityUrl = apiDescriptor.capabilities.pki.replace('{alias}', alias).replace('{domain.tld}', domain);
    return identityUrl;
  }

  async getAddressUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.paymentDestination);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const addressUrl = apiDescriptor.capabilities.paymentDestination.replace('{alias}', alias).replace('{domain.tld}', domain);
    return addressUrl;
  }

  async getVerifyUrlFor(aPaymail, aPubkey) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.verifyPublicKeyOwner);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.verifyPublicKeyOwner].replace('{alias}', alias).replace('{domain.tld}', domain).replace('{pubkey}', aPubkey);
    return url;
  }

  async getPublicProfileUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.publicProfile);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.publicProfile].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getSendTxUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.receiveTransaction);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.receiveTransaction].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async getP2pPatmentDestinationUrlFor(aPaymail) {
    const [alias, domain] = aPaymail.split('@');
    await this.ensureCapabilityFor(domain, CapabilityCodes.p2pPaymentDestination);
    const apiDescriptor = await this.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.p2pPaymentDestination].replace('{alias}', alias).replace('{domain.tld}', domain);
    return url;
  }

  async domainHasCapability(aDomain, capability) {
    const apiDescriptor = await this.getApiDescriptionFor(aDomain);
    return !!apiDescriptor.capabilities[capability];
  }

  async getApiDescriptionFor(aDomain) {
    if (this._cache[aDomain]) {
      return this._cache[aDomain];
    }

    const {
      domain,
      port
    } = await this.getWellKnownBaseUrl(aDomain);
    const apiDescriptor = await this.fetchApiDescriptor(domain, port);
    this._cache[aDomain] = apiDescriptor;
    return apiDescriptor;
  }

  async fetchApiDescriptor(domain, port) {
    const protocol = domain === 'localhost' || domain === 'localhost.' ? 'http' : 'https';
    const requestPort = port === undefined || port.toString() === '443' ? '' : ":".concat(port);
    const requestDomain = /^(.*?)\.?$/.exec(domain)[1]; // Get value from capture group

    if (!requestDomain) {
      throw new Error("Invalid domain: ".concat(domain));
    }

    const wellKnown = await this.http.get("".concat(protocol, "://").concat(requestDomain).concat(requestPort, "/.well-known/bsvalias"));
    const apiDescriptor = await wellKnown.json();
    return apiDescriptor;
  }

  async getWellKnownBaseUrl(aDomain) {
    return this.dnsClient.checkSrv(aDomain);
  }

  async ensureCapabilityFor(aDomain, aCapability) {
    if (!(await this.domainHasCapability(aDomain, aCapability))) {
      throw new Error("Unknown capability \"".concat(aCapability, "\" for \"").concat(aDomain, "\""));
    }
  }

}

class VerifiableMessage {
  constructor(parts) {
    let bsv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (bsv === null) {
      bsv = require('bsv');
      bsv.Message = require('bsv/message');
    }

    this.bsv = bsv;
    const concatenated = Buffer.from(parts.join(''));
    this.message = new this.bsv.Message(concatenated);
  }

  static forBasicAddressResolution(_ref) {
    let {
      senderHandle,
      amount,
      dt,
      purpose
    } = _ref;

    if (dt && dt.toISOString) {
      dt = dt.toISOString();
    }

    return new VerifiableMessage([senderHandle, amount || '0', dt, purpose]);
  }

  sign(wifPrivateKey) {
    return this.message.sign(this.bsv.PrivateKey.fromWIF(wifPrivateKey));
  }

  verify(keyAddress, signature) {
    return this.message.verify(keyAddress, signature);
  }

}

class RequestBodyFactory {
  constructor(clock) {
    this.clock = clock;
  }

  buildBodyToRequestAddress(senderInfo) {
    let privateKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const {
      senderHandle,
      amount,
      senderName,
      purpose,
      pubkey,
      signature: providedSignature
    } = senderInfo;

    if (!providedSignature && privateKey === null) {
      throw new Error('Missing private key or signature');
    }

    let dt, signature;

    if (providedSignature) {
      if (!senderInfo.dt) {
        throw new Error('missing datetime for given signature');
      }

      dt = senderInfo.dt;
      signature = providedSignature;
    } else {
      dt = this.clock.now();
      signature = VerifiableMessage.forBasicAddressResolution({
        senderHandle,
        amount,
        dt,
        purpose
      }).sign(privateKey);
    }

    return {
      senderHandle,
      senderName,
      purpose,
      dt,
      amount: amount || null,
      pubkey,
      signature
    };
  }

  buildBodySendTx(hexTransaction, reference, metadata) {
    return {
      hex: hexTransaction,
      metadata,
      reference
    };
  }

  buildBodyP2pPaymentDestination(satoshis) {
    return {
      satoshis
    };
  }

}

class Clock {
  now() {
    return new Date();
  }

}

class PaymailNotFound extends Error {
  constructor(message, paymail) {
    super(message);
    this.paymail = paymail;
  }

}

class BrowserDns {
  constructor(fetch) {
    this.dohAli = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.alidns.com/resolve'
    });
    this.dohGoogle = new DnsOverHttps(fetch, {
      baseUrl: 'https://dns.google.com/resolve'
    });
  }

  async resolveSrv(aDomain, aCallback) {
    try {
      const response = await Promise$1.any([this.dohAli.resolveSrv(aDomain), this.dohGoogle.resolveSrv(aDomain)]);

      if (response.Status === 0 && response.Answer) {
        const data = response.Answer.map(record => {
          const [priority, weight, port, name] = record.data.split(' ');
          return {
            priority,
            weight,
            port,
            name,
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
    } catch (e) {
      aCallback(e);
    }
  }

}

class PaymailClient {
  constructor() {
    let dns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let fetch2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let clock = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let bsv = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

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


  async witnessPublic(domain) {
    const apiDescriptor = await this.resolver.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.witnessPublic];
    const response = await this.http.get(url);
    return await response.json();
  }
  /**
   * witness check baton.
   *
   * @param {String} domain - a domain
   */


  async witnessCheckBaton(domain, args) {
    const apiDescriptor = await this.resolver.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckBaton];
    const response = await this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));
    return await response.json();
  }
  /**
   * witness check token.
   *
   * @param {String} domain - a domain
   */


  async witnessCheckToken(domain, args) {
    const apiDescriptor = await this.resolver.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckToken];
    const response = await this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));
    return await response.json();
  }
  /**
  * witness check sale contract.
  *
  * @param {String} domain - a domain
  */


  async witnessCheckSale(domain, args) {
    const apiDescriptor = await this.resolver.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckSale];
    const response = await this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));
    return await response.json();
  }
  /**
  * witness check buy contract.
  *
  * @param {String} domain - a domain
  */


  async witnessCheckBuy(domain, args) {
    const apiDescriptor = await this.resolver.getApiDescriptionFor(domain);
    const url = apiDescriptor.capabilities[CapabilityCodes.witnessCheckBuy];
    const response = await this.http.get("".concat(url, "?").concat(new URLSearchParams(args)));
    return await response.json();
  }
  /**
   * Get token's logo uri.
   *
   * @param {String} domain - a domain
   * @param {String} contractId - contractId of Token
   * return uri string
   */


  async tokenLogo(domain, contractId) {
    const apiDescriptor = await this.resolver.getApiDescriptionFor(domain);
    let uri = apiDescriptor.capabilities[CapabilityCodes.tokenLogo];
    uri = uri.replace('{contractId}', contractId);
    return {
      uri
    };
  }
  /**
  * Get token's info json.
  *
  * @param {String} domain - a domain
  * @param {String} contractId - contractId of Token
  */


  async tokenInformation(domain, contractId) {
    const apiDescriptor = await this.resolver.getApiDescriptionFor(domain);
    let uri = apiDescriptor.capabilities[CapabilityCodes.tokenInformation];
    uri = uri.replace('{contractId}', contractId);
    const response = await this.http.get(uri);
    return await response.json();
  }
  /**
   * Uses pki flow to query for an identity key for a given paymail address.
   *
   * @param {String} paymail - a paymail address
   */


  async getPublicKey(paymail) {
    const identityUrl = await this.resolver.getIdentityUrlFor(paymail);
    const response = await this.http.get(identityUrl);
    const {
      pubkey
    } = await response.json();
    return pubkey;
  }
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


  async getOutputFor(aPaymail, senderInfo) {
    let privateKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    const addressUrl = await this.resolver.getAddressUrlFor(aPaymail);
    const response = await this.http.postJson(addressUrl, this.requestBodyFactory.buildBodyToRequestAddress(senderInfo, privateKey));

    if (!response.ok) {
      throw new PaymailNotFound("Paymail not found: ".concat(aPaymail), aPaymail);
    }

    const {
      output
    } = await response.json();
    return output;
  }
  /**
   * Verify if the given public address belongs to the given
   * paymail address.
   *
   * @param {String} pubkey - Public key to check.
   * @param {String} paymail - a paymail address
   */


  async verifyPubkeyOwner(pubkey, paymail) {
    const url = await this.resolver.getVerifyUrlFor(paymail, pubkey);
    const response = await this.http.get(url);
    const body = await response.json();
    const {
      match
    } = body;
    return match;
  }
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


  async isValidSignature(message, signature) {
    let paymail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let pubkey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    if (paymail == null && pubkey === null) {
      throw new Error('Must specify either paymail or pubkey');
    }

    let senderPublicKey;

    if (paymail) {
      if (pubkey && (await this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.verifyPublicKeyOwner))) {
        if (await this.verifyPubkeyOwner(pubkey, paymail)) {
          senderPublicKey = this.bsv.PublicKey.fromString(pubkey);
        } else {
          return false;
        }
      } else {
        const hasPki = await this.resolver.domainHasCapability(paymail.split('@')[1], CapabilityCodes.pki);

        if (hasPki) {
          const identityKey = await this.getPublicKey(paymail);
          senderPublicKey = this.bsv.PublicKey.fromString(identityKey);
        } else {
          return false;
        }
      }
    }

    const senderKeyAddress = this.bsv.Address.fromPublicKey(senderPublicKey || pubkey);

    try {
      const verified = message.verify(senderKeyAddress.toString(), signature);
      return verified;
    } catch (err) {
      return false;
    }
  }
  /**
   * Gets the public profile information using the "Public Profile" protocol.
   *
   * @param {String} paymail - a paymail address
   * @param {String} s - the preferred size of the image
   */


  async getPublicProfile(paymail) {
    const publicProfileUrl = await this.resolver.getPublicProfileUrlFor(paymail);
    const response = await this.http.get(publicProfileUrl);

    if (!response.ok) {
      const body = await response.json();
      throw new Error("Server failed with: ".concat(JSON.stringify(body)));
    }

    const {
      avatar,
      name
    } = await response.json();
    return {
      avatar,
      name
    };
  }

  async sendRawTx(targetPaymail, hexTransaction, reference) {
    let metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (!hexTransaction) {
      throw new Error('transaction hex cannot be empty');
    }

    const receiveTxUrl = await this.resolver.getSendTxUrlFor(targetPaymail);
    const response = await this.http.postJson(receiveTxUrl, this.requestBodyFactory.buildBodySendTx(hexTransaction, reference, metadata));

    if (!response.ok) {
      const body = await response.json();
      throw new Error("Server failed with: ".concat(JSON.stringify(body)));
    }

    return response.json();
  }

  async getP2pPaymentDestination(targetPaymail, satoshis) {
    if (!satoshis) {
      throw new Error('Amount in satohis needs to be specified');
    }

    const paymentDestinationUrl = await this.resolver.getP2pPatmentDestinationUrlFor(targetPaymail);
    const response = await this.http.postJson(paymentDestinationUrl, this.requestBodyFactory.buildBodyP2pPaymentDestination(satoshis));

    if (!response.ok) {
      const body = await response.json();
      throw new Error("Server failed with: ".concat(JSON.stringify(body)));
    }

    const body = await response.json();

    if (!body.outputs) {
      throw new Error('Server answered with a wrong format. Missing outputs');
    }

    return body;
  }

}

export { BrowserDns, CapabilityCodes, Clock, PaymailClient, PaymailNotFound, RequestBodyFactory, VerifiableMessage, brfc };
//# sourceMappingURL=index.esm.js.map
