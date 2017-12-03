value_dimension=-100000000;
base_dimension=-1000;

settlement.receipt.header.account=settlement.account;

settlement.receipt.body=[[
"Stromlieferung",settlement.base_balance/base_dimension,"KWh",(settlement.value_balance/value_dimension)*10,"€"
]];

settlement.receipt.footer=[];
settlement.receipt.footer["EEG Umlage"]=(settlement.base_balance*6792)/value_dimension;
settlement.receipt.footer["KWK Umlage"]=(settlement.base_balance*345)/value_dimension;
settlement.receipt.footer["§ 19 StromNEV"]=(settlement.base_balance*370)/value_dimension;
settlement.receipt.footer["Offshore-Haftungsumlage"]=(settlement.base_balance*37)/value_dimension;
settlement.receipt.footer["Umlage für abschaltbare Lasten"]=(settlement.base_balance*11)/value_dimension;
settlement.receipt.footer["Stromsteuer"]=(settlement.base_balance*2050)/value_dimension;
settlement.receipt.footer["Energiesteuer"]=(settlement.base_balance*550)/value_dimension;
settlement.receipt.footer["Konzessionsabgabe"]=(settlement.base_balance*1320)/value_dimension;
settlement.receipt.footer["Umsatzsteuer 19%"]=(Math.round(settlement.value_balance-(settlement.value_balance/1.19))*10)/value_dimension;
