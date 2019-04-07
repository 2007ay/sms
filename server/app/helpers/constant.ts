export const HTTPCODES = {
  SUCCESS: 200,
  NO_CONT: 204,
  BAD_REQUEST: 400,
  APP_ERROR: 500,
  NOT_FOUND: 404
};

export const emailRegx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const MESSAGES = {
  INVALID_STUDENT_LIST: 'Please send the valid student list',
  INVALIED_EMAIL_LIST: 'Please provide valid emails',
  INSERTED_SUCCESSFULLY: 'Student list inseted successfully',
  STUDENT_SUSPENDED: 'Suspended successfully;'
};

export const ERR_MESSAGES = {
  STUDENT_EXIST: 'Student already exist',
  EMAIL_MISSING: 'Unable to found record',
  NOTIFICATION_MISSING: 'Emaild is not found in records'
};
