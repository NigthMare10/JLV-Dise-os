export const ADMIN_PIN_HASH = '744bcc5f5a497705b84a0061932fd2474daf38ac1b2b77ce39480146904dc991'; // SHA-256 of 'Sauceda1234'

export async function verifyPin(inputPin: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputPin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex === ADMIN_PIN_HASH;
}
