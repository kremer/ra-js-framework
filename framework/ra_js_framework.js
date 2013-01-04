var isPhp = true;
var isApex = false;

/*
 *  WARNING: This is being depreciated, Please use runValidity
 */

function addValidity($form, outputMode, specialValidation, skipAutoValidity, setupSettings) {
	console.log('Warning: addValidity is becoming depreciated. Please use runValidity.');
	if($form.attr('data-validity-enabled') != 'true') {
		var validitySettings = setupSettings || {};
		validitySettings.outputMode = outputMode || "label";
		$.validity.setup(validitySettings);

		if(skipAutoValidity == undefined) skipAutoValidity = false;

		$form.validity(function() {
			window.currentValidityContainer = $form;
			if(typeof specialValidation == 'function') specialValidation($form);

			if(!skipAutoValidity) {
				var reqAll = $form.attr('data-require-all');
				if(typeof reqAll !== 'undefined') //check if we should require all fields
					$form.find('input, select, textarea').require();
				else {
					$form.find('input, select, textarea').each(function() {
						$input = $(this);
						var required = $input.attr('data-required');
						var match_type = $input.attr('data-match');
						if(typeof required !== 'undefined' && required !== false)
							$input.require().assert($input.val().replace(" ","") != "","This field is required.");
						if(match_type == "number") $input.match("number");
						else if(match_type == "email") $input.match("email");
						else if(match_type == "phone") $input.match("phone");
						else if(match_type == "url"){
							if($input.val() != "" && $input.val().indexOf("http") < 0)
								$input.val("http://"+$input.val());
							$input.match("url");
						}
					});
				}
			}
			//we may wish to move this into the validity, as this will not work?
			window.currentValidityContainer = null;
		});

		$form.attr('data-validity-enabled', 'true');
	}
}

//todo: add me to validity? or does it exist
function addValidityElementSupport(support) {
	if($.validity.settings.elementSupport.indexOf(support) == -1) {
		$.validity.settings.elementSupport += ', ' + support;
	}
}

/*
 *  This is fundamentaly different as we are not attaching validation to a form
 *  but rather, we are wrapping a container with the same type of validation.
 *
 *  This will take over from addValidity, This is due to not forcing a form, as
 *  well as being able to keep the container in context as to not influence
 *  the visuals of other validity run components.
 */

function runValidity(options) {
	   $container = options.$container;
	   outputMode= options.outputMode;
	   specialValidation= options.specialValidation;
	   skipAutoValidity= options.skipAutoValidity;
	   setupSettings = options.setupSettings;
	   
	var validitySettings = setupSettings || {};
	validitySettings.outputMode = outputMode || "label";
	$.validity.setup(validitySettings);

	window.currentValidityContainer = $container;
	$.validity.start();


	if(skipAutoValidity == undefined) skipAutoValidity = false;

	if(typeof specialValidation == 'function') specialValidation($container);

	if(!skipAutoValidity) {
		var reqAll = $container.attr('data-require-all');
		if(typeof reqAll !== 'undefined') //check if we should require all fields
		$container.find('input, select, textarea').require();
		else {
			$container.find('input, select, textarea').each(function() {
				$input = $(this);
				var required = $input.attr('data-required');
				var match_type = $input.attr('data-match');
				if(typeof required !== 'undefined' && required !== false) $input.require();
				if(match_type == "number") $input.match("number");
				else if(match_type == "email") $input.match("email");
				else if(match_type == "phone") $input.match("phone");
				else if(match_type == "url"){
				    if($input.val() != "" && $input.val().indexOf("http") < 0)
					   $input.val("http://"+$input.val());
				    $input.match("url");
				}
			});
		}
	}

	//remove our context
	window.currentValidityContainer = null;
	return $.validity.end();

}

function toggleInlineEdits(isEdit) {
	if(isEdit) {
		$('.inline-readonly').hide();
		$('.inline-edit').show();
	} else {
		$('.inline-readonly').show();
		$('.inline-edit').hide();
	}
}

function toggleInlineEditsContainer($container) {
	var state = $container.attr('inline-edit-state');
	if(state == null || state == '') state = 'edit'; //triggers to readonly
	if(state == 'edit') {
		hideInlineEdits($container);
		$container.attr('inline-edit-state', 'readonly');
	} else {
		showInlineEdits($container);
		$container.attr('inline-edit-state', 'edit');
	}

}

function hideInlineEdits($container) {
	$container.find('.inline-readonly').show();
	$container.find('.inline-edit').hide();

}

