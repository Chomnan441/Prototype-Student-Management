import type { StudentDraft, StudentFormErrors } from "../types";
import { todayISO } from "./format";

const NAME_LIMIT = 80;
const NOTE_LIMIT = 500;

export function validateStudentDraft(draft: StudentDraft): StudentFormErrors {
  const errors: StudentFormErrors = {};
  const firstName = draft.firstName.trim();
  const lastName = draft.lastName.trim();
  const nickname = draft.nickname.trim();
  const parentName = draft.parentName.trim();
  const phone = draft.phone.trim();
  const note = draft.note.trim();

  if (!firstName) {
    errors.firstName = "First name is required.";
  } else if (firstName.length > NAME_LIMIT) {
    errors.firstName = `First name must be ${NAME_LIMIT} characters or fewer.`;
  }

  if (!lastName) {
    errors.lastName = "Last name is required.";
  } else if (lastName.length > NAME_LIMIT) {
    errors.lastName = `Last name must be ${NAME_LIMIT} characters or fewer.`;
  }

  if (nickname.length > 40) {
    errors.nickname = "Nickname must be 40 characters or fewer.";
  }

  if (parentName.length > NAME_LIMIT) {
    errors.parentName = `Parent name must be ${NAME_LIMIT} characters or fewer.`;
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (!/^0[689]\d{8}$/.test(digits)) {
      errors.phone = "Enter a 10-digit Thai mobile number, for example 081-234-5678.";
    }
  }

  if (!draft.registrationDate) {
    errors.registrationDate = "Registration date is required.";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.registrationDate)) {
    errors.registrationDate = "Enter a valid registration date.";
  } else if (draft.registrationDate > todayISO()) {
    errors.registrationDate = "Registration date cannot be in the future.";
  }

  if (note.length > NOTE_LIMIT) {
    errors.note = `Note must be ${NOTE_LIMIT} characters or fewer.`;
  }

  return errors;
}

export function hasErrors(errors: StudentFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
