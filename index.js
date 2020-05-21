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

export const OUT = bmRequestType(DIRECTION.Out, TYPE.Class, RECIPIENT.Interface);
export const IN = bmRequestType(DIRECTION.In, TYPE.Class, RECIPIENT.Interface);

const dataToBuffer = (data) => {
    if (data < 0 || data > 0xffff) {
      throw new Error("Data out of bounds");
    }
    return new Uint8Array([(data >> 8) & 0xff, data & 0xff]);
  };

// return controlTransfer that are compatible with lib usb (e.g. via https://github.com/tessel/node-usb)
export const volume = (level, bus = 0) => {
  return {
    bmRequestType: OUT,
    bRequest: CUR,
    wValue: (FU_VOLUME_CONTROL << 2) + bus,
    wIndex: FU_USBOUT << 2,
    data: dataToBuffer(level),
  };
};

export const mixer = (gain, node = 1) => {
  return {
    bmRequestType: OUT,
    bRequest: CUR,
    wValue: node,
    wIndex: ID_MIXER_1 << 2,
    data: dataToBuffer(gain),
  };
};
