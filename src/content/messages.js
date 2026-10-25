import message10 from "./messages/10.json" with { type: "json" };
import message11 from "./messages/11.json" with { type: "json" };
import message13 from "./messages/13.json" with { type: "json" };
import message52 from "./messages/52.json" with { type: "json" };
import message81 from "./messages/81.json" with { type: "json" };
import message82 from "./messages/82.json" with { type: "json" };
import message104 from "./messages/104.json" with { type: "json" };

export const messages = [
  message10,
  message11,
  message13,
  message52,
  message81,
  message82,
  message104,
];
export const findMessage = (number) =>
  messages.find((message) => message.number === number);
