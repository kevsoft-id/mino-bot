/*
  ===========================================================
  [ WATERMARK & LICENSE NOTICE ]
  ===========================================================
  🤖 BOT NAME : MINOBOT
  👤 DEVELOPER: KEVIN (KevSoft-ID)
  🌐 GITHUB   : https://github.com/kevsoft-id
  ===========================================================
  ⚠️  Menghapus/mengubah watermark ini melanggar ToS & hak cipta.
  Created by Kevin © 2026. All rights reserved.
  ===========================================================
*/

import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { WATERMARK_HEALTH_INFO } from "../lib/watermark";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  // Kredit watermark selalu disertakan dalam respons health check
  res.json({ ...data, credit: WATERMARK_HEALTH_INFO });
});

export default router;
