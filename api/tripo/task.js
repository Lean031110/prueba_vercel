module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido." });
  }
  const apiKey = process.env.TRIPO_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "Falta configurar TRIPO_API_KEY en Vercel y volver a desplegar." });
  const taskId = String(req.query?.taskId || "");
  if (!/^[a-zA-Z0-9_-]{3,128}$/.test(taskId)) return res.status(400).json({ error: "Identificador de tarea no válido." });
  try {
    const upstream = await fetch("https://openapi.tripo3d.ai/v3/tasks/" + encodeURIComponent(taskId), {
      headers: { Authorization: "Bearer " + apiKey },
      cache: "no-store"
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok || payload.code !== 0 || !payload.data) {
      return res.status(502).json({ error: payload.message || payload.data?.message || "No se pudo consultar la tarea en Tripo." });
    }
    const data = payload.data;
    const output = data.output || {};
    return res.status(200).json({
      task_id: data.task_id,
      status: data.status,
      progress: data.progress || 0,
      message: data.message,
      output: {
        model_url: output.model_url || output.pbr_model || output.base_model || null,
        rendered_image_url: output.rendered_image_url || null
      }
    });
  } catch (error) {
    console.error("Tripo task query failed:", error?.message || "unknown error");
    return res.status(500).json({ error: "No se pudo consultar el estado de la tarea." });
  }
};
