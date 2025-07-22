/**
 * COBS (Consistent Overhead Byte Stuffing) implementation
 * Matches the ESP32 implementation exactly
 */

/**
 * COBS decode function - converts COBS-encoded data back to original
 * @param encoded - COBS-encoded data
 * @returns decoded data
 */
export function cobsDecode(encoded: Buffer): Buffer {
  if (encoded.length === 0) {
    return Buffer.alloc(0);
  }

  const decoded: number[] = [];
  let i = 0;

  // While we are not at the end of the encoded data
  while (i < encoded.length) {
    const code = encoded[i];
    if (code === undefined) break;
    
    i++;

    // Copy the next (code - 1) bytes directly
    for (let j = 1; j < code && i < encoded.length; j++) {
      const byte = encoded[i];
      if (byte !== undefined) {
        decoded.push(byte);
      }
      i++;
    }

    // Add a zero byte if code is not 0xFF and we're not at the end
    // For 0x01 codes, this inserts a single zero
    if (code !== 0xFF && i < encoded.length) {
      decoded.push(0);
    }
  }

  // Remove the sentinel zero from the end if present
  // According to the protocol, the sentinel zero is "pushed out" and appears as SEP 0x00 after EOF
  if (decoded.length > 0 && decoded[decoded.length - 1] === 0) {
    decoded.pop();
  }

  return Buffer.from(decoded);
}

/**
 * COBS encode function - encodes data to eliminate zero bytes
 * @param data - Original data
 * @returns COBS-encoded data
 */
export function cobsEncode(data: Buffer): Buffer {
  if (data.length === 0) {
    return Buffer.from([1]); // Single overhead byte for empty data
  }

  const encoded: number[] = [];
  let codeIndex = 0;
  let code = 1;

  encoded.push(0); // Placeholder for first code byte

  for (const byte of data) {
    if (byte === undefined) continue;

    // If the byte is not a zero, add it to the encoded data
    if (byte !== 0) {
      encoded.push(byte);
      code++;
      
      // If the code is 0xFF, add a new code byte
      if (code === 0xFF) {
        encoded[codeIndex] = code;
        codeIndex = encoded.length;
        encoded.push(0); // Placeholder for next code byte
        code = 1;
      }
    } else {
      // If the byte is a zero, add a new code byte
      encoded[codeIndex] = code;
      codeIndex = encoded.length;
      encoded.push(0); // Placeholder for next code byte
      code = 1;
    }
  }

  // Add the last code byte
  encoded[codeIndex] = code;
  return Buffer.from(encoded);
} 