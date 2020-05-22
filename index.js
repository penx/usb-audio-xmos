import { bmRequestType, DIRECTION, TYPE, RECIPIENT } from "bmrequesttype";
import { CUR, FU_VOLUME_CONTROL } from "usb-audio";

export const FU_USBIN = 11; /* 0x0B */ /* Feature Unit: USB Audio device -> host */
export const FU_USBOUT = 10; /* 0x0A */ /* Feature Unit: USB Audio host -> device*/
export const ID_IT_USB = 2; /* 0x02 */ /* Input terminal: USB streaming */
export const ID_IT_AUD = 1; /* 0x01 */ /* Input terminal: Analogue input */
export const ID_OT_USB = 22; /* 0x16 */ /* Output terminal: USB streaming */
export const ID_OT_AUD = 20; /* 0x14 */ /* Output terminal: Analogue output */
export const ID_CLKSEL = 40; /* 0x28 */ /* Clock selector ID */
export const ID_CLKSRC_INT = 41; /* 0x29 */ /* Clock source ID (internal) */
export const ID_CLKSRC_SPDIF = 42; /* 0x2A */ /* Clock source ID (external) */
export const ID_CLKSRC_ADAT = 43; /* 0x2B */ /* Clock source ID (external) */
export const ID_XU_MIXSEL = 50; /* 0x32 */
export const ID_XU_OUT = 51; /* 0x33 */
export const ID_XU_IN = 52; /* 0x34 */
export const ID_MIXER_1 = 60; /* 0x3C */

export const OUT = bmRequestType(
  DIRECTION.Out,
  TYPE.Class,
  RECIPIENT.Interface
);
export const IN = bmRequestType(DIRECTION.In, TYPE.Class, RECIPIENT.Interface);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const dataToBuffer = (data) => {
  if (data < -0x8000 || data > 0xffff) {
    throw new Error("Data out of bounds. Unsigned values should be between 0x0000 and 0xffff, signed values should be between -0x8000 and 0x7fff");
  }
  return new Uint8Array([data & 0xff, (data >> 8) & 0xff]);
};

// return controlTransfer that are compatible with lib usb (e.g. via https://github.com/tessel/node-usb)
// argument variables are in decibels, USB Audio uses a signed 32 bit int in increments of 1/256 db
export const volume = (v, bus = 0, min = -128, max=0) => {
  return {
    bmRequestType: OUT,
    bRequest: CUR,
    wValue: (FU_VOLUME_CONTROL << 8) + bus,
    wIndex: FU_USBOUT << 8,
    data: dataToBuffer(clamp(v, min, max) << 8),
  };
};

export const mixer = (gain, node = 1, min = -128, max=0) => {
  return {
    bmRequestType: OUT,
    bRequest: CUR,
    wValue: node,
    wIndex: ID_MIXER_1 << 8,
    data: dataToBuffer(clamp(gain, min, max) << 8),
  };
};
