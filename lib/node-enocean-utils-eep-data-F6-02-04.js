/* ------------------------------------------------------------------
* node-enocean-utils - node-enocean-utils-eep-data-F6-02-04.js
*
* Copyright (c) 2016, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2016-07-18
*
* EEP:F6-02-04 (EEP 2.6.5 specification P17)
* - RORG:F6:RPS Telegram
* - FUNC:02:Rocker Switch, 2 Rocker
* - TYPE:04:Light and blind control ERP2
* ---------------------------------------------------------------- */
'use strict';
var mBuffer = require('./node-enocean-utils-buffer.js');

var EnoceanUtilsEepDataParser= function() {};

EnoceanUtilsEepDataParser.prototype.parse = function(dd_buf) {
	if(dd_buf.length !== 1) {
		return parsed_unknown;
	}
	var d = dd_buf.readUInt8(0);
	// Energy Bow (State of the energy bow)
	var ebo = d >> 7;
	var ebo_desc = '';
	if(ebo === 0) {
		ebo_desc = 'released';
	} else if(ebo === 1) {
		ebo_desc = 'pressed';
	}
	// Button coding (Signalize button coding)
	var bc = (d & 0b01000000) >> 6;
	var bc_desc = '';
	if(bc === 0) {
		bc_desc = 'button';
	}
	// BI (State I of the rocker B)
	var button_name = '';
	var rbi = (d & 0b00001000) >> 3;
	var rbi_desc = '';
	if(rbi === 0) {
		rbi_desc = 'not pressed';
	} else if(rbi === 1) {
		rbi_desc = 'pressed';
		button_name = 'BI';
	}
	// B0 (State 0 of the rocker B)
	var rb0 = (d & 0b00000100) >> 2;
	var rb0_desc = '';
	if(rb0 === 0) {
		rb0_desc = 'not pressed';
	} else if(rb0 === 1) {
		rb0_desc = 'pressed';
		button_name = 'B0';
	}
	// AI (State I of the rocker A)
	var rai = (d & 0b00000010) >> 1;
	var rai_desc = '';
	if(rai === 0) {
		rai_desc = 'not pressed';
	} else if(rai === 1) {
		rai_desc = 'pressed';
		button_name = 'AI';
	}
	// A0 (State 0 of the rocker A)
	var ra0 = d & 0b00000001;
	var ra0_desc = '';
	if(ra0 === 0) {
		ra0_desc = 'not pressed';
	} else if(ra0 === 1) {
		ra0_desc = 'pressed';
		button_name = 'A0';
	}
	//
	var data_bin = ('0000000' + d.toString(2)).slice(-8);
	var values = {
		'EBO': {
			'key'  : 'EBO',
			'field': 'Energy Bow',
			'value': ebo,
			'hex'  : [mBuffer.convDecToHexString(ebo)],
			'bin'  : data_bin.substr(0, 1),
			'desc' : ebo_desc
		},
		'BC': {
			'key'  : 'BC',
			'field': 'Button coding',
			'value': bc,
			'hex'  : [mBuffer.convDecToHexString(bc)],
			'bin'  : data_bin.substr(1, 1),
			'desc' : bc_desc
		},
		'RBI': {
			'key'  : 'RBI',
			'field': 'BI',
			'value': rbi,
			'hex'  : [mBuffer.convDecToHexString(rbi)],
			'bin'  : data_bin.substr(4, 1),
			'desc' : rbi_desc
		},
		'RB0': {
			'key'  : 'RB0',
			'field': 'B0',
			'value': rb0,
			'hex'  : [mBuffer.convDecToHexString(rb0)],
			'bin'  : data_bin.substr(5, 1),
			'desc' : rb0_desc
		},
		'RAI': {
			'key'  : 'RAI',
			'field': 'AI',
			'value': rai,
			'hex'  : [mBuffer.convDecToHexString(rai)],
			'bin'  : data_bin.substr(6, 1),
			'desc' : rai_desc
		},
		'RA0': {
			'key'  : 'RA0',
			'field': 'A0',
			'value': ra0,
			'hex'  : [mBuffer.convDecToHexString(ra0)],
			'bin'  : data_bin.substr(7, 1),
			'desc' : ra0_desc
		}
	};
	var message = {
		'eep'  : 'F6-02-04',
		'value': {
			'button': button_name,
			'pressed': ebo
		},
		'desc' : button_name ? (button_name + ' ' + ebo_desc) : ebo_desc,
		'learn': false
	};
	var parsed = {
		'field'    : 'Data_DL',
		'message'  : message,
		'hex'      : mBuffer.convBufferToHexString(dd_buf),
		'buffer'   : dd_buf,
		'values'   : values,
		'structure': [values['EBO'], values['BC'], values['RBI'], values['RB0'], values['RAI'], values['RA0']]
	};
	return parsed;
};

module.exports = new EnoceanUtilsEepDataParser();
