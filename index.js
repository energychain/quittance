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
var receipt = require("./receipt.js");
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
  .option('--sc <address>','Smart Contract Address of Stromkonto (Ledger)')
  .option('-a <address>','Address/Account to use')
  .option('-p <file>','Additional Profile JSON')
   .types({
    string: ['sc', 'a','f','t','o','p']
  })
  .action(receipt.receipt);
  

  
var cli = new require("stromdao-cli-helper")(vorpal);