function showInlineEdits($container) {
	$container.find('.inline-readonly').hide();
	$container.find('.inline-edit').show();
}

function flashMessage(message, error, duration, templateId) {
	var className = error || false;
	var source;
	var html;

	if(duration === undefined || duration == null) duration = 1000;
	if(template === undefined || template == null) {
		if($('div#global-message').size() == 0) {
			html = '<div id="global-message" class="modal hide"><div class="modal-body"><h3></h3></div></div>';
			$('body').append(html);
		}
	} else {
		if($('div#global-message').size() == 0) {
			source = $("#" + templateId).html();
			var template = Handlebars.compile(source);
			html = template(context);

			$('body').append(html);
		}
	}
	if(error) $("#global-message").addClass("error");
	else $("#global-message").removeClass("error");

	$("#global-message .modal-body h3").text(message);
	$("#global-message").fadeIn(function() {
		setTimeout(function() {
			$("#global-message").fadeOut();
		}, duration);
	});
}

/*
 *  PHP/Apex Date Format
 *  (~input = '2012-11-08T16:18:35.000Z')
 *  (~output = '11/8/2012 11:18 AM')
 */

function formatDateTime(dateString) {
	dateString = dateString || Date();
	var d = moment(dateString);
	return d.format('M/D/YYYY h:mma');
}

/*
 *  PHP/Apex Date Format
 *  (~input = '2012-11-08T16:18:35.000Z')
 *  (~output = '11/8/2012')
 */

function formatDate(dateString) {
	dateString = dateString || Date();
	var d = moment(dateString);
	return d.format('MM/DD/YYYY');
}

/*
 *  PHP/Apex Date Format
 *  (~input = '2012-11-08T16:18:35.000Z')
 *  (~output = '2012-11-8')
 */

function formatDateValue(dateString) {
	dateString = dateString || Date();
	var d = moment(dateString);
	return d.format('YYYY-MM-DD');
}

function fixDate(dateString,type) {
	type = type || 'date';
	type = type.toLowerCase();
	
	
	if(typeof dateString=="undefined" || dateString == "")
		return "";
	
	// Check if there is a time. Chances are if the dateString contains a ':' then a time is involved.
	// If no time was provided add one.
	if(dateString.indexOf(':') === -1)
		dateString += ' 00:00:00';
		
	switch (type){
		case 'date':
			return formatDate(dateString);
			break;
		case 'datetime':
			return formatDateTime(dateString);
			break;
		case 'value':
			return formatDateValue(dateString);
			break;
		
		default:
			return formatDate(dateString);
			break;
	}
}

function fixDatesIn($container) {
	$container.find('.format-date').each(function() {
		$(this).text(fixDate($(this).text(),$(this).attr('data-date-type')));
	});
}

function booleanToCheckmark(value) {
	output = '';
	if(value == 'true' || value == true) output = '<i class="icon-ok"></i>';
	return output
}

function booleanToThumbs(value) {
	output = '<i class="icon-thumbs-down"></i>';
	if(value == 'true' || value == true) output = '<i class="icon-thumbs-up"></i>';
	return output
}

function booleanToYesNo(value) {
	output = '<span>No</span>';
	if(value == 'true' || value == true) output = '<span>Yes</span>';
	return output
}

function dateSFPHPFormat(d) {
	d = d || Date();
	var sfDate = moment(d);
	return sfDate.format('YYYY-MM-DD');
}

function setPicklistOptions($select) {
	var object = $select.attr('data-api-object');
	var field = $select.attr('data-api-name');
	var value = $select.attr('data-value');
	if(value == null) value = '';

	callService('getPicklistOptions', null, {
		object: object,
		field: field,
		value: value
	}, function(data) {
		$select.html(data.options);
	}, function(data) {
		flashMessage('...Error getting select values...')
	});
}

function phpSetDependantPicklist(objectName, $child, $parent) {
	if(window[objectName + '_dependentPicklists'] == null) {
		callService('getDependentPicklists', null, {
			objectName: objectName
		}, function(data, x, h) {
			window[objectName + '_dependentPicklists'] = data.dependentPicklists;
			phpSetDependantPicklist(objectName, $child, $parent); //recurse
		}, function(data, x, h) {
			flashMessage('There was an error loading Dependent Picklists', true, 2500);
		});
	} else {
		var dependents;
		for(var i = 0; i < window[objectName + '_dependentPicklists'].length; i++)
		if(window[objectName + '_dependentPicklists'][i].parentFieldName == $parent.attr('data-api-name')) {
			dependents = window[objectName + '_dependentPicklists'][i].OptionsList;
			break;
		}

		$parent.change(function(event) {
			var val = $(this).val();
			if(val == null) //we may be on first run, do we have a value already?
			val = $(this).attr('data-value');
			var found = false;
			for(var j = 0; j < dependents.length; j++) {
				if(dependents[j][0] == val) {
					var options = '';
					for(var k = 0; k < dependents[j][1].length; k++) {
						options += createOption(dependents[j][1][k].value, dependents[j][1][k].label);
					}
					//replace options
					if(options == '') {
						options = '<option value="">N/A</option>';
					} else {
						options = '<option value="">Please Select...</option>' + options
					}
					$child.html(options);
					if(selected != null) {
						$child.find('option[value="' + selected + '"]').attr('selected', 'selected');
						selected = null;
					}
					found = true;
					break;
				} else {


				}
			}

			if(!found) {
				//we did not find any options under the parent, this can result
				//from a new load, lets set to default
				if($(this).html().indexOf('Please Select') != -1 || $(this).html().indexOf('Select a ') != -1) $child.html('<option value="">Select a ' + $parent.attr('name') + '</option>');
				else $child.html('<option value="">No Options Defined</option>');
			}
			//fire the child change event
			$child.change();
		});

		//set child value if it exists
		var selected = $child.attr('data-value');

		if(selected == null || selected == '') $child.html('<option value="">Select a ' + $parent.attr('name') + '</option>');
		else $parent.change();
	}
}

function createOption(value, label, attributes) {
	if(attributes == null) attributes = '';
	return '<option value="' + value + '" ' + attributes + '>' + label + '</option>';
}

var sObject = Backbone.Model.extend({
	defaults: {
		"_type": null,
		"Id": null,
		"_action": null,
		"_children": []
	},
	
	initialize: function() {
	    this.set({_cid: this.cid});
	},

	save: function(action, params, success, failure) {
		callService(action, [this.php_format()], params, success, failure);
	},

	php_format: function() {
		var attrs = jQuery.extend({}, this.attributes);
		var phpObject = {};
		phpObject.fields = {};
		phpObject.fieldsToNull = new Array();
		for(attr in attrs) {
			if(attr == '_type') {
				phpObject.type = attrs[attr];
				delete attrs[attr];
			} else if(attr == 'Id') {
				if(attrs[attr] != null) phpObject.Id = attrs[attr];
				delete attrs[attr];
			} else if(attr.indexOf('_') == 0 || attr.endsWith('__r') || typeof attrs[attr] == 'object') {//if object, we are not an object, cant object an object in SF
				delete attrs[attr];
			} else //we have success, should we null?
			if(attrs[attr] == null || attrs[attr] == '' || attrs[attr] == undefined || (isNaN(attrs[attr]) && (attrs[attr].length == 0 || attrs[attr].length == undefined))) {
				phpObject.fieldsToNull.push(attr);
				delete attrs[attr];
			}
		}
		phpObject.fields = attrs;
		return phpObject;
	},

	absorb_php_object: function(object) {
		attributes = {};
		attributes.Id = object.Id;
		attributes._type = object.type;

		for(attr in object.fields) {
			attributes[attr] = object.fields[attr];
		}
		this.set(attributes);

	},

	apex_format: function() {
		var apexObject = jQuery.extend({}, this.attributes);
		for(attr in apexObject)
		if(attr.indexOf('_') == 0) delete apexObject[attr];
		return apexObject;
	},

	add_child: function(childObject) {
		var children_array = this.get("_children");
		children_array.push(childObject);
		this.set({
			children: children_array
		});
	},

	create_object_from_form: function($form) {

		if($form == null) return null;
		this.set({
			_type: $form.attr('data-api-object')
		});
		attrs = {};


		$form.find('input, select, textarea').each(function() {
			var $input = $(this);
			var api_name = $input.attr('data-api-name');
			var type = $input.attr('type');
			var val = '';
			if(api_name != null) {
				if(type == 'number') {
					var step = $input.attr('step');
					if(step != null && step != '') {
						if(step.indexOf('.') != -1) //maybe we have a step of 2, 10, etc
						val = parseFloat($input.val());
						else val = parseInt($input.val());
					} else val = parseInt($input.val());

				} else if(type == 'date' || type == 'ra-date') {
					val = $input.val();
					if(val == '') val = null;
				} else if(type == 'checkbox') {
					val = $input.is(':checked') ? "1" : "0";
				} else val = $input.val();
				attrs[api_name] = val;
			}
		});
		this.set(attrs);
	} //,
	//this is created for binding this model to a remove, triggering this can allow
	//it to remove itself from a collection, without external referencing 
	//remove: function() {
	//	   this.trigger('removeSObject',[this]);//trigger our custom event
	//    }
});

/*
	AJAX To Proxy -
 */

//preformat the records yourself


function callService(action, objects, addParams, successCallback, errorCallback, ajaxSettings) {
	if(isPhp) {
		var params = {};
		params.records = objects;
		params.action = action;
		params.params = addParams;
		params = JSON.stringify(params);
		var defaults = {
			url: 'service',
			type: 'post',
			dataType: 'json',
			async: true,
			cache: false
		};

		if(typeof ajaxSettings == 'undefined') ajaxSettings = {};
		ajaxSettings.data = params;
		//ajaxSettings.success = successCallback;
		//ajaxSettings.error = errorCallback;
		
		SH = new serviceHandler();
		SH.successCallback = successCallback;
		SH.errorCallback = errorCallback;
		ajaxSettings.success = SH.handle;
		ajaxSettings.error = SH.handle;
		
		ajaxSettings = $.extend(defaults,ajaxSettings);
		
		$.ajax(ajaxSettings);
	
	} else if(isApex) {
	
		apexRemote(objects, successCallback, errorCallback);
	}
}

function serviceHandler()  {
    var that = this;
    this.successCallback = function(data, textStatus, jqXHR) {};
    
    this.errorCallback = function(data, textStatus, jqXHR) {};
    
    this.handle = function(data, textStatus, jqXHR) {
	   if(data != null && data.success == false && data.message == 'Auth Failure') {
		  that.authFailure(data, textStatus, jqXHR);
	   } else if(textStatus == 'success') {
		  if(data != null && data.success)
			 that.successCallback(data);
		  else
			 that.errorCallback(data);
	   } else
		  that.ajaxError(data, textStatus, jqXHR);
    };
    
    this.authFailure = function(data, textStatus, jqXHR) {
	   if(typeof $.unblockUI != 'undefined')
		  $.unblockUI();
	   alert('Your login has expired.');
	   window.location.reload();
    };
    
    this.ajaxError = function(data, textStatus, jqXHR) {
	   if(typeof $.unblockUI != 'undefined')
		  $.unblockUI();
	   alert('CallService encountered an error. Please Contact Administrator.');
    };
    
}

//TODO: Move ME
$(function() {
	//create some basic attachments of events
	//handle inline edits with a button

	$('body').on('click', '.toggle-inline', function(event) {
		$('.inline-edit').find('input, select, textarea').each(function(){
			if($(this).is(':visible'))
				$(this).val($(this).data('original-value'));
			else
				$(this).data('original-value',$(this).val());
		
		});
		
		$('.inline-edit').find('input, select, textarea').filter('[data-default-val][value=" "]').val(function(index, value) {
			return $(this).attr("data-default-val");
		});
		$('.inline-readonly,.inline-edit,.edit-toggle').toggle();
		$('.inline-edit').each(function() {
			if($(this).is(':visible')) {
				$(this).find('input, select, textarea').each(function() {
					attr = $(this).attr('data-required');
					if(typeof attr !== 'undefined' && attr !== false) $(this).closest(".control-group").addClass('error');
				});
			} else $(this).find('input, select, textarea').closest(".control-group").removeClass('error');
		});
	});
	
	//add the endswith function 
	if ( typeof String.prototype.endsWith != 'function' ) {
	   String.prototype.endsWith = function( str ) {
		  return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
	   }
    };
    
    //Why are these not native to validity...? lets add to the community 
    addValidityElementSupport('[type="number"]');
    addValidityElementSupport('[type="date"]');
});

/* Example usage

var account = new sObject();
var contact = new sObject();

var params = {};
params.action = 'saveAccount';

account.create_object_from_form($('#account-form'));

params.records = [account.php_format()];

ajaxToProxy(
	params, 
	function(result){//success
		
	},
	 function(){failure
	
	}
);


if you want to set something
account.set({Id : '123abc', _type : 'Account'});



Example Form

<script class="TEMPLATE">

<form data-api-object="Account">
	<input type="hidden" data-api-name="Id" value="{{Id}}"" />
	<input data-required="true" type="text" data-api-name="Name" value="{{Name}}" />
	<textarea data-api-name="Details__c" value="{{Details__c}}" />
</form>

</script>
 */

