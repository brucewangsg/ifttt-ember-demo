"use strict";



define('ifttt-ember/app', ['exports', 'ifttt-ember/resolver', 'ember-load-initializers', 'ifttt-ember/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('ifttt-ember/components/if-equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    isEqual: function () {
      return this.get('param1') === this.get('param2');
    }.property('param1', 'param2')
  });
});
define('ifttt-ember/components/service-dropdown', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    showDropdown: null,
    _cancelDropdownFunc: null,

    // listen to change for showDropdown state
    showThisDropdownDidChange: Ember.observer('showDropdown', function () {
      if (this.get('showDropdown') == false) {
        // emit dropdownDidClose action when it changes to false
        this.get("dropdownDidClose")();

        if (this._cancelDropdownFunc) {
          this._cancelDropdownFunc();
          this._cancelDropdownFunc = null;
        }
      } else if (this.get('showDropdown') == true) {
        // when it changed to close, hook an event to close dropdown when document get clicked
        // hide popup when click happens on document

        var dropdownMenu = $(this.get('element'));
        var originalParent = dropdownMenu.parent();
        if ($(window).width() <= 480) {
          // on mobile
          dropdownMenu.appendTo(document.body);
        }

        // assigning cancel dropdown func
        this._cancelDropdownFunc = function (oThis) {
          return function (ev) {
            if (ev) {
              if ($(ev.target).parents('.dropdown-menu:first')[0]) {
                return;
              }
            }

            $(document).unbind('mousedown', oThis._cancelDropdownFunc);
            $(document).unbind('touchstart', oThis._cancelDropdownFunc);

            // set flag to false to hide it
            oThis.set('showDropdown', false);
            dropdownMenu.appendTo(originalParent);
          };
        }(this);

        $(document).bind('mousedown', this._cancelDropdownFunc);
        $(document).bind('touchstart', this._cancelDropdownFunc);
      }
    }),

    actions: {

      // when one of the item get chosen, trigger onItemSelected action, and close dropdown
      chooseItem: function chooseItem(item) {
        this.get('onItemSelected')(item);
        this.set('showDropdown', false);
      }
    }
  });
});
define('ifttt-ember/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('ifttt-ember/controllers/applet', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    actions: {
      toggleDropdown: function toggleDropdown(key) {
        var model = this.get('model');
        model.set(key, true);
      },

      toggleDropdownDidClose: function toggleDropdownDidClose(key) {
        var model = this.get('model');
        model.set(key, false);
      },
      chooseTriggerService: function chooseTriggerService(item) {
        var model = this.get('model');
        model.set('selectedTriggerService', item);
        model.set('showThisDropdown', false);

        this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code);
      },
      chooseActionService: function chooseActionService(item) {
        var model = this.get('model');
        model.set('selectedActionService', item);
        model.set('showThatDropdown', false);

        this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id + '/' + model.selectedActionService.code);
      },
      chooseTrigger: function chooseTrigger(item) {
        var model = this.get('model');
        model.set('selectedTrigger', item);
        model.set('showTriggerDropdown', false);

        this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id);
      },
      chooseAction: function chooseAction(item) {
        var model = this.get('model');
        model.set('selectedAction', item);
        model.set('showActionDropdown', false);

        this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id + '/' + model.selectedActionService.code + '/' + model.selectedAction.id);
      },
      /*
        done with trigger scene
      */
      continueSelectingAction: function continueSelectingAction() {
        var model = this.get('model');
        if (model.get('isValidTrigger')) {
          model.set('isTriggerSceneDone', true);
        }
      },
      /*
        allow modification of trigger parameters after we are done with trigger scene, 
        sort of back to editing trigger scene
      */
      backToTriggerEditing: function backToTriggerEditing() {
        var model = this.get('model');
        model.set('isTriggerSceneDone', false);
      },
      backToActionEditing: function backToActionEditing() {
        var model = this.get('model');
        model.set('isActionSceneDone', false);
      },
      /*
        done with action scene
      */
      finalizeAction: function finalizeAction() {
        var model = this.get('model');
        if (model.get('isValidAction')) {
          model.set('isActionSceneDone', true);
        }
      },
      setTriggerAttribute: function setTriggerAttribute(key, value) {
        var model = this.get('model');
        model.set('triggerAttributes.' + key, value);
        model.set(key + 'FocusIn', false);

        if (key == 'address') {
          model.verifyAddress();
        }
      },
      setActionAttribute: function setActionAttribute(key, value) {
        var model = this.get('model');
        model.set('actionAttributes.' + key, value);
        model.set(key + 'FocusIn', false);

        if (key == 'email') {
          model.verifyEmail();
        }
      },
      setFocusFlag: function setFocusFlag() {
        var model = this.get('model');
        model.set(key + 'FocusIn', true);
      },
      saveAndSubmit: function saveAndSubmit() {
        var model = this.get('model');
        model.set('isAllDone', true);
      }
    }
  });
});
define('ifttt-ember/helpers/app-version', ['exports', 'ifttt-ember/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('ifttt-ember/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('ifttt-ember/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('ifttt-ember/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'ifttt-ember/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('ifttt-ember/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('ifttt-ember/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ifttt-ember/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('ifttt-ember/initializers/export-application-global', ['exports', 'ifttt-ember/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('ifttt-ember/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('ifttt-ember/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('ifttt-ember/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("ifttt-ember/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('ifttt-ember/models/applet-state', ['exports', 'ember-data', 'ifttt-ember/models/mockapi'], function (exports, _emberData, _mockapi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _EmberObject$extend;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  exports.default = Ember.Object.extend((_EmberObject$extend = {
    selectedTriggerService: null,
    selectedTrigger: null,
    triggerServices: [],
    triggers: [],

    selectedActionService: null,
    selectedAction: null,
    actionServices: [],
    actions: [],

    isValidTrigger: false,
    isValidAction: false,

    showThisDropdown: false,
    showThatDropdown: false,
    showTriggerDropdown: false,
    showActionDropdown: false,

    // are we still editing trigger customization?
    isTriggerSceneDone: false,

    // are we still editing action customization?
    isActionSceneDone: false,

    allDone: false,

    triggerAttributes: {
      address: null
    },

    triggerAddressDidChange: Ember.observer('triggerAttributes.address', function () {
      var oThis = this;
      if (this.get('addressFocusIn')) {
        // if on input focus, don't verify
        return;
      }

      this.verifyAddress();
    }),

    verifyAddress: function verifyAddress() {
      var val = this.get('triggerAttributes.address') + '';
      if (val && val.length > 0) {
        var re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
        var isValid = re.test(val.toString().toLowerCase());
        if (isValid && !val.match(/^http/)) {
          val = 'https://' + val;
          this.set('triggerAttributes.address', val);
        }
      }

      var re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
      var isValid = re.test(val.toString().toLowerCase());
      this.set("isValidTrigger", isValid);
      this.set("wrongURL", !isValid);
    },

    actionAttributes: {
      email: null
    }

  }, _defineProperty(_EmberObject$extend, 'triggerAddressDidChange', Ember.observer('actionAttributes.email', function () {
    var oThis = this;
    if (this.get('emailFocusIn')) {
      // if on input focus, don't verify
      return;
    }

    this.verifyAddress();
  })), _defineProperty(_EmberObject$extend, 'verifyEmail', function verifyEmail() {
    var val = this.get('actionAttributes.email') + '';

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isValid = re.test(val.toString().toLowerCase());
    this.set("isValidAction", isValid);
    this.set("wrongEmail", !isValid);
  }), _defineProperty(_EmberObject$extend, 'selectedTriggerAndEdit', Ember.computed('selectedTrigger', 'isTriggerSceneDone', function () {
    return this.get('selectedTrigger') && !this.get('isTriggerSceneDone');
  })), _defineProperty(_EmberObject$extend, 'selectedTriggerHasImplementation', Ember.computed('selectedTrigger', function () {
    // right now, only the first trigger is implemented
    return this.get('selectedTrigger') && this.get('selectedTrigger').id == 1;
  })), _defineProperty(_EmberObject$extend, 'selectedTriggerAndDone', Ember.computed('selectedTrigger', 'isTriggerSceneDone', function () {
    return this.get('selectedTrigger') && this.get('isTriggerSceneDone');
  })), _defineProperty(_EmberObject$extend, 'selectedTriggerDidChange', Ember.observer('selectedTriggerService', function () {
    var oThis = this;
    _mockapi.default.get("/api/triggers", { trigger_service_id: this.get('selectedTriggerService').id }, function (newTriggers) {
      var triggers = oThis.get("triggers");
      triggers.clear();
      for (var i = 0, len = newTriggers.length; i < len; i++) {
        triggers.pushObject(newTriggers[i]);
      }
    });

    _mockapi.default.get("/api/actionServices", { trigger_service_id: this.get('selectedTriggerService').id }, function (newActionServices) {
      var actionServices = oThis.get("actionServices");
      actionServices.clear();
      for (var i = 0, len = newActionServices.length; i < len; i++) {
        actionServices.pushObject(newActionServices[i]);
      }
    });
  })), _defineProperty(_EmberObject$extend, 'selectedActionHasImplementation', Ember.computed('selectedAction', function () {
    // right now, only the first action is implemented
    return this.get('selectedAction') && this.get('selectedAction').id == 1;
  })), _defineProperty(_EmberObject$extend, 'selectedActionAndEdit', Ember.computed('selectedAction', 'isActionSceneDone', function () {
    return this.get('selectedAction') && !this.get('isActionSceneDone');
  })), _defineProperty(_EmberObject$extend, 'selectedActionAndDone', Ember.computed('selectedAction', 'isActionSceneDone', function () {
    return this.get('selectedAction') && this.get('isActionSceneDone');
  })), _defineProperty(_EmberObject$extend, 'selectedActionDidChange', Ember.observer('selectedActionService', function () {
    var oThis = this;
    _mockapi.default.get("/api/actions", { action_service_id: this.get('selectedActionService').id }, function (newActions) {
      var actions = oThis.get("actions");
      actions.clear();
      for (var i = 0, len = newActions.length; i < len; i++) {
        actions.pushObject(newActions[i]);
      }
    });
  })), _defineProperty(_EmberObject$extend, 'readyToSubmit', Ember.computed('isTriggerSceneDone', 'isActionSceneDone', function () {
    return this.get('isTriggerSceneDone') && this.get('isActionSceneDone');
  })), _defineProperty(_EmberObject$extend, 'shouldShowActionScene', Ember.computed('isTriggerSceneDone', function () {
    return this.get('isTriggerSceneDone');
  })), _EmberObject$extend));
});
define("ifttt-ember/models/mockapi", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    get: function get(path, data, callback) {
      if (callback == undefined && typeof data == "function") {
        callback = data;
      }

      if (path == "/api/triggerServices") {
        callback([{
          id: 3,
          title: "RSS Feed",
          code: 'rss',
          img: "/img/icon.rss.svg",
          description: "This service deal with Really Simple Syndicate."
        }, {
          id: 1,
          title: "Twitter",
          code: 'twitter',
          img: "/img/icon.twitter.svg",
          description: "Twitter Applets can help you manage and save tweets, keep an eye on #hashtags, and much more."
        }, {
          id: 2,
          title: "Date & Time",
          code: 'date',
          img: "/img/icon.date.svg",
          description: "Find the best date and time for your scheduled task."
        }, {
          id: 4,
          title: "SMS",
          code: 'sms',
          img: "/img/icon.sms.svg",
          description: "Get important notifications on your phone via SMS."
        }, {
          id: 5,
          title: "Email",
          code: 'email',
          img: "/img/icon.email.svg",
          description: "Respond to inbound emails for any smtp server."
        }, {
          id: 6,
          title: "Weather",
          code: 'weather',
          img: "/img/icon.weather.svg",
          description: "Today's weather report."
        }, {
          id: 7,
          title: "Phone Call",
          code: 'phone',
          img: "/img/icon.phone.svg",
          description: "This service can trigger Applets when you leave a voicemail at the IFTTT number."
        }, {
          id: 8,
          title: "Delicious",
          code: 'delicious',
          img: "/img/icon.delicious.svg",
          description: "Delicious is a social bookmarking web service for storing, sharing, and discovering web bookmarks."
        }, {
          id: 9,
          title: "Facebook",
          code: 'facebook',
          img: "/img/icon.facebook.svg",
          description: "Manage your profile, posting, photos and more with Facebook Applets that work with the world's largest social networking site."
        }, {
          id: 10,
          title: "Tumblr",
          code: 'tumblr',
          img: "/img/icon.tumblr.svg",
          description: "Tumblr is a blogging platform that allows users to post text, images, videos, links, quotes, and audio."
        }]);
      } else if (path == "/api/triggers") {

        if (data && data.trigger_service_id == 3) {
          // RSS
          callback([{
            id: 1,
            title: "New Feed Item",
            description: "When new feed appeared in RSS feed"
          }, {
            id: 2,
            title: "New Feed Item Matches",
            description: "When new feed matches specification"
          }]);
        } else {
          callback([]);
        }
      } else if (path == "/api/actionServices") {

        if (data && data.trigger_service_id == 3) {
          // RSS
          callback([{
            id: 5,
            title: "Email",
            code: 'email',
            img: "/img/icon.email.svg",
            description: "Respond to inbound emails for any smtp server."
          }, {
            id: 1,
            title: "Twitter",
            code: 'twitter',
            img: "/img/icon.twitter.svg",
            description: "Twitter Applets can help you manage and save tweets, keep an eye on #hashtags, and much more."
          }, {
            id: 2,
            title: "Date & Time",
            code: 'date',
            img: "/img/icon.date.svg",
            description: "Find the best date and time for your scheduled task."
          }, {
            id: 3,
            title: "RSS Feed",
            code: 'rss',
            img: "/img/icon.rss.svg",
            description: "This service deal with Really Simple Syndicate."
          }, {
            id: 4,
            title: "SMS",
            code: 'sms',
            img: "/img/icon.sms.svg",
            description: "Get important notifications on your phone via SMS."
          }, {
            id: 6,
            title: "Weather",
            code: 'weather',
            img: "/img/icon.weather.svg",
            description: "Today's weather report."
          }, {
            id: 7,
            title: "Phone Call",
            code: 'phone',
            img: "/img/icon.phone.svg",
            description: "This service can trigger Applets when you leave a voicemail at the IFTTT number."
          }, {
            id: 8,
            title: "Delicious",
            code: 'delicious',
            img: "/img/icon.delicious.svg",
            description: "Delicious is a social bookmarking web service for storing, sharing, and discovering web bookmarks."
          }, {
            id: 9,
            title: "Facebook",
            code: 'facebook',
            img: "/img/icon.facebook.svg",
            description: "Manage your profile, posting, photos and more with Facebook Applets that work with the world's largest social networking site."
          }, {
            id: 10,
            title: "Tumblr",
            code: 'tumblr',
            img: "/img/icon.tumblr.svg",
            description: "Tumblr is a blogging platform that allows users to post text, images, videos, links, quotes, and audio."
          }]);
        } else {
          callback([]);
        }
      } else if (path == "/api/actions") {

        if (data && data.action_service_id == 5) {
          // Email
          callback([{
            id: 1,
            title: "Send Email To Someone",
            description: "e.g. send to yourself"
          }, {
            id: 2,
            title: "Remind me through email later",
            description: "set a schedule and remind me later"
          }]);
        } else {
          callback([]);
        }
      }
    }
  };
});
define('ifttt-ember/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('ifttt-ember/router', ['exports', 'ifttt-ember/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('applet', { path: '/if/:triggertype/:triggerid/:actiontype/:actionid' });
    this.route('applet', { path: '/if/:triggertype/:triggerid/:actiontype' });
    this.route('applet', { path: '/if/:triggertype/:triggerid' });
    this.route('applet', { path: '/if/:triggertype' });
    this.route('applet', { path: '/' });
  });

  exports.default = Router;
});
define('ifttt-ember/routes/applet', ['exports', 'ifttt-ember/models/applet-state', 'ifttt-ember/models/mockapi'], function (exports, _appletState, _mockapi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var currentState = _appletState.default.create();

  exports.default = Ember.Route.extend({
    actions: {
      transitionTo: function transitionTo(path) {
        // force ember to transition to a dynamic path 
        // this.transitionTo(path);

        if ("history" in window && "pushState" in window.history) {
          window.history.pushState({}, "IFTTT", path);
        }
      }
    },
    setSelectedTriggerServiceByCode: function setSelectedTriggerServiceByCode(code) {
      var triggerServices = currentState.get("triggerServices");
      for (var i = 0, len = triggerServices.length; i < len; i++) {
        if (triggerServices[i].code == code) {
          currentState.set('selectedTriggerService', triggerServices[i]);
        }
      }
    },
    setSelectedTriggerByID: function setSelectedTriggerByID(itemID) {
      var triggers = currentState.get("triggers");
      if (triggers && triggers.length == 0) {
        // can't wait for triggers to get populated
        _mockapi.default.get("/api/triggers", { trigger_service_id: this.get('selectedTriggerService').id }, function (newTriggers) {
          for (var i = 0, len = newTriggers.length; i < len; i++) {
            if (newTriggers[i].id == itemID) {
              currentState.set('selectedTrigger', newTriggers[i]);
            }
          }
        });
      } else {
        for (var i = 0, len = triggers.length; i < len; i++) {
          if (triggers[i].id == itemID) {
            currentState.set('selectedTrigger', triggers[i]);
          }
        }
      }
    },
    setSelectedActionServiceByCode: function setSelectedActionServiceByCode(code, callback) {
      var actionServices = currentState.get("actionServices");
      if (actionServices && actionServices.length == 0) {
        // can't wait for action services to get populated
        _mockapi.default.get("/api/actionServices", { trigger_service_id: this.get('selectedTriggerService').id }, function (newActionServices) {
          for (var i = 0, len = newActionServices.length; i < len; i++) {
            if (newActionServices[i].code == code) {
              currentState.set('selectedActionService', newActionServices[i]);
            }
          }
          if (callback) {
            callback();
          }
        });
      } else {
        for (var i = 0, len = actionServices.length; i < len; i++) {
          if (actionServices[i].code == code) {
            currentState.set('selectedActionService', actionServices[i]);
          }
        }
        if (callback) {
          callback();
        }
      }
    },
    setSelectedActionByID: function setSelectedActionByID(itemID) {
      var actions = currentState.get("actions");
      if (actions && actions.length == 0) {
        // can't wait for actions to get populated
        _mockapi.default.get("/api/actions", { action_service_id: this.get('selectedActionService').id }, function (newActions) {
          for (var i = 0, len = newActions.length; i < len; i++) {
            if (newActions[i].id == itemID) {
              currentState.set('selectedAction', newActions[i]);
            }
          }
        });
      } else {
        for (var i = 0, len = actions.length; i < len; i++) {
          if (actions[i].id == itemID) {
            currentState.set('selectedAction', actions[i]);
          }
        }
      }
    },
    model: function model(params) {
      // populating initial trigger services
      //
      var triggerServiceCode = params["triggertype"];
      var triggerID = params["triggerid"];
      var actionServiceCode = params["actiontype"];
      var actionID = params["actionid"];

      var triggerServices = currentState.get("triggerServices");
      if (triggerServices.length == 0) {
        var oThis = this;
        _mockapi.default.get("/api/triggerServices", function (newTriggerServices) {
          triggerServices.clear();
          for (var i = 0, len = newTriggerServices.length; i < len; i++) {
            triggerServices.pushObject(newTriggerServices[i]);
          }
          // load trigger service based on path e.g. /rss
          oThis.setSelectedTriggerServiceByCode(triggerServiceCode);
        });
      } else {
        // load trigger service based on path e.g. /rss
        this.setSelectedTriggerServiceByCode(triggerServiceCode);
      }

      if (triggerID) {
        // load trigger based on path e.g. /rss/1
        this.setSelectedTriggerByID(triggerID);
      }
      if (actionServiceCode) {
        var oThis = this;
        // load action service based on path e.g. /rss/1/email
        this.setSelectedActionServiceByCode(actionServiceCode, function () {
          if (actionID) {
            // load action service based on path e.g. /rss/1/email/1
            oThis.setSelectedActionByID(actionID);
          }
        });
      }

      return currentState;
    }
  });
});
define('ifttt-ember/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("ifttt-ember/templates/applet", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "PTQY6Ahd", "block": "{\"symbols\":[],\"statements\":[[4,\"unless\",[[20,[\"model\",\"isAllDone\"]]],null,{\"statements\":[[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"container header-container\"],[7],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"main-label if-word\"],[7],[0,\"IF\"],[8],[0,\" \\n\\n    \"],[2,\" THIS button \"],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"btn-group\"],[7],[0,\"\\n      \"],[6,\"span\"],[10,\"class\",[26,[\"btn dropdown-toggle \",[25,\"if\",[[20,[\"model\",\"triggerServices\",\"length\"]],\"\",\"disabled\"],null]]]],[9,\"data-toggle\",\"dropdown\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showThisDropdown\"]],[7],[0,\"\\n        THIS\\n        \"],[6,\"span\"],[9,\"class\",\"caret\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[1,[25,\"service-dropdown\",null,[[\"items\",\"showDropdown\",\"noSelectionText\",\"onItemSelected\",\"dropdownDidClose\"],[[20,[\"model\",\"triggerServices\"]],[20,[\"model\",\"showThisDropdown\"]],\"No Trigger Service Available\",[25,\"action\",[[19,0,[]],\"chooseTriggerService\"],null],[25,\"action\",[[19,0,[]],\"toggleDropdownDidClose\",\"showThisDropdown\"],null]]]],false],[0,\"\\n    \"],[8],[0,\"\\n\\n    \"],[6,\"span\"],[9,\"class\",\"main-label then-word\"],[7],[0,\"THEN\"],[8],[0,\" \\n\\n    \"],[2,\" THAT button \"],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"btn-group\"],[7],[0,\"\\n      \"],[6,\"span\"],[10,\"class\",[26,[\"btn dropdown-toggle \",[25,\"if\",[[20,[\"model\",\"isTriggerSceneDone\"]],\"\",\"disabled\"],null]]]],[9,\"data-toggle\",\"dropdown\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showThatDropdown\"]],[7],[0,\"\\n        THAT\\n        \"],[6,\"span\"],[9,\"class\",\"caret\"],[7],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[1,[25,\"service-dropdown\",null,[[\"items\",\"showDropdown\",\"noSelectionText\",\"onItemSelected\",\"dropdownDidClose\"],[[20,[\"model\",\"actionServices\"]],[20,[\"model\",\"showThatDropdown\"]],\"No Action Service Available\",[25,\"action\",[[19,0,[]],\"chooseActionService\"],null],[25,\"action\",[[19,0,[]],\"toggleDropdownDidClose\",\"showThatDropdown\"],null]]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"unless\",[[20,[\"model\",\"isAllDone\"]]],null,{\"statements\":[[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"selectedTriggerService\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"if-section container\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"selectedTriggerService\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        You have selected \"],[6,\"strong\"],[7],[1,[20,[\"model\",\"selectedTriggerService\",\"title\"]],false],[8],[0,\" service. \\n\\n\"],[4,\"if\",[[20,[\"model\",\"selectedTriggerService\"]]],null,{\"statements\":[[0,\"          \"],[6,\"span\"],[7],[0,\"Choose a trigger:\"],[8],[0,\"\\n\\n          \"],[6,\"span\"],[9,\"class\",\"btn-group\"],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"btn dropdown-toggle\"],[9,\"data-toggle\",\"dropdown\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showTriggerDropdown\"]],[7],[0,\"\\n              Choose Trigger\\n              \"],[6,\"span\"],[9,\"class\",\"caret\"],[7],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[1,[25,\"service-dropdown\",null,[[\"items\",\"showDropdown\",\"noSelectionText\",\"onItemSelected\",\"dropdownDidClose\"],[[20,[\"model\",\"triggers\"]],[20,[\"model\",\"showTriggerDropdown\"]],\"No Trigger Available\",[25,\"action\",[[19,0,[]],\"chooseTrigger\"],null],[25,\"action\",[[19,0,[]],\"toggleDropdownDidClose\",\"showTriggerDropdown\"],null]]]],false],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"selectedTriggerAndEdit\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"model\",\"selectedTriggerHasImplementation\"]]],null,{\"statements\":[[0,\"\\n        \"],[1,[25,\"if-equal\",null,[[\"params1\",\"params2\"],[[20,[\"model\",\"selectedTrigger\",\"id\"]],1]]],false],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px\"],[7],[0,\"    \\n            \"],[6,\"div\"],[9,\"class\",\"indented-container\"],[7],[0,\"  \\n              \"],[6,\"span\"],[9,\"class\",\"main-label if-sign\"],[7],[0,\"IF\"],[8],[0,\" New Feed is available:       \\n              \"],[6,\"span\"],[9,\"class\",\"label label-warning clickable-label\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showTriggerDropdown\"]],[7],[0,\"or choose another trigger\"],[8],[0,\"\\n            \"],[8],[0,\"\\n\\n            \"],[6,\"div\"],[9,\"class\",\"indented-container\"],[7],[0,\"  \\n              \"],[6,\"form\"],[9,\"class\",\"form-inline\"],[9,\"jsclass\",\"continue-choosing-trigger-form\"],[7],[0,\"\\n                \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                  \"],[6,\"label\"],[9,\"for\",\"exampleInputName2\"],[7],[0,\"Specify Feed URL:\"],[8],[0,\"\\n                  \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"placeholder\",\"value\",\"autocorrect\",\"autocapitalize\",\"spellcheck\",\"autocomplete\",\"focus-in\",\"focus-out\"],[\"text\",\"address\",\"http://www.wordpress.com/feed\",[20,[\"model\",\"triggerAttributes\",\"address\"]],\"off\",\"off\",\"false\",\"off\",[25,\"action\",[[19,0,[]],\"setFocusFlag\",\"address\"],null],[25,\"action\",[[19,0,[]],\"setTriggerAttribute\",\"address\"],null]]]],false],[0,\" \\n\"],[4,\"if\",[[20,[\"model\",\"wrongURL\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"p\"],[9,\"class\",\"help-block warning\"],[7],[0,\"Make sure you have keyed in the correct URL.\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"model\",\"isValidTrigger\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btn btn-default\"],[3,\"action\",[[19,0,[]],\"continueSelectingAction\"]],[7],[0,\"Continue\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \"],[8],[0,\"\\n              \"],[8],[0,\"\\n            \"],[8],[0,\"    \\n          \"],[8],[0,\"\\n        \"],[1,[18,\"if-equal\"],false],[0,\"\\n\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"unless\",[[20,[\"model\",\"selectedTriggerHasImplementation\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px; padding-left : 20px\"],[7],[0,\"\\n          Ooops, this trigger has yet to be implemented ... \"],[6,\"span\"],[9,\"class\",\"label label-warning clickable-label\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showTriggerDropdown\"]],[7],[0,\"or choose another trigger\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"selectedTriggerAndDone\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"indented-container\"],[7],[0,\"  \\n          \"],[6,\"span\"],[9,\"class\",\"main-label if-sign\"],[7],[0,\"IF\"],[8],[0,\" a new feed is available at \"],[1,[20,[\"model\",\"triggerAttributes\",\"address\"]],false],[0,\" \"],[6,\"span\"],[9,\"class\",\"label label-warning clickable-label\"],[3,\"action\",[[19,0,[]],\"backToTriggerEditing\"]],[7],[0,\"edit trigger\"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"shouldShowActionScene\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"then-section container\"],[7],[0,\"\\n\"],[4,\"unless\",[[20,[\"model\",\"selectedActionService\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        \"],[6,\"span\"],[9,\"class\",\"main-label\"],[7],[0,\"THEN\"],[8],[0,\" \"],[6,\"span\"],[9,\"class\",\"label label-warning clickable-label\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showThatDropdown\"]],[7],[0,\"choose a service\"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"selectedActionService\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n        You have selected \"],[6,\"strong\"],[7],[1,[20,[\"model\",\"selectedActionService\",\"title\"]],false],[8],[0,\" service. \"],[6,\"span\"],[7],[0,\"Choose an action:\"],[8],[0,\"\\n\\n        \"],[6,\"span\"],[9,\"class\",\"btn-group\"],[7],[0,\"\\n          \"],[6,\"span\"],[9,\"class\",\"btn dropdown-toggle\"],[9,\"data-toggle\",\"dropdown\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showActionDropdown\"]],[7],[0,\"\\n            Choose Action\\n            \"],[6,\"span\"],[9,\"class\",\"caret\"],[7],[8],[0,\"\\n          \"],[8],[0,\"\\n          \"],[1,[25,\"service-dropdown\",null,[[\"items\",\"showDropdown\",\"noSelectionText\",\"onItemSelected\",\"dropdownDidClose\"],[[20,[\"model\",\"actions\"]],[20,[\"model\",\"showActionDropdown\"]],\"No Action Available\",[25,\"action\",[[19,0,[]],\"chooseAction\"],null],[25,\"action\",[[19,0,[]],\"toggleDropdownDidClose\",\"showActionDropdown\"],null]]]],false],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"selectedActionAndEdit\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"model\",\"selectedActionHasImplementation\"]]],null,{\"statements\":[[0,\"\\n          \"],[1,[25,\"if-equal\",null,[[\"params1\",\"params2\"],[[20,[\"model\",\"selectedAction\",\"id\"]],1]]],false],[0,\"\\n\\n            \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px\"],[7],[0,\"\\n              \"],[6,\"div\"],[9,\"class\",\"indented-container level-2\"],[7],[0,\"  \\n                \"],[6,\"span\"],[9,\"class\",\"main-label then-sign\"],[7],[0,\"THEN\"],[8],[0,\" Send email to: \"],[6,\"span\"],[9,\"class\",\"label label-warning clickable-label\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showActionDropdown\"]],[7],[0,\"or choose another action\"],[8],[0,\"\\n              \"],[8],[0,\"\\n\\n              \"],[6,\"div\"],[9,\"class\",\"indented-container level-2\"],[7],[0,\"  \\n                \"],[6,\"form\"],[9,\"class\",\"form-inline\"],[9,\"jsclass\",\"complete-form\"],[7],[0,\"\\n                  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n                    \"],[6,\"label\"],[9,\"for\",\"exampleInputName2\"],[7],[0,\"Specify your email:\"],[8],[0,\"\\n                    \"],[1,[25,\"input\",null,[[\"type\",\"name\",\"placeholder\",\"value\",\"autocorrect\",\"autocapitalize\",\"spellcheck\",\"autocomplete\",\"focus-in\",\"focus-out\"],[\"text\",\"email\",\"john.doe@email.com\",[20,[\"model\",\"actionAttributes\",\"email\"]],\"off\",\"off\",\"false\",\"off\",[25,\"action\",[[19,0,[]],\"setFocusFlag\",\"email\"],null],[25,\"action\",[[19,0,[]],\"setActionAttribute\",\"email\"],null]]]],false],[0,\" \\n\"],[4,\"if\",[[20,[\"model\",\"wrongEmail\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"p\"],[9,\"class\",\"help-block warning\"],[7],[0,\"Make sure you have keyed in the correct email.\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"model\",\"isValidAction\"]]],null,{\"statements\":[[0,\"                      \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btn btn-default\"],[3,\"action\",[[19,0,[]],\"finalizeAction\"]],[7],[0,\"Continue\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                  \"],[8],[0,\"\\n                \"],[8],[0,\"\\n              \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\\n          \"],[1,[18,\"if-equal\"],false],[0,\"\\n\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"unless\",[[20,[\"model\",\"selectedActionHasImplementation\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px; padding-left : 20px\"],[7],[0,\"\\n            Ooops, this action has yet to be implemented ... \"],[6,\"span\"],[9,\"class\",\"label label-warning clickable-label\"],[3,\"action\",[[19,0,[]],\"toggleDropdown\",\"showActionDropdown\"]],[7],[0,\"or choose another action\"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"selectedActionAndDone\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px\"],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"indented-container level-2\"],[7],[0,\"  \\n            \"],[6,\"span\"],[9,\"class\",\"main-label then-sign\"],[7],[0,\"THEN\"],[8],[0,\" Send email to : \"],[1,[20,[\"model\",\"actionAttributes\",\"email\"]],false],[0,\" \"],[6,\"span\"],[9,\"class\",\"label label-warning clickable-label\"],[3,\"action\",[[19,0,[]],\"backToActionEditing\"]],[7],[0,\"edit action\"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"readyToSubmit\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"text-align : center\"],[7],[0,\"\\n      \"],[6,\"span\"],[9,\"class\",\"btn btn-default\"],[3,\"action\",[[19,0,[]],\"saveAndSubmit\"]],[7],[0,\"Save and Submit\"],[8],[0,\"    \\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"model\",\"isAllDone\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"if-section container finalized\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"indented-container\"],[7],[0,\"  \\n        \"],[6,\"span\"],[9,\"class\",\"main-label if-sign\"],[7],[0,\"IF\"],[8],[0,\" a new feed is available at \"],[1,[20,[\"model\",\"triggerAttributes\",\"address\"]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"then-section container finalized\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container\"],[9,\"style\",\"margin-top : 20px\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"indented-container level-2\"],[7],[0,\"  \\n        \"],[6,\"span\"],[9,\"class\",\"main-label then-sign\"],[7],[0,\"THEN\"],[8],[0,\" Send email to : \"],[1,[20,[\"model\",\"actionAttributes\",\"email\"]],false],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "ifttt-ember/templates/applet.hbs" } });
});
define("ifttt-ember/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "KHUM04Ph", "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "ifttt-ember/templates/application.hbs" } });
});
define("ifttt-ember/templates/components/if-equal", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FWAWPL/e", "block": "{\"symbols\":[\"&default\"],\"statements\":[[4,\"if\",[[20,[\"isEqual\"]]],null,{\"statements\":[[0,\"  \"],[11,1],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "ifttt-ember/templates/components/if-equal.hbs" } });
});
define("ifttt-ember/templates/components/service-dropdown", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "abUhZ2jg", "block": "{\"symbols\":[\"listItem\"],\"statements\":[[4,\"if\",[[20,[\"showDropdown\"]]],null,{\"statements\":[[0,\"  \"],[6,\"ul\"],[9,\"class\",\"dropdown-menu on-show\"],[9,\"forcescroll\",\"1\"],[7],[0,\"\\n\"],[4,\"unless\",[[20,[\"items\",\"length\"]]],null,{\"statements\":[[0,\"    \"],[6,\"li\"],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"service-selection\"],[7],[0,\"\\n        \"],[6,\"h3\"],[7],[1,[25,\"if\",[[20,[\"noSelectionText\"]],[20,[\"noSelectionText\"]],\"No Selection Available\"],null],false],[8],[0,\"\\n        \"],[6,\"div\"],[7],[0,\"...\"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[4,\"each\",[[20,[\"items\"]]],null,{\"statements\":[[0,\"    \"],[6,\"li\"],[3,\"action\",[[19,0,[]],\"chooseItem\",[19,1,[]]]],[7],[0,\"\\n      \"],[6,\"div\"],[9,\"class\",\"service-selection\"],[7],[0,\"\\n        \"],[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[19,1,[\"img\"]],\"indented-container\",\"\"],null]]]],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"img\"]]],null,{\"statements\":[[0,\"          \"],[6,\"img\"],[9,\"class\",\"logo\"],[9,\"width\",\"48\"],[9,\"height\",\"48\"],[10,\"src\",[26,[[19,1,[\"img\"]]]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"          \"],[6,\"h3\"],[7],[1,[19,1,[\"title\"]],false],[8],[0,\"\\n          \"],[6,\"div\"],[7],[1,[19,1,[\"description\"]],false],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "ifttt-ember/templates/components/service-dropdown.hbs" } });
});


define('ifttt-ember/config/environment', [], function() {
  var prefix = 'ifttt-ember';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("ifttt-ember/app")["default"].create({"name":"ifttt-ember","version":"0.0.0+f7f971e3"});
}
//# sourceMappingURL=ifttt-ember.map
