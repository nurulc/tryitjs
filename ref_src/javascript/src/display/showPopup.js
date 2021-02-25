import { Identity } from '../utils';

/**
 * [showPopup description]
 * @param  {[type]} timeout [description]
 * @param  {[type]} msg     [description]
 * @param  {[type]} type    [description]
 * @param  {[type]} action  [description]
 * @return {[type]}         [description]
 */
export default function showPopup(timeout, msg,type, action){
	action = action || Identity;
	alertify.notify((msg||'Executing all preceeding code snippet, this may take some time'),(type||'error'),timeout, action );
}