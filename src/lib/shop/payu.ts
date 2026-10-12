/**
 * Sends the browser to PayU by posting the signed form the API returned. The fields go exactly as
 * given: PayU's hash covers them.
 */
export function postToPayu({ url, fields }: { url: string; fields: Record<string, string> }): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.style.display = "none";
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
