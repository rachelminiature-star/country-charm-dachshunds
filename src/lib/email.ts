// Email notifications via Web3Forms.
// Web3Forms only accepts browser-side submissions on the free plan, so this
// runs in the visitor's browser. FormData keeps it a "simple" CORS request.
// The access key is publishable by design.
const WEB3FORMS_ACCESS_KEY = "27dc9c51-ed2c-45be-bd35-b35eda847c79";

export async function forwardEmail({
  data,
}: {
  data: { payload: Record<string, string> };
}): Promise<{ ok: boolean; error: string | null }> {
  const { _subject, ...rest } = data.payload;
  try {
    const fd = new FormData();
    fd.append("access_key", WEB3FORMS_ACCESS_KEY);
    fd.append("subject", _subject || "New website submission");
    fd.append("from_name", "Country Charm Dachshunds");
    for (const [k, v] of Object.entries(rest)) fd.append(k, v ?? "");

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: fd,
    });
    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;
    if (!res.ok || !json?.success) {
      return { ok: false, error: json?.message ?? `Email relay returned ${res.status}` };
    }
    return { ok: true, error: null };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "Email relay unreachable" };
  }
}
