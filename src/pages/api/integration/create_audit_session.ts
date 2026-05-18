import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Mock successful response
  const mockResponse = {
    respcode: "0",
    errmsg: "",
    audit_id: "AD-" + Date.now()
  };

  // Simulate API delay
  setTimeout(() => {
    res.status(200).json(mockResponse);
  }, 500);
}