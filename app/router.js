import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('applet', { path : '/if/:triggertype/:triggerid/:actiontype/:actionid' });
  this.route('applet', { path : '/if/:triggertype/:triggerid/:actiontype' });
  this.route('applet', { path : '/if/:triggertype/:triggerid' });
  this.route('applet', { path : '/if/:triggertype' });
  this.route('applet', { path : '/' });
});

export default Router;
