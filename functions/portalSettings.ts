import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req: Request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const base44 = createClientFromRequest(req);

    if (req.method === "GET") {
      const records = await base44.asServiceRole.entities.UISettings.filter({
        page_key: "homepage",
      });

      const settings: Record<string, string> = {};
      for (const r of records) {
        settings[r.setting_key] = r.value;
      }

      return new Response(JSON.stringify({ success: true, settings }), {
        status: 200, headers,
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const updates: Record<string, string> = body.settings || {};

      const records = await base44.asServiceRole.entities.UISettings.filter({
        page_key: "homepage",
      });

      const updatedKeys: string[] = [];

      for (const [key, val] of Object.entries(updates)) {
        const existing = records.find((r: any) => r.setting_key === key);
        if (existing) {
          await base44.asServiceRole.entities.UISettings.update(existing.id, {
            value: String(val),
          });
          updatedKeys.push(key);
        } else {
          await base44.asServiceRole.entities.UISettings.create({
            page_key: "homepage",
            setting_key: key,
            value: String(val),
            value_type: "string",
            label: key,
          });
          updatedKeys.push(key);
        }
      }

      return new Response(
        JSON.stringify({ success: true, updated: updatedKeys }),
        { status: 200, headers }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers,
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers }
    );
  }
});
