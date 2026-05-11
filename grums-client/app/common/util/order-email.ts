import { ICartItem } from '@/app/store/cart.store';

export function buildOrderEmailHtml({
    firstName,
    items,
    total,
    tipAmount,
    grossTotal,
    pickupNote,
}: {
    firstName: string;
    items: ICartItem[];
    total: number;
    tipAmount: number;
    grossTotal: number;
    pickupNote: string;
}): string {
    const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    const itemRows = items.map(item => {
        const mods = [
            ...item.modifiers
                .filter(m => !m.isDefault || m.isExtra || m.isLight || m.isReplacement)
                .map(m => {
                    if (m.isExtra && m.isReplacement) return `Extra ${m.name} instead of ${m.replacedName}`;
                    if (m.isLight && m.isReplacement) return `Light ${m.name} instead of ${m.replacedName}`;
                    if (m.isReplacement) return `${m.name} instead of ${m.replacedName}`;
                    if (m.isExtra) return `Extra ${m.name}`;
                    if (m.isLight) return `Light ${m.name}`;
                    return `Add ${m.name}`;
                }),
            ...(item.removedModifiers ?? []).map(m => `No ${m.name}`),
        ];
        const note = item.note?.split('\n').find(l => l.startsWith('\x1F'))?.slice(1);
        return `
        <tr><td style="padding:12px 16px;border-top:1px solid #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td>
                    <p style="font-size:14px;font-weight:600;color:#111827;margin:0;">${item.quantity}&times; ${item.name}</p>
                    ${mods.length > 0 ? `<p style="font-size:12px;color:#9ca3af;margin:4px 0 0;">${mods.join(', ')}</p>` : ''}
                    ${note ? `<p style="font-size:12px;color:#9ca3af;font-style:italic;margin:4px 0 0;">&ldquo;${note}&rdquo;</p>` : ''}
                </td>
                <td align="right" style="vertical-align:top;">
                    <p style="font-size:14px;font-weight:600;color:#111827;margin:0;white-space:nowrap;">${fmt(item.totalPrice)}</p>
                </td>
            </tr></table>
        </td></tr>`;
    }).join('');

    const tipRow = tipAmount > 0
        ? `<tr>
            <td style="font-size:13px;color:#6b7280;padding:3px 0;">Tip</td>
            <td align="right" style="font-size:13px;color:#6b7280;">${fmt(tipAmount)}</td>
           </tr>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

      <tr><td style="background-color:#0d1f12;padding:36px 32px;text-align:center;">
        <p style="color:#4ade80;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 10px;">Grum's Sub Shoppe</p>
        <h1 style="color:#ffffff;font-size:30px;font-weight:900;font-style:italic;text-transform:uppercase;margin:0;">Order Confirmed!</h1>
      </td></tr>

      <tr><td style="background-color:#166534;padding:14px 32px;text-align:center;">
        <p style="color:#ffffff;font-size:14px;margin:0;">&#128336; Pickup: <strong>${pickupNote}</strong></p>
      </td></tr>

      <tr><td style="padding:32px;">
        <p style="color:#374151;font-size:15px;margin:0 0 24px;">Hi <strong>${firstName}</strong>, thanks for your order! Here's what we have for you:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
          <tr><td style="background-color:#f9fafb;padding:10px 16px;">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#6b7280;margin:0;">Your Order</p>
          </td></tr>
          ${itemRows}
          <tr><td style="padding:14px 16px;border-top:1px solid #e5e7eb;background-color:#f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#6b7280;padding:3px 0;">Subtotal</td>
                <td align="right" style="font-size:13px;color:#6b7280;">${fmt(total)}</td>
              </tr>
              ${tipRow}
              <tr>
                <td style="font-size:15px;font-weight:700;color:#111827;padding-top:10px;border-top:1px solid #e5e7eb;">Total</td>
                <td align="right" style="font-size:15px;font-weight:700;color:#111827;padding-top:10px;border-top:1px solid #e5e7eb;">${fmt(grossTotal)}</td>
              </tr>
            </table>
          </td></tr>
        </table>
        <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;">
          Questions? Call us at <a href="tel:+12163214781" style="color:#166534;font-weight:600;">(216) 321-4781</a>
        </p>
      </td></tr>

      <tr><td style="background-color:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">1776 Coventry Rd, Cleveland Heights, OH 44118</p>
        <p style="color:#9ca3af;font-size:12px;margin:6px 0 0;">Open Everyday &middot; 11am &ndash; 6pm</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}
