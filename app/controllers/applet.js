import Controller from '@ember/controller';

export default Controller.extend({
  actions : {
    toggleDropdown(key) {
      var model = this.get('model'); 
      model.set(key, true);
    },
    toggleDropdownDidClose : function (key) {
      var model = this.get('model');
      model.set(key, false);
    },
    chooseTriggerService : function (item) {
      var model = this.get('model');
      model.set('selectedTriggerService', item);
      model.set('showThisDropdown', false);
    },
    chooseActionService : function (item) {
      var model = this.get('model');
      model.set('selectedActionService', item);
      model.set('showThatDropdown', false);
    },
    chooseTrigger : function (item) {
      var model = this.get('model');
      model.set('selectedTrigger', item);
      model.set('showTriggerDropdown', false);
    },
    chooseAction : function (item) {
      var model = this.get('model');
      model.set('selectedAction', item);
      model.set('showActionDropdown', false);
    },
    backToTriggerEditing : function () {
      var model = this.get('model');
      model.set('isTriggerSceneDone', false);
    },
    backToActionEditing : function () {
      var model = this.get('model');
      model.set('isActionSceneDone', false);
    },
    continueSelectingAction : function () {
      var model = this.get('model');
      if (model.get('isValidTrigger')) {
        model.set('isTriggerSceneDone', true);      
      }
    },
    setTriggerAttribute : function (key, value) {
      var model = this.get('model');
      model.set('triggerAttributes.' + key, value);      
      model.set(key + 'FocusOut', true);

      if (key == 'address') {
        model.verifyAddress();
      }
    },
    finalizeAction : function () {
      var model = this.get('model');
      if (model.get('isValidAction')) {
        model.set('isActionSceneDone', true);      
      }
    },
    setActionAttribute : function (key, value) {
      var model = this.get('model');
      model.set('actionAttributes.' + key, value);      
      model.set(key + 'FocusOut', true);

      if (key == 'email') {
        model.verifyEmail();
      }
    },
    saveAndSubmit : function () {
      var model = this.get('model');
      model.set('isAllDone', true);
    }
  }
});
