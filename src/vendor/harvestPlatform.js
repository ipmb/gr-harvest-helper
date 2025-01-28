// extracted from https://platform.harvestapp.com/assets/../js/platform.Jd5zRyN5kQLD.js.map
// export const SNOWPACK_PUBLIC_PACKAGE_VERSION = "9.1.5";
// export const SNOWPACK_PUBLIC_GETHARVEST_HOST = "getharvest.com";
const SNOWPACK_PUBLIC_HARVESTAPP_PLATFORM_HOST = "platform.harvestapp.com";
// export const SNOWPACK_PUBLIC_HARVESTAPP_V2_API_URL = "api.harvestapp.com/v2";
// export const SNOWPACK_PUBLIC_HARVEST_ID_HOST = "id.getharvest.com";
// export const SNOWPACK_PUBLIC_HARVEST_ID_V2_API_URL = "id.getharvest.com/api/v2";
// export const SNOWPACK_PUBLIC_WEBSOCKET_SERVICE_HOST = "harvestapp-websocket.harvestapp.com";
// export const SNOWPACK_PUBLIC_GTM_ID = "GTM-5B6RVD";
// export const SNOWPACK_PUBLIC_SCHEME = "https";
// export const SNOWPACK_PUBLIC_bugsnag_token = "4fdb3b8c1c84c966eb2a379928672998";
// export const MODE = "production";
// export const NODE_ENV = "production";
// export const SSR = false;
// import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
const __SNOWPACK_ENV__ = {SNOWPACK_PUBLIC_HARVESTAPP_PLATFORM_HOST}
// import "./platform.css"

const HarvestPlatformStylesheet = `
.harvest-timer.styled {
    -webkit-font-smoothing: antialiased;
    background-image: linear-gradient(#fff, #eee);
    border: 1px solid #bbb;
    border-radius: 2px;
    color: #222;
    cursor: pointer;
    display: inline-block;
    font: inherit;
    font-size: 0;
    height: 12px;
    line-height: 1;
    margin: 0;
    padding: 3px;
    position: relative;
    vertical-align: top;
    width: 12px;
  }
  .harvest-timer.styled:hover {
    background-image: linear-gradient(#f8f8f8, #e8e8e8);
  }
  .harvest-timer.styled:active {
    background: #eee;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  .harvest-timer.styled::after {
    background: url(//platform.harvestapp.com/img/icon-timer.dzg2GEgNRsgn.svg) 50% 50% no-repeat;
    content: '';
    display: inline-block;
    font: inherit;
    height: 100%;
    left: 0;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .harvest-timer.styled.running {
    background-image: linear-gradient(#53b2fc, #1385e5);
    border-color: #075fa9;
    color: #fff;
  }
  .harvest-timer.styled.running:hover {
    background-image: linear-gradient(#49a4fd, #0e7add);
  }
  .harvest-timer.styled.running:active {
    background: #1385e5;
    box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.2);
  }
  #harvest-iframe {
    background: white;
    border: none;
    border-radius: 6px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
    height: 300px;
    left: 50%;
    margin: 0;
    margin-left: -250px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 0;
    transition: height 150ms;
    width: 500px;
  }
  @media (min-height: 400px) {
    #harvest-iframe {
      top: 10%;
    }
  }
  @media (min-height: 550px) {
    #harvest-iframe {
      top: 20%;
    }
  }
  .harvest-overlay {
    background: rgba(0, 0, 0, 0.6);
    height: 100%;
    left: 0;
    opacity: 1;
    overflow: scroll;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9998;
  }`

const scheme = __SNOWPACK_ENV__.SNOWPACK_PUBLIC_SCHEME || 'https'
const baseUrl = `${scheme}://${__SNOWPACK_ENV__.SNOWPACK_PUBLIC_HARVESTAPP_PLATFORM_HOST}`