/*
 This is a base for the grid collection. This just defines that we want an sObject
for the model. 
 */
var gridCollection = Backbone.Collection.extend({
	model: sObject
});

/*
 This is the base for the ItemView for grids. This handles removing itself from
the collection/composite view as well as getting its object from itself.


 */
var gridItemView = Backbone.Marionette.ItemView.extend({
	events: {
		'click #remove-item': 'removeItem'
	},
	removeItem: function() {
		this.model.collection.remove(this.model)
	},
	getsObjectFromForm: function(options) {
		if(options != null) {
		    options.$container = $(this.$el);
			var result = runValidity(options);
			if(!result.valid) this.model.set({
				_validateError: true
			});
			else this.model.set({
				_validateError: false
			});
		}

		this.model.create_object_from_form($(this.$el));
	},

	model: sObject
});

/*
 This is the base for the CompositeView for grids. This handles the add item event,
as well as getting its collection of objects, and turning them into usable, 
PHP/Apex objects to be used in our services. This is an inherintly Parent / child
relationship, If desired, this.model is the parent where this.collection is 
the children under the parent. Furthermore, we can no define a this.model and 
have a list as well. 
 */
var gridCompositeView = Backbone.Marionette.CompositeView.extend({
	model: sObject,
	//this is the acutal Case
	events: {
		'click #add-item': 'addItem'
	},
	
	afterAdd: function() {
	    //overrite this for after add functionality 
	},

	addItem: function(event) {
		var object = new sObject();
		object._myList = this;
		this.collection.add(object);
		this.afterAdd();
	},

	getsObjectsFromChildForms: function(options) {
		_.each(this.children, function(itemView) {
			itemView.getsObjectFromForm(options);
		});
	},

	isCollectionValidated: function() {
		var validated = true;
		_.each(this.collection.models, function(model) {
			if(model.get('_validateError') == true) validated = false;
		});
		return validated;
	},
	getPHPsObjects: function() {
		var objects = new Array();
		_.each(this.collection.models, function(model) {
			objects.push(model.php_format());
		});
		return objects;
	}
});


/*
 *   This is a collection that is not being used as of yet
 */
var sObjects = Backbone.Collection.extend({
	model: sObject,

	set: function(prop, value) {
		if(this.attributes === undefined) this.attributes = {};
		if(prop !== undefined) this.attributes[prop] = value;
	},

	get: function(prop) {
		if(this.attributes === undefined) return null;
		return this.attributes[prop];
	},

	defaults: {
		"type": null,
		"objects": []
	},

	php_format: function() {
		var objects = this.models;
		var phpObjects = [];
		for(i = 0; i < objects.length; i++)
		phpObjects.push(objects[0].php_format());
		return phpObjects;
	},

	apex_format: function() {
		var objects = this.models;
		var apexObjects = [];
		for(i = 0; i < objects.length; i++)
		apexObjects.push(objects[0].apex_format());
		return apexObjects;
	}
});

function htmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

/*
 *  Helpful JS Enterprise functions
 */

//via: http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
//@author: Marco Demaio
Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep)
{ 
   var n = this,
   c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
   d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

   /*
   according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
   the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
   rather than doing value === undefined.
   */   
   t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

   sign = (n < 0) ? '-' : '',

   //extracting the absolute value of the integer part of the number and converting to string
   i = parseInt(n = Math.abs(n).toFixed(c)) + '', 

   j = ((j = i.length) > 3) ? j % 3 : 0; 
   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
}

/*
	Helpful Handlebars templetes
*/

Handlebars.registerHelper('checkboxValue', function(value) {
	if(value === 1 || value === true || value === '1' || value==='true')
		return 'checked=checked'
	return '';
});

Handlebars.registerHelper('formatDate', function(value) {
	return formatDate(value);
});


Handlebars.registerHelper('numbersOnly', function(value) {
    value = new String(value); 
   return value.replace(/[^0-9]/g, ''); 
});

Handlebars.registerHelper('formatMoney', function(value) {
    if(isNaN(value))
	   return '0.00';
	   value = Number(value).toMoney(); 
   return value; 
});

Handlebars.registerHelper('formatDate', function(value){
	return fixDate(value,'date');
});

Handlebars.registerHelper('formatDateTime', function(value){
	return fixDate(value,'datetime');
});

Handlebars.registerHelper('formatDateValue', function(value){
	return fixDate(value,'value');
});

