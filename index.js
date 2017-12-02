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
 
const vorpal = require('vorpal')();

var cli = new require("stromdao-cli-helper")(vorpal);
