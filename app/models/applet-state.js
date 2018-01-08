import DS from 'ember-data';
import EmberObject, { computed, observer }  from '@ember/object';
import mockAPI from '../models/mockapi';

export default EmberObject.extend({
  selectedTriggerService : null,
  selectedTrigger : null,
  triggerServices : [],
  triggers : [],

  selectedActionService : null,
  selectedAction : null,
  actionServices : [],
  actions : [],

  isValidTrigger : false,
  isValidAction : false,

  showThisDropdown : false,
  showThatDropdown : false,
  showTriggerDropdown : false,
  showActionDropdown : false,

  // are we still editing trigger customization?
  isTriggerSceneDone : false,

  // are we still editing action customization?
  isActionSceneDone : false,

  allDone : false,

  triggerAttributes : {
    address : null
  },

  triggerAddressDidChange: observer('triggerAttributes.address', function() {
    var oThis = this;
    if (!this.get('addressFocusOut')) {
      // if on input focus, don't verify
      return;
    }
    this.set('addressFocusOut', false);

    this.verifyAddress();
  }),

  verifyAddress : function () {
    var val = this.get('triggerAttributes.address')+'';
    if (val && val.length > 0) {
      var re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
      var isValid = re.test((val).toString().toLowerCase());
      if (isValid && !val.match(/^http/)) {
        val = 'https://' + val;
        this.set('triggerAttributes.address', val);
      }
    }

    var re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    var isValid = re.test((val).toString().toLowerCase());
    this.set("isValidTrigger", isValid);
    this.set("wrongURL", !isValid);    
  },

  actionAttributes : {
    email : null    
  },

  triggerAddressDidChange: observer('actionAttributes.email', function() {
    var oThis = this;
    if (!this.get('emailFocusOut')) {
      // if on input focus, don't verify
      return;
    }
    this.set('emailFocusOut', false);

    this.verifyAddress();
  }),

  verifyEmail : function () {
    var val = this.get('actionAttributes.email')+'';

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isValid = re.test((val).toString().toLowerCase());
    this.set("isValidAction", isValid);
    this.set("wrongEmail", !isValid);    
  },

  selectedTriggerAndEdit : computed('selectedTrigger', 'isTriggerSceneDone', function () {
    return this.get('selectedTrigger') && !this.get('isTriggerSceneDone');
  }),

  selectedTriggerHasImplementation : computed('selectedTrigger', function () {
    // right now, only the first trigger is implemented
    return this.get('selectedTrigger') && this.get('selectedTrigger').id == 1;
  }),

  selectedTriggerAndDone : computed('selectedTrigger', 'isTriggerSceneDone', function () {
    return this.get('selectedTrigger') && this.get('isTriggerSceneDone');
  }),

  selectedTriggerDidChange: observer('selectedTriggerService', function() {
    var oThis = this;
    mockAPI.get("/api/triggers", { trigger_service_id : this.get('selectedTriggerService').id }, function (newTriggers) {
      var triggers = oThis.get("triggers");
      triggers.clear();
      for (var i = 0, len = newTriggers.length; i < len; i++) {
        triggers.pushObject(newTriggers[i]);
      }
    });

    mockAPI.get("/api/actionServices", { trigger_service_id : this.get('selectedTriggerService').id }, function (newActionServices) {
      var actionServices = oThis.get("actionServices");
      actionServices.clear();
      for (var i = 0, len = newActionServices.length; i < len; i++) {
        actionServices.pushObject(newActionServices[i]);
      }
    });
  }),

  selectedActionHasImplementation : computed('selectedAction', function () {
    // right now, only the first action is implemented
    return this.get('selectedAction') && this.get('selectedAction').id == 1;
  }),

  selectedActionAndEdit : computed('selectedAction', 'isActionSceneDone', function () {
    return this.get('selectedAction') && !this.get('isActionSceneDone');
  }),

  selectedActionAndDone : computed('selectedAction', 'isActionSceneDone', function () {
    return this.get('selectedAction') && this.get('isActionSceneDone');
  }),

  selectedActionDidChange: observer('selectedActionService', function() {
    var oThis = this;
    mockAPI.get("/api/actions", { action_service_id : this.get('selectedActionService').id }, function (newActions) {
      var actions = oThis.get("actions");
      actions.clear();
      for (var i = 0, len = newActions.length; i < len; i++) {
        actions.pushObject(newActions[i]);
      }
    });
  }),

  readyToSubmit : computed('isTriggerSceneDone', 'isActionSceneDone', function () {
    return this.get('isTriggerSceneDone') && this.get('isActionSceneDone');
  }),

  shouldShowActionScene : computed('isTriggerSceneDone', function () {
    return this.get('isTriggerSceneDone');
  }) 

});
