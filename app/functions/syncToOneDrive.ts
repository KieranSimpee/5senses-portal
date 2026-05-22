import { createClient } from 'npm:@base44/sdk@0.8.25';

const FOLDER_MAP: Record<string, string> = {
  "Admin":                  "016ZYE2IBURBPNBPZ3EBBKDPUAQZ2HPBHX",
  "Finance":                "016ZYE2IEOMYO7P62RMJFZKUHLOCEQYH6D",
  "HR":                     "016ZYE2IF6EZYC2GAEWNBK5MBMW4OFRB5O",
  "Brand — 5SENSESBEAUTY":  "016ZYE2IDE6LQ3R6JGRBCYQ7NBLENIYYXE",
  "Brand — SIMPLEX-ITY":    "016ZYE2IDUFQDWFQAPFVBLIWNAUX5PCKIU",
  "Documents":              "016ZYE2IG7TUEBBZHF5ZHJGHIZTV6BNRVP",
};

function mapToFolder(doc: any): string {
  const cat   = (doc.category  || "").toLowerCase();
  const tags  = (doc.tags      || []).join(" ").toLowerCase();
  const rel   = (doc.related_to|| "").toLowerCase();
  if (tags.includes("hr")      || cat.includes("hr"))      return "HR";
  if (tags.includes("finance") || cat.includes("finance")  || cat.includes("invoice")) return "Finance";
  if (tags.includes("admin")   || rel.includes("admin"))   return "Admin";
  if (rel.includes("5senses")  || tags.includes("5senses"))return "Brand — 5SENSESBEAUTY";
  if (rel.includes("simplex")  || tags.includes("simplex"))return "Brand — SIMPLEX-ITY";
  return "Documents";
}

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClient({
      appId:      Deno.env.get("BASE44_APP_ID")!,
      token:      Deno.env.get("BASE44_SERVICE_TOKEN")!,
      serverUrl:  Deno.env.get("BASE44_API_URL")!,
    });

    const body = await req.json();
    const { file_url, file_name, category, tags, related_to, section } = body;

    if (!file_url || !file_name) {
      return Response.json({ error: "file_url and file_name are required" }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("one_drive");

    // Determine target folder
    let folderKey = mapToFolder({ category, tags, related_to });
    const sectionMap: Record<string, string> = {
      "HR": "HR", "Finance": "Finance", "Admin": "Admin",
      "Brand-5SENSES": "Brand — 5SENSESBEAUTY",
      "Brand-SIMPLEX":  "Brand — SIMPLEX-ITY",
    };
    if (section && sectionMap[section]) folderKey = sectionMap[section];

    const folderId = FOLDER_MAP[folderKey] || FOLDER_MAP["Documents"];

    // Download file from CDN
    const fileResp = await fetch(file_url);
    if (!fileResp.ok) throw new Error(`Download failed: ${fileResp.status}`);
    const fileBuffer = await fileResp.arrayBuffer();

    // Upload to OneDrive
    const safeName  = file_name.replace(/[\/\\:*?"<>|]/g, "_");
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}:/${encodeURIComponent(safeName)}:/content`;

    const uploadResp = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/octet-stream" },
      body: fileBuffer,
    });

    if (!uploadResp.ok) throw new Error(`OneDrive upload failed: ${uploadResp.status} ${await uploadResp.text()}`);
    const data = await uploadResp.json();

    return Response.json({ success: true, onedrive_id: data.id, onedrive_url: data.webUrl, folder: folderKey, file_name: safeName });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
