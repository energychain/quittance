/* StromDAO Business Object: Quittance
 * =========================================
 * Accounting related helpers and integrations
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.com 
 * 
 * If used in StromDAO-BO's MAIN BRANCH this will be defaulted to the testnet environment.
 * 
 */
const fs = require('fs');
const vm = require('vm');
const doT = require('dot');
var StromDAOBO = require("stromdao-businessobject");  
 
module.exports = {
	_getFile:function(filehandel) {
		if((filehandel.length==46)&&(filehandel.substring(0,1)=="Q")) {
			var srequest = require('sync-request');	
			var str=srequest('GET',"https://fury.network/ipfs/"+filehandel+"").body.toString();	
		}  else {
			var str=fs.readFileSync(filehandel);
		}
		return str;
	},
	receipt:function (args, callback) {	 
	  var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,rpc:global.rpcprovider});	
	  node.storage.setItemSync(node.wallet.address,args.meter_point_id);	
	  if(typeof args.options.sc != "undefined") {
			smart_contract_stromkonto  =args.options.sc;
	  }
	  if(typeof args.options.a != "undefined") {
			target  =args.options.a;
	  }	else {
			target = node.wallet.address;
	  }
	  node.stromkonto(smart_contract_stromkonto).then( function(sko) {		
		var ps = [];
		ps.push(sko.balancesSoll(target));
		ps.push(sko.balancesHaben(target));
		ps.push(sko.baseSoll(target));
		ps.push(sko.baseHaben(target));
		Promise.all(ps).then(function(values) {
			global.settlement={}
			var settlement_js=null;
			settlement.value_soll=values[0];
			settlement.value_haben=values[1];
			settlement.value_balance=settlement.value_haben-settlement.value_soll;
			settlement.base_soll=values[2];
			settlement.base_haben=values[3];
			settlement.base_balance=settlement.base_haben-settlement.base_soll;
			settlement.account=target;
			settlement.id=args.meter_point_id;
			settlement.ledger=smart_contract_stromkonto;			
			settlement.receipt={};
			settlement.receipt.profile={};
			settlement.receipt.profile.name="Barverkauf";
			settlement.receipt.profile.street="";
			settlement.receipt.profile.city="";
			settlement.receipt.header={};
			settlement.receipt.body={};
			settlement.receipt.footer={};
			if(typeof args.options.f != "undefined") {
				settlement_js = receipt._getFile( args.options.f);
			}
			if(typeof args.options.p != "undefined") {
				settlement.receipt.profile = JSON.parse(receipt._getFile( args.options.p));
			}			
			if(settlement_js!=null) {
				var script = new vm.Script(settlement_js);
				var result=script.runInThisContext();	
			}
			result=null;
			if(typeof args.options.t != "undefined") {
				source = receipt._getFile( args.options.t);								
				var tempFn = doT.template(source);				
				var result=tempFn(settlement.receipt);
				if(typeof args.options.o != "undefined") {
					fs.writeFileSync(args.options.o, result);
					result=null;
				} else {
					if(typeof vorpal != "undefined") {
							vorpal.log(result);
							result=null;
					}	
				}								
			} else {
				vorpal.log(settlement.receipt);
			}			
			callback(result);		
		});			
	});
	}
}

var receipt = module.exports;
