const https = require('https');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send('<h1 style="font-family:sans-serif;text-align:center;margin-top:60px;color:#7c6af7">eBay Server OK</h1>');
  }
  try {
    const { callName, xmlBody, token, appId, devId, certId } = req.body;
    const xmlRequest = '<?xml version="1.0" encoding="utf-8"?><' + callName + 'Request xmlns="urn:ebay:apis:eBLBaseComponents"><RequesterCredentials><eBayAuthToken>' + token + '</eBayAuthToken></RequesterCredentials>' + xmlBody + '</' + callName + 'Request>';
    const options = { hostname: 'api.ebay.com', port: 443, path: '/ws/api.dll', method: 'POST', headers: { 'Content-Type': 'text/xml', 'X-EBAY-API-COMPATIBILITY-LEVEL': '967', 'X-EBAY-API-DEV-NAME': devId, 'X-EBAY-API-APP-NAME': appId, 'X-EBAY-API-CERT-NAME': certId, 'X-EBAY-API-CALL-NAME': callName, 'X-EBAY-API-SITEID': '0' } };
    const data = await new Promise((resolve, reject) => { const r = https.request(options, (response) => { let d = ''; response.on('data', c => d += c); response.on('end', () => resolve(d)); }); r.on('error', reject); r.write(xmlRequest); r.end(); });
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(data);
  } catch (error) { return res.status(500).json({ error: error.message }); }
};
