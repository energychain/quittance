#!/usr/bin/env node

/* StromDAO Business Object: Quittance
 * =========================================
 * Accounting related helpers and integrations
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.com 
 * 
 * If used in StromDAO-BO's MAIN BRANCH this will be defaulted to the testnet environment.
 * 
 */
var StromDAOBO = require("stromdao-businessobject");  
const fs = require('fs');
const vm = require('vm');
const doT = require('dot') ;
const vorpal = require('vorpal')();

vorpal
  .command('ledger <meter_point_id>')    
  .description("Retrieve Ledger Information for meter point id (Stromkonto).") 
  .action(function (args, callback) {	 
	var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,rpc:global.rpcprovider});	
	node.storage.setItemSync(node.wallet.address,args.meter_point_id);	
	vorpal.log("Ledger:",smart_contract_stromkonto);
	node.stromkonto(smart_contract_stromkonto).then( function(sko) {
		vorpal.log("Address:",node.wallet.address);
		sko.balancesSoll(node.wallet.address).then(function(soll) {
			vorpal.log("Credit:",soll);
			sko.balancesHaben(node.wallet.address).then(function(haben) {
				vorpal.log("Debit:",haben);
				vorpal.log("Balance:",haben-soll);		
				sko.baseHaben(node.wallet.address).then(function(base_haben) {
					vorpal.log("Energy Debit:",base_haben);		
					sko.baseSoll(node.wallet.address).then(function(base_soll) {
						vorpal.log("Energy Credit:",base_soll);			
						sko.history(node.wallet.address,10000).then(function(history) {
							vorpal.log("Last Transaction");
							vorpal.log("Block","From","To","Value");						
							for(var i=0;i<history.length;i++) {
									var from=node.storage.getItemSync(history[i].from);
									if(from==null) {from=history[i].from;}
									
									var to=node.storage.getItemSync(history[i].to);
									if(to==null) {to=history[i].to;}
									
									vorpal.log(history[i].blockNumber,from,to,parseInt(history[i].value, 16));							
							}
							callback();	
						});
					});
				});
			});
		});
	});	
});	

vorpal
  .command('receipt <meter_point_id>')    
  .description("Output receipt for a given ledger identified by meter_point_id") 
  .option('-f <file>','Apply settlement/clearing from file')
  .option('-t <file>','Use template for rendition')
  .option('-o <file>','Output File ')
  .action(function (args, callback) {	 
	  var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,rpc:global.rpcprovider});	
	  node.storage.setItemSync(node.wallet.address,args.meter_point_id);	
	  node.stromkonto(smart_contract_stromkonto).then( function(sko) {		
		var ps = [];
		ps.push(sko.balancesSoll(node.wallet.address));
		ps.push(sko.balancesHaben(node.wallet.address));
		ps.push(sko.baseSoll(node.wallet.address));
		ps.push(sko.baseHaben(node.wallet.address));
		Promise.all(ps).then(function(values) {
			global.settlement={}
			var settlement_js=null;
			settlement.value_soll=values[0];
			settlement.value_haben=values[1];
			settlement.value_balance=settlement.value_haben-settlement.value_soll;
			settlement.base_soll=values[2];
			settlement.base_haben=values[3];
			settlement.base_balance=settlement.base_haben-settlement.base_soll;
			settlement.account=node.wallet.address;
			settlement.id=args.meter_point_id;
			settlement.ledger=smart_contract_stromkonto;
			settlement.receipt={};
			settlement.receipt.header={};
			settlement.receipt.body={};
			settlement.receipt.footer={};
			if(typeof args.options.f != "undefined") {
				settlement_js = fs.readFileSync( args.options.f);
			}
			if(settlement_js!=null) {
				var script = new vm.Script(settlement_js);
				var result=script.runInThisContext();	
			}
			if(typeof args.options.t != "undefined") {
				source = fs.readFileSync( args.options.t);								
				var tempFn = doT.template(source);				
				var result=tempFn(settlement.receipt);
				if(typeof args.options.o != "undefined") {
					fs.writeFileSync(args.options.o, result);
				} else {
					vorpal.log(result);
				}				
				
			} else {
				vorpal.log(settlement.receipt);
			}
			callback();		
		});			
	});
});
var cli = new require("stromdao-cli-helper")(vorpal);
