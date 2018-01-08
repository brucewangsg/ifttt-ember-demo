import DS from 'ember-data';
import EmberObject from '@ember/object';

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

  showThisDropdown : false
});
