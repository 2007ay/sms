import { emailRegx } from './constant';

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
  return matches.map((match) => match.substr(1));
}

export function sqlParse(record) {
  return JSON.parse(JSON.stringify(record))
}
