import Route from '@ember/routing/route';
import AppletState from '../models/applet-state';
import mockAPI from '../models/mockapi';

var currentState = AppletState.create();

export default Route.extend({
  model() {
    var triggerServices = currentState.get("triggerServices");
    if (triggerServices.length == 0) {
      mockAPI.get("/api/triggerServices", function (newTriggerServices) {
        triggerServices.clear();
        for (var i = 0, len = newTriggerServices.length; i < len; i++) {
          triggerServices.pushObject(newTriggerServices[i]);
        }
      });    
    }
    return currentState;
  }
});