/* eslint-disable */
// ☃  fixes unicode issues
// TODO: Bring in changes from Harvest as they come until Platform V2 becomes it's own thing
;(function () {
  let HarvestPlatform,
    LightBox,
    config,
    createPermalink,
    getData,
    getValue,
    lightbox,
    listenForEvent,
    param,
    setTimer,
    stopTimer,
    worker,
    xdm
  LightBox = class LightBox {
    constructor() {
      this.el = document.createElement('div')
      this.el.className = 'harvest-overlay'
      this.iframe = document.createElement('iframe')
      this.iframe.id = 'harvest-iframe'
      this.el.appendChild(this.iframe)
      this.el.addEventListener('click', (evt) => {
        return this.close()
      })
      document.addEventListener('keyup', ({ which }) => {
        if (which === 27) {
          return this.close()
        }
      })
    }

    open(url) {
      this.iframe.src = url
      return document.body.appendChild(this.el)
    }

    adjustHeight(height) {
      return (this.iframe.style.height = `${height}px`)
    }

    close() {
      let ref
      return (ref = this.el.parentNode) != null
        ? ref.removeChild(this.el)
        : void 0
    }
  }
  lightbox = new LightBox()
  // Append the worker iframe
  worker = document.createElement('iframe')
  worker.hidden = true
  worker.src = `${baseUrl}/platform/worker`
  document.body.appendChild(worker)
  if (!(xdm = document.getElementById('harvest-messaging'))) {
    xdm = document.createElement('div')
    xdm.id = 'harvest-messaging'
    xdm.hidden = true
    document.body.appendChild(xdm)
  }
  param = function (params) {
    let name, value
    return (function () {
      let results
      results = []
      for (name in params) {
        value = params[name]
        if (value != null) {
          results.push(`${name}=${encodeURIComponent(value)}`)
        }
      }
      return results
    })().join('&')
  }
  config = function () {
    if (window._harvestPlatformConfig) {
      return window._harvestPlatformConfig;
    } else {
      const platformConfigScript = document.querySelector('script[data-platform-config]');
      if (platformConfigScript) {
        return JSON.parse(platformConfigScript.dataset.platformConfig);
      } else {
        console.error('Error: Platform config script not found.');
        return {}; // Return a fallback empty object or handle appropriately
      }
    }
  };
  // Get data attributes from a given element

  // el - HTMLElement containing data attributes as JSON strings

  // Return an Object containing data attributes from the element
  getData = function (el) {
    let data, i, key, len, ref
    data = {}
    ref = ['account', 'item', 'group', 'default', 'skip-styling']
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i]
      data[key] = getValue(el, key)
    }
    if (data.group == null) {
      data.group = getValue(el, 'project')
    }
    data.permalink = el.getAttribute('data-permalink')
    return data
  }
  getValue = function (el, key) {
    let value
    value = (function () {
      let ref
      try {
        return JSON.parse(
          (ref = el.getAttribute(`data-${key}`)) != null ? ref : 'null'
        )
      } catch (error) {}
    })()
    if ((value != null ? value.id : void 0) != null) {
      value.id = '' + value.id
    }
    return value
  }
  setTimer = function (data) {
    let child, el, group, i, item, len, ref, ref1, ref2, results
    ref = document.querySelectorAll('.harvest-timer')
    results = []
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i]
      ;({ group, item } = getData(el))
      if (
        data == null ||
        (group != null ? group.id : void 0) !==
          ((ref1 = data.group) != null ? ref1.id : void 0) ||
        (item != null ? item.id : void 0) !==
          ((ref2 = data.item) != null ? ref2.id : void 0)
      ) {
        el.classList.remove('running')
        results.push(
          (function () {
            let j, len1, ref3, results1
            ref3 = el.children
            results1 = []
            for (j = 0, len1 = ref3.length; j < len1; j++) {
              child = ref3[j]
              results1.push(child.classList.remove('running'))
            }
            return results1
          })()
        )
      } else {
        el.classList.add('running')
        results.push(
          (function () {
            let j, len1, ref3, results1
            ref3 = el.children
            results1 = []
            for (j = 0, len1 = ref3.length; j < len1; j++) {
              child = ref3[j]
              results1.push(child.classList.add('running'))
            }
            return results1
          })()
        )
      }
    }
    return results
  }
  stopTimer = function () {
    return setTimer(null)
  }
  // Construct a permalink

  // template - String representing the template to be used for the permalink
  // data - Object containing the data used for replacement of variables in the
  //        template
  createPermalink = function (template, data) {
    if (template != null && data != null) {
      if (data.account != null) {
        template = template.replace('%ACCOUNT_ID%', data.account.id)
      }
      if (data.group != null) {
        template = template.replace('%PROJECT_ID%', data.group.id)
      }
      if (data.group != null) {
        template = template.replace('%GROUP_ID%', data.group.id)
      }
      if (data.item != null) {
        template = template.replace('%ITEM_ID%', data.item.id)
      }
    }
    return template
  }
  listenForEvent = function (name, handler) {
    if (window.jQuery != null) {
      return window.jQuery(xdm).bind(name, handler)
    } else {
      return xdm.addEventListener(name, handler)
    }
  }
  // Handle messages from the worker iframe
  // and the Platform timer page.
  window.addEventListener('message', function (evt) {
    if (evt.origin !== baseUrl) {
      return
    }

    const data = evt.data

    let id, group_id, type, value
    ;({ type, value } = data != null ? data : {})
    switch (type) {
      case 'frame:close':
        return lightbox.close()
      case 'frame:resize':
        return lightbox.adjustHeight(value)
      case 'timer:started':
        ({ id, group_id } = value.external_reference)
        return setTimer({
          group: {
            id: group_id,
          },
          item: {
            id: id,
          },
        })
      case 'timer:stopped':
        return stopTimer()
    }
  })
  HarvestPlatform = class HarvestPlatform {
    constructor({ stylesheet }) {
      let event, styleNode
      // Note: This event listener should be used when the harvest-timer elements
      // have already been added to the target page.
      this.addTimers = this.addTimers.bind(this)
      // Find all timer elements in the DOM
      this.findTimers = this.findTimers.bind(this)
      this.stylesheet = stylesheet
      styleNode = document.createElement('style')
      document.head.appendChild(styleNode)
      styleNode.appendChild(document.createTextNode(this.stylesheet))
      listenForEvent('harvest-event:timers:add', this.addTimers)
      listenForEvent('harvest-event:timers:chrome:add', this.findTimers)
      this.findTimers()
      xdm.setAttribute('data-ready', true)
      event = document.createEvent('CustomEvent')
      event.initCustomEvent('harvest-event:ready', true, true, {})
      ;(document.body || xdm).dispatchEvent(event)
    }

    addTimers(e) {
      let element, ref, ref1, ref2
      element =
        e.element ||
        ((ref = e.originalEvent) != null
          ? (ref1 = ref.detail) != null
            ? ref1.element
            : void 0
          : void 0) ||
        ((ref2 = e.detail) != null ? ref2.element : void 0) // dispatchEvent, handled with addEventListener
      if ((element != null ? element.jquery : void 0) != null) {
        element = element.get(0)
      }
      if (element) {
        return this.findTimer(element)
      }
    }

    findTimers() {
      let element, elements, i, len, results, selector
      selector = '.harvest-timer:not([data-listening])'
      elements = document.querySelectorAll(selector)
      results = []
      for (i = 0, len = elements.length; i < len; i++) {
        element = elements[i]
        results.push(this.findTimer(element))
      }
      return results
    }

    // Find the timer associated with the given element

    // element - HTMLElement representing a timer
    findTimer(element) {
      let skipAttr, skipStyling
      skipAttr = element.getAttribute('data-skip-styling')
      skipStyling =
        config().skipStyling ||
        element.classList.contains('styled') ||
        (skipAttr != null && skipAttr !== false && skipAttr !== 'false')
      if (!skipStyling) {
        element.classList.add('styled')
      }
      element.addEventListener('click', (e) => {
        e.stopPropagation()
        return this.openIframe(getData(element))
      })
      return element.setAttribute('data-listening', true)
    }

    // Open a timer dialog for the given timer and pass the given timer data

    // timer - HTMLElement representing the harvest-timer
    // data - Object containing the timer data
    openIframe(data) {
      let getParams, ref, ref1, ref2, ref3, ref4, ref5, ref6
      getParams = {
        app_name: config().applicationName,
        service: data.service || window.location.hostname,
        permalink: data.permalink || createPermalink(config().permalink, data),
        external_account_id: (ref = data.account) != null ? ref.id : void 0,
        external_group_id: (ref1 = data.group) != null ? ref1.id : void 0,
        external_group_name: (ref2 = data.group) != null ? ref2.name : void 0,
        external_item_id: (ref3 = data.item) != null ? ref3.id : void 0,
        external_item_name: (ref4 = data.item) != null ? ref4.name : void 0,
        default_project_code:
          (ref5 = data.default) != null ? ref5.project_code : void 0,
        default_project_name:
          (ref6 = data.default) != null ? ref6.project_name : void 0,
      }
      return lightbox.open(`${baseUrl}/platform/timer?${param(getParams)}`)
    }
  }
  if (window.postMessage == null) {
    return typeof console !== 'undefined' && console !== null
      ? console.warn(`Harvest Platform is disabled.
To start and stop timers, cross-domain messaging must be supported
by your browser.`)
      : void 0
  } else if (
    !window.XMLHttpRequest ||
    !('withCredentials' in new XMLHttpRequest())
  ) {
    return typeof console !== 'undefined' && console !== null
      ? console.warn(`Harvest Platform is disabled.
To check for running timers, xhr requests with credentials must be
supported by your browser.`)
      : void 0
  } else if (self.HarvestPlatform != null) {
    return self.HarvestPlatform.findTimers()
  } else {
    return (self.HarvestPlatform = new HarvestPlatform({
      stylesheet: HarvestPlatformStylesheet,
    }))
  }
})()
/* eslint-enable */
