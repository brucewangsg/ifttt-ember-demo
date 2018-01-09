import Controller from '@ember/controller';

export default Controller.extend({
  actions : {
    /* trigger the dropdown to open up, using data down pattern */
    toggleDropdown(key) {
      var model = this.get('model'); 
      model.set(key, true);
    },
    /* when a dropdownShow state get changed, update the flag so that our dropdown get notified. data down, action up */
    toggleDropdownDidClose : function (key) {
      var model = this.get('model');
      model.set(key, false);
    },

    /* callbacks from dropdown selector */

    chooseTriggerService : function (item) {
      var model = this.get('model');
      model.set('selectedTriggerService', item);
      model.set('selectedTrigger', null);
      model.set('showThisDropdown', false);

      // only apply push state when user has selected trigger service
      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code);
    },
    chooseActionService : function (item) {
      var model = this.get('model');
      model.set('selectedActionService', item);
      model.set('selectedAction', null);
      model.set('showThatDropdown', false);

      // only apply push state when user has selected a trigger
      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id + '/then/' + model.selectedActionService.code);
    },
    chooseTrigger : function (item) {
      var model = this.get('model');
      model.set('selectedTrigger', item);
      model.set('showTriggerDropdown', false);

      // only apply push state when user has selected an action service
      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id);
    },
    chooseAction : function (item) {
      var model = this.get('model');
      model.set('selectedAction', item);
      model.set('showActionDropdown', false);

      // only apply push state when user has selected an action
      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id + '/then/' + model.selectedActionService.code + '/' + model.selectedAction.id);
    },

    /* UI state flows */

    /*
      done with trigger scene
    */
    continueSelectingAction : function () {
      var model = this.get('model');
      if (model.get('isValidTrigger')) {
        model.set('isTriggerSceneDone', true);      
      }
    },
    /*
      allow modification of trigger parameters after we are done with trigger scene, 
      sort of back to editing trigger scene
    */
    backToTriggerEditing : function () {
      var model = this.get('model');
      model.set('isTriggerSceneDone', false);
    },
    backToActionEditing : function () {
      var model = this.get('model');
      model.set('isActionSceneDone', false);
    },
    /*
      done with action scene
    */
    finalizeAction : function () {
      var model = this.get('model');
      if (model.get('isValidAction')) {
        model.set('isActionSceneDone', true);      
      }
    },
    setTriggerAttribute : function (key, value) {
      var model = this.get('model');
      model.set('triggerAttributes.' + key, value);      
      model.set(key + 'FocusIn', false);

      if (key == 'address') {
        model.verifyAddress();
      }
    },
    setActionAttribute : function (key, value) {
      var model = this.get('model');
      model.set('actionAttributes.' + key, value);      
      model.set(key + 'FocusIn', false);

      if (key == 'email') {
        model.verifyEmail();
      }
    },

    /* we can use document.activeElement, but for this exercise, we simply keep track the inputField focus state */
    setFocusFlag : function () {
      var model = this.get('model');
      model.set(key + 'FocusIn', true);
    },

    saveAndSubmit : function () {
      var model = this.get('model');
      model.set('isAllDone', true);
    }
  }
});
