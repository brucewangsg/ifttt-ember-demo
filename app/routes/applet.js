import Route from '@ember/routing/route';
import AppletState from '../models/applet-state';
import mockAPI from '../models/mockapi';

var currentState = AppletState.create();

export default Route.extend({
  actions : {
    transitionTo : function (path) {
      // force ember to transition to a dynamic path 
      // this.transitionTo(path);

      if ("history" in window && "pushState" in window.history) {
        window.history.pushState({}, "IFTTT", path);
      }
    },
  },
  setSelectedTriggerServiceByCode : function (code) {
    var triggerServices = currentState.get("triggerServices");
    for (var i = 0, len = triggerServices.length; i < len; i++) {
      if (triggerServices[i].code == code) {
        currentState.set('selectedTriggerService', triggerServices[i]);
      }
    }
  },
  setSelectedTriggerByID : function (itemID) {
    var triggers = currentState.get("triggers");
    if (triggers && triggers.length == 0) {
      // can't wait for triggers to get populated
      mockAPI.get("/api/triggers", { trigger_service_id : this.get('selectedTriggerService').id }, function (newTriggers) {
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
  setSelectedActionServiceByCode : function (code, callback) {
    var actionServices = currentState.get("actionServices");
    if (actionServices && actionServices.length == 0) {
      // can't wait for action services to get populated
      mockAPI.get("/api/actionServices", { trigger_service_id : this.get('selectedTriggerService').id }, function (newActionServices) {
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
  setSelectedActionByID : function (itemID) {
    var actions = currentState.get("actions");
    if (actions && actions.length == 0) {
      // can't wait for actions to get populated
      mockAPI.get("/api/actions", { action_service_id : this.get('selectedActionService').id }, function (newActions) {
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
  model(params) {
    // populating initial trigger services
    //
    var triggerServiceCode = params["triggertype"];
    var triggerID = params["triggerid"];
    var actionServiceCode = params["actiontype"];
    var actionID = params["actionid"];

    var triggerServices = currentState.get("triggerServices");
    if (triggerServices.length == 0) {
      var oThis = this;
      mockAPI.get("/api/triggerServices", function (newTriggerServices) {
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
