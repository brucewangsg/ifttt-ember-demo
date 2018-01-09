'use strict';

define('ifttt-ember/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/if-equal.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/if-equal.js should pass ESLint\n\n4:13 - Don\'t use Ember\'s function prototype extensions (ember/no-function-prototype-extensions)');
  });

  QUnit.test('components/service-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/service-dropdown.js should pass ESLint\n\n2:8 - \'EmberObject\' is defined but never used. (no-unused-vars)\n2:23 - \'computed\' is defined but never used. (no-unused-vars)\n22:26 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n22:26 - \'$\' is not defined. (no-undef)\n24:11 - \'$\' is not defined. (no-undef)\n24:11 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n32:17 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n32:17 - \'$\' is not defined. (no-undef)\n37:11 - \'$\' is not defined. (no-undef)\n37:11 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n38:11 - \'$\' is not defined. (no-undef)\n38:11 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n46:7 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n46:7 - \'$\' is not defined. (no-undef)\n47:7 - \'$\' is not defined. (no-undef)\n47:7 - Do not use global `$` or `jQuery` (ember/no-global-jquery)');
  });

  QUnit.test('controllers/applet.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/applet.js should pass ESLint\n\n91:17 - \'key\' is not defined. (no-undef)');
  });

  QUnit.test('models/applet-state.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/applet-state.js should pass ESLint\n\n1:8 - \'DS\' is defined but never used. (no-unused-vars)\n8:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n9:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n13:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n32:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n37:9 - \'oThis\' is assigned a value but never used. (no-unused-vars)\n49:59 - Unnecessary escape character: \\+. (no-useless-escape)\n49:102 - Unnecessary escape character: \\+. (no-useless-escape)\n57:9 - \'re\' is already defined. (no-redeclare)\n57:57 - Unnecessary escape character: \\+. (no-useless-escape)\n57:100 - Unnecessary escape character: \\+. (no-useless-escape)\n58:9 - \'isValid\' is already defined. (no-redeclare)\n63:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n67:3 - Duplicate key \'triggerAddressDidChange\'. (no-dupe-keys)\n68:9 - \'oThis\' is assigned a value but never used. (no-unused-vars)\n80:24 - Unnecessary escape character: \\[. (no-useless-escape)\n80:49 - Unnecessary escape character: \\[. (no-useless-escape)');
  });

  QUnit.test('models/mockapi.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/mockapi.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/applet.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/applet.js should pass ESLint\n\n118:11 - \'oThis\' is already defined. (no-redeclare)');
  });
});
define('ifttt-ember/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('ifttt-ember/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ifttt-ember/tests/helpers/start-app', 'ifttt-ember/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };
});
define('ifttt-ember/tests/helpers/start-app', ['exports', 'ifttt-ember/app', 'ifttt-ember/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes.autoboot = true;
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('ifttt-ember/tests/integration/components/if-equal-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('if-equal', 'Integration | Component | if equal', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "EZKR8ahv",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"if-equal\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "opGUd7/7",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"if-equal\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('ifttt-ember/tests/integration/components/service-dropdown-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('service-dropdown', 'Integration | Component | service dropdown', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "FI5Zxhy4",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"service-dropdown\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "2E7Te0a9",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"service-dropdown\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('ifttt-ember/tests/test-helper', ['ifttt-ember/app', 'ifttt-ember/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('ifttt-ember/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/if-equal-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/if-equal-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/service-dropdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/service-dropdown-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/applet-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/applet-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/applet-state-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/applet-state-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/applet-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/applet-test.js should pass ESLint\n\n');
  });
});
define('ifttt-ember/tests/unit/controllers/applet-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:applet', 'Unit | Controller | applet', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('ifttt-ember/tests/unit/models/applet-state-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('applet-state', 'Unit | Model | applet state', {
    // Specify the other units that are required for this test.
    needs: []
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
  });
});
define('ifttt-ember/tests/unit/routes/applet-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:applet', 'Unit | Route | applet', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
require('ifttt-ember/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
