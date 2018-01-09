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

      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code);
    },
    chooseActionService : function (item) {
      var model = this.get('model');
      model.set('selectedActionService', item);
      model.set('showThatDropdown', false);

      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id + '/' + model.selectedActionService.code);
    },
    chooseTrigger : function (item) {
      var model = this.get('model');
      model.set('selectedTrigger', item);
      model.set('showTriggerDropdown', false);

      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id);
    },
    chooseAction : function (item) {
      var model = this.get('model');
      model.set('selectedAction', item);
      model.set('showActionDropdown', false);

      this.get('target').send('transitionTo', '/if/' + model.selectedTriggerService.code + '/' + model.selectedTrigger.id + '/' + model.selectedActionService.code + '/' + model.selectedAction.id);
    },
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
      model.set(key + 'FocusOut', true);

      if (key == 'address') {
        model.verifyAddress();
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
