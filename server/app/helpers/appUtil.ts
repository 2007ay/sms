import { emailRegx } from './constant';
import { debug } from 'util';

export function ResponseSuccess(res, data, code) {
  return res.status(code).json({ success: true, data: data });
}

export function ResponseFailure(res, msg, code) {
  return res.status(code).json({ success: false, data: msg });
}

export function emailValidator(email) {
  if (!email) return false;
  else {
    return emailRegx.test(email.toLowerCase());
  }
}

export function getEmailIds(txt) {
  const matches = txt.match(/(^|@)([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) || [];
  matches.map((match) => {
    return match.split('@')[1].join('@');
  })
  return matches;
}

export function sqlParse(record) {
  return JSON.parse(JSON.stringify(record))
}
