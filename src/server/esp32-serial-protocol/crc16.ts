/**
 * CRC-16-CCITT implementation
 * Polynomial: 0x1021
 * Initial value: 0xFFFF
 * Little Endian output (matches ESP32 implementation)
 */
export function crc16(data: Buffer, initialValue = 0xFFFF): number {
  let crc = initialValue;
  
  for (const byte of data) {
    if (byte === undefined) continue;
    crc ^= byte << 8;
    
    for (let bit = 0; bit < 8; bit++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  
  return crc & 0xFFFF;
}

/**
 * Validates CRC-16 for a frame
 * @param data - The data including the 2 CRC bytes at the end
 * @returns true if CRC is valid
 */
export function validateCrc16(data: Buffer): boolean {
  if (data.length < 2) return false;
  
  const payloadData = data.subarray(0, data.length - 2);
  const receivedCrcLo = data[data.length - 2];
  const receivedCrcHi = data[data.length - 1];
  
  if (receivedCrcLo === undefined || receivedCrcHi === undefined) {
    return false;
  }
  
  const receivedCrc = (receivedCrcHi << 8) | receivedCrcLo;
  
  const calculatedCrc = crc16(payloadData);
  
  return calculatedCrc === receivedCrc;
}

/**
 * Appends CRC-16 to data (Little Endian)
 */
export function appendCrc16(data: Buffer): Buffer {
  const crc = crc16(data);
  const result = Buffer.alloc(data.length + 2);
  data.copy(result, 0);
  result[data.length] = crc & 0xFF;     // CRC low byte
  result[data.length + 1] = crc >> 8;   // CRC high byte
  return result;
} 