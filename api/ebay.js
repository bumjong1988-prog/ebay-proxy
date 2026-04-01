export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { callName, xmlBody, token, appId, devId, certId } = req.body;
  if (!callName || !xmlBody || !token) return res.status(400).json({ error: 'missing params' });
  const xml = '<?xml version="1.0" encoding="utf-8"?><' + callName + 'Request xmlns="urn:ebay:apis:eBLBaseComponents"><RequesterCredentials><eBayAuthToken>' + token + '</eBayAuthToken></RequesterCredentials>' + xmlBody + '</' + callName + 'Request>';
  try {
    const ebayRes = await fetch('https://api.ebay.com/ws/api.dll', {
      method: 'POST',
      headers: {
        'X-EBAY-API-CALL-NAME': callName,
        'X-EBAY-API-APP-NAME': appId,
        'X-EBAY-API-DEV-NAME': devId,
        'X-EBAY-API-CERT-NAME': certId,
        'X-EBAY-API-SITEID': '0',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'Content-Type': 'text/xml;charset=utf-8'
      },
      body: xml
    });
    const text = await ebayRes.text();
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
