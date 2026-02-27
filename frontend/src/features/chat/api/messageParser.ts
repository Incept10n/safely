import type { ResponseMessageArray, ResponseMessages } from './types';

const parse = (messages: ResponseMessages): ResponseMessageArray => {
  return JSON.parse(messages) as ResponseMessageArray;
};

export const messageParser = { parse };
