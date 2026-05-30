Deno.serve(async (req: Request) => {
  try {
    const { invoice_id, invoice } = await req.json();

    if (!invoice_id || !invoice) {
      return Response.json({ error: "invoice_id and invoice data are required" }, { status: 400 });
    }

    const clientId = Deno.env.get("AIRWALLEX_ADMIN_CLIENT_ID");
    const apiKey = Deno.env.get("AIRWALLEX_ADMIN_API_KEY");

    // Authenticate with Airwallex
    const authRes = await fetch("https://api.airwallex.com/api/v1/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId!,
        "x-api-key": apiKey!,
      },
    });

    const authData = await authRes.json();
    if (!authData.token) {
      return Response.json({ error: "Airwallex auth failed", details: authData }, { status: 401 });
    }

    const token = authData.token;

    // Parse line items from "Name | qty:1 | HKD 5000" format
    const lineItems = (invoice.items || []).map((item: string, idx: number) => {
      const parts = item.split("|").map((p: string) => p.trim());
      const name = parts[0] || `Item ${idx + 1}`;
      const qtyMatch = parts[1]?.match(/qty[:\s]*(\d+)/i);
      const priceMatch = parts[2]?.match(/([\d,.]+)/);
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      const price = priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : 0;
      return {
        description: name,
        quantity: qty,
        unit_amount: Math.round(price * 100),
        currency: invoice.currency || "HKD",
      };
    });

    const airwallexPayload = {
      request_id: `5portal-${invoice.invoice_no}-${Date.now()}`,
      currency: invoice.currency || "HKD",
      customer: {
        name: invoice.client_name,
        ...(invoice.client_email ? { email: invoice.client_email } : {}),
        address: { line1: invoice.client_address || "", country: "HK" },
      },
      line_items: lineItems,
      due_date: invoice.due_date,
      memo: `Invoice ${invoice.invoice_no} from SIMPLEX-ITY`,
    };

    const createRes = await fetch("https://api.airwallex.com/api/v1/billing/invoices", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airwallexPayload),
    });

    const createData = await createRes.json();

    if (createRes.ok && createData.id) {
      return Response.json({
        success: true,
        airwallex_invoice_id: createData.id,
        hosted_url: createData.hosted_url || null,
        message: `Invoice ${invoice.invoice_no} synced to Airwallex successfully`,
      });
    } else {
      return Response.json({
        success: false,
        error: createData.message || "Sync failed",
        code: createData.code || null,
        hint: "Check Airwallex API key has Billing > Invoices scope enabled",
        invoice_no: invoice.invoice_no,
      });
    }

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
