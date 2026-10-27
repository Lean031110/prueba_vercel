module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) return res.status(503).json({
    error: "Falta configurar TRIPO_API_KEY en Vercel → Project Settings → Environment Variables. Después guarda y vuelve a desplegar."
  });
  try {
    const body = req.body || {};
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
    const mimeType = typeof body.mimeType === "string" ? body.mimeType : "";
    if (!/^image\/(jpeg|png|webp)$/.test(mimeType)) return res.status(400).json({ error: "Formato de imagen no válido. Usa JPEG, PNG o WebP." });
    if (!imageBase64 || imageBase64.length > 3.85 * 1024 * 1024) return res.status(413).json({ error: "La imagen enviada está vacía o supera el límite. Reduce su tamaño e inténtalo otra vez." });
    const bytes = Buffer.from(imageBase64, "base64");
    if (!bytes.length || bytes.length > 2.8 * 1024 * 1024) return res.status(413).json({ error: "La imagen supera el límite de carga. Usa una imagen más pequeña." });
    const ext = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: mimeType }), "neonforge-reference." + ext);
    const uploadResp = await fetch("https://openapi.tripo3d.ai/v3/files", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey },
      body: form
    });
    const upload = await uploadResp.json().catch(() => ({}));
    if (!uploadResp.ok || upload.code !== 0 || !upload.data?.file_token) {
      return res.status(502).json({ error: upload.message || upload.data?.message || "Tripo no aceptó la imagen. Revisa la clave de API y sus permisos." });
    }
    const quality = body.quality === "detailed" ? "detailed" : "standard";
    const taskResp = await fetch("https://openapi.tripo3d.ai/v3/generation/image-to-model", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        input: upload.data.file_token,
        model: "v3.1-20260211",
        texture: true,
        pbr: true,
        face_limit: 50000,
        geometry_quality: quality,
        texture_quality: "standard"
      })
    });
    const task = await taskResp.json().catch(() => ({}));
    if (!taskResp.ok || task.code !== 0 || !task.data?.task_id) {
      return res.status(502).json({ error: task.message || task.data?.message || "Tripo no pudo iniciar la generación. Comprueba los créditos de API y vuelve a intentarlo." });
    }
    return res.status(200).json({ task_id: task.data.task_id });
  } catch (error) {
    console.error("Tripo generation request failed:", error?.message || "unknown error");
    return res.status(500).json({ error: "No se pudo conectar con Tripo. Inténtalo de nuevo más tarde." });
  }
};
