// api/send-sms.js
// Vercel Serverless Function — API Secret을 서버에서만 사용

import { createHmac, randomBytes } from "crypto";

function generateSignature(apiSecret, dateTime, salt) {
  return createHmac("sha256", apiSecret)
    .update(dateTime + salt)
    .digest("hex");
}

function buildAuthHeader(apiKey, apiSecret) {
  const dateTime = new Date().toISOString();
  const salt = randomBytes(8).toString("hex");
  const signature = generateSignature(apiSecret, dateTime, salt);
  return `HMAC-SHA256 apiKey=${apiKey}, date=${dateTime}, salt=${salt}, signature=${signature}`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: "to, text 파라미터가 필요합니다." });
  }

  // 환경변수에서 API 키 로드 (절대 클라이언트에 노출 안 됨)
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_FROM_NUMBER;

  if (!apiKey || !apiSecret || !from) {
    return res.status(500).json({ error: "서버 환경변수가 설정되지 않았습니다." });
  }

  try {
    const authorization = buildAuthHeader(apiKey, apiSecret);
    const solapiRes = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({ message: { to, from, text } }),
    });

    const data = await solapiRes.json();

    if (data.errorCode) {
      return res.status(400).json({ error: data.errorMessage || data.errorCode });
    }

    return res.status(200).json({ success: true, messageId: data.messageId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
