import {
  encode as msgpackEncode,
  decode as msgpackDecode,
} from "@msgpack/msgpack";
import { MessageType, type WebSocketMessage, SocketEvent } from "./types";

const MessageTypeSectionBits = 4; // Message type represented by 4 bits
const ReservedBits = 4; // Unused bits
const EventNameLengthSectionBits = 8; // Event Name Length represented by 8 bits or 1 byte (event name can be of max 256 bytes/characters)
const MetaDataLengthSectionBits = 16; // Meta Data Length represented by 16 bites or 2 bytes (meta data can be of max 65,536 bytes/characters)
const MetaBytes =
  (MessageTypeSectionBits +
    ReservedBits +
    EventNameLengthSectionBits +
    MetaDataLengthSectionBits) /
  8; // Total size of the meta bytes in a message or minimum size of the message
const MaxEventNameLength = 1 << EventNameLengthSectionBits;

export class MessageTranscoder {
  constructor() {}

  encode(message: WebSocketMessage<unknown>): ArrayBuffer | undefined {
    try {
      const eventNameLength = message.eventName.length;
      if (eventNameLength > MaxEventNameLength)
        throw new Error(`Event name length is greater than ${eventNameLength}`);

      const encodedMeta = msgpackEncode(message.meta);
      const metaLength = encodedMeta.length;
      if (metaLength > 65535)
        throw new Error(`Cannot encode meta data greater than 2 bytes in size`);

      const encodedPayload = msgpackEncode(message.payload);

      const totalBytes =
        MetaBytes + eventNameLength + metaLength + encodedPayload.length;
      const buffer = new ArrayBuffer(totalBytes);
      const bytes = new Uint8Array(buffer);

      // Encode Message Type
      bytes[0] = message.type << 4;

      // Encode Event Name Length
      bytes[1] = eventNameLength;

      // Encode Event Name
      for (let i = 0; i < eventNameLength; i++) {
        bytes[2 + i] = message.eventName.charCodeAt(i);
      }

      // Encode Meta Data Length
      let offset = 2 + eventNameLength;
      bytes[offset] = encodedMeta.length & 0xff; // Get the low byte
      bytes[++offset] = (encodedMeta.length >> 8) & 0xff; // Get the high byte

      // Encode Meta Data
      bytes.set(encodedMeta, ++offset);

      // Encode Payload
      offset += encodedMeta.length;
      bytes.set(encodedPayload, offset);

      return buffer;
    } catch (err) {
      console.log("Failed to encode message: ", err);
    }
  }

  decode(buffer: ArrayBuffer): WebSocketMessage<unknown> | undefined {
    try {
      if (buffer.byteLength < 4) {
        throw new Error("Message too short to be decoded");
      }

      const bytes = new Uint8Array(buffer);

      // Decode Message Type
      const messageType = ((bytes[0] & 0xf0) >> 4) as MessageType;

      // Decode Event Name Length
      const eventNameLength = bytes[1];

      // Decode Event Name
      let offset = 2;
      const eventName = String.fromCharCode(
        ...bytes.subarray(offset, offset + eventNameLength)
      );

      // Decode Meta Data Length
      offset += eventNameLength;
      const metaLength = (bytes[offset + 1] << 8) | bytes[offset];

      // Decode Meta Data
      offset += 2;
      const meta = msgpackDecode(
        bytes.subarray(offset, offset + metaLength)
      ) as Record<string, unknown> | null;

      // Extract the payload from the remaining bytes
      offset += metaLength;

      const encodedPayload = bytes.subarray(offset);

      let payload;
      if (encodedPayload.length) payload = msgpackDecode(encodedPayload);

      // Create and return the WebSocketMessage object
      const decodedMessage: WebSocketMessage<unknown> = {
        type: messageType as MessageType,
        meta,
        eventName: eventName as SocketEvent,
        payload,
      };

      return decodedMessage;
    } catch (e) {
      console.log("Failed to decode message: ", e);
    }
  }
}
