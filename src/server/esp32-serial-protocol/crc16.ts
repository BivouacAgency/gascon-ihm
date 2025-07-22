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
  
  // Get the payload data
  const payloadData = data.subarray(0, data.length - 2);
  // Get the received CRC low byte
  const receivedCrcLo = data[data.length - 2];
  // Get the received CRC high byte
  const receivedCrcHi = data[data.length - 1];
  
  // If the received CRC low byte or high byte is undefined, return false
  if (receivedCrcLo === undefined || receivedCrcHi === undefined) {
    return false;
  }
  
  // Calculate the received CRC
  const receivedCrc = (receivedCrcHi << 8) | receivedCrcLo;
  
  // Calculate the calculated CRC
  const calculatedCrc = crc16(payloadData);
  
  // Return true if the calculated CRC is equal to the received CRC
  return calculatedCrc === receivedCrc;
}

/**
 * Appends CRC-16 to data (Little Endian)
 */
export function appendCrc16(data: Buffer): Buffer {
  // Calculate the CRC
  const crc = crc16(data);
  // Create a new buffer with the data length + 2
  const result = Buffer.alloc(data.length + 2);
  // Copy the data to the result
  data.copy(result, 0);
  // Set the CRC low byte
  result[data.length] = crc & 0xFF;     // CRC low byte
  // Set the CRC high byte
  result[data.length + 1] = crc >> 8;   // CRC high byte
  return result;
} 