import Route from '@ember/routing/route';
import AppletState from '../models/applet-state';

var currentState = AppletState.create();

export default Route.extend({
  model() {
    return currentState;
  }
});
