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

  selectedTriggerDidChange: observer('selectedTriggerService', function() {
    var oThis = this;
    mockAPI.get("/api/triggers", { trigger_service_id : this.get('selectedTriggerService').id }, function (newTriggers) {
      var triggers = oThis.get("triggers");
      triggers.clear();
      for (var i = 0, len = newTriggers.length; i < len; i++) {
        triggers.pushObject(newTriggers[i]);
      }
    });
  })

});
