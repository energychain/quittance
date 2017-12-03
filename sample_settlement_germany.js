value_dimension=-100000000;
base_dimension=-1000;

settlement.receipt.date=new Date().toLocaleString();
settlement.receipt.header.account=settlement.account;

settlement.receipt.body=[[
"Stromlieferung",settlement.base_balance/base_dimension,"KWh",((settlement.value_balance/value_dimension)*10).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 }),"€"
]];

settlement.receipt.footer=[
["EEG Umlage",((settlement.base_balance*6792)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["KWK Umlage",((settlement.base_balance*345)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["§ 19 StromNEV",((settlement.base_balance*370)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["Offshore-Haftungsumlage",((settlement.base_balance*37)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["Umlage für abschaltbare Lasten",((settlement.base_balance*11)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["Stromsteuer",((settlement.base_balance*2050)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["Energiesteuer",((settlement.base_balance*550)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["Konzessionsabgabe",((settlement.base_balance*1320)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })],
["Umsatzsteuer 19%",((Math.round(settlement.value_balance-(settlement.value_balance/1.19))*10)/value_dimension).toLocaleString("de-DE", { style:"currency",currency:"EUR",minimumFractionDigits:2, maximumFractionDigits:2 })]
];
