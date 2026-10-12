"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { Address, AddressInput } from "@/lib/shop/types";
import { AccentButton } from "./accent-button";
import { FormError, SelectField, TextField } from "./form-fields";

/** States and union territories, as shoppers and couriers write them. */
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

/**
 * A 10-digit Indian mobile number, with or without +91 or a leading 0, as `+91XXXXXXXXXX`.
 * Null when it isn't one.
 */
export function normalizeIndianPhone(value: string): string | null {
  const digits = value.replace(/[\s()-]/g, "");
  const match = /^(?:\+?91|0)?([6-9]\d{9})$/.exec(digits);
  return match ? `+91${match[1]}` : null;
}

/** How a stored `+91XXXXXXXXXX` number reads in the field. */
export function phoneForField(value: string | null | undefined): string {
  if (!value) return "";
  const match = /^\+91(\d{10})$/.exec(value);
  return match ? match[1] : value;
}

type Fields = Record<
  "fullName" | "company" | "streetLine1" | "streetLine2" | "city" | "province" | "postalCode" | "phoneNumber",
  string
>;
type FieldErrors = Partial<Record<keyof Fields, string>>;

function initialFields(initial: Partial<Address> | null | undefined): Fields {
  return {
    fullName: initial?.fullName ?? "",
    company: initial?.company ?? "",
    streetLine1: initial?.streetLine1 ?? "",
    streetLine2: initial?.streetLine2 ?? "",
    city: initial?.city ?? "",
    province: initial?.province ?? "",
    postalCode: initial?.postalCode ?? "",
    phoneNumber: phoneForField(initial?.phoneNumber),
  };
}

function validate(fields: Fields): { input?: AddressInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  if (!fields.fullName.trim()) errors.fullName = "Enter the recipient's name.";
  if (!fields.streetLine1.trim()) errors.streetLine1 = "Enter the house number and street.";
  if (!fields.city.trim()) errors.city = "Enter the city or town.";
  if (!fields.province) errors.province = "Choose the state.";
  if (!/^\d{6}$/.test(fields.postalCode.trim())) errors.postalCode = "Enter a 6-digit PIN code.";
  const phone = normalizeIndianPhone(fields.phoneNumber);
  if (!phone) errors.phoneNumber = "Enter a 10-digit mobile number.";
  if (Object.keys(errors).length || !phone) return { errors };
  return {
    errors,
    input: {
      fullName: fields.fullName.trim(),
      company: fields.company.trim() || undefined,
      streetLine1: fields.streetLine1.trim(),
      streetLine2: fields.streetLine2.trim() || undefined,
      city: fields.city.trim(),
      province: fields.province,
      postalCode: fields.postalCode.trim(),
      countryCode: "IN",
      phoneNumber: phone,
    },
  };
}

export interface AddressFormProps {
  readonly initial?: Partial<Address> | null;
  readonly submitLabel: string;
  readonly pending?: boolean;
  /** The API's refusal, shown above the button. */
  readonly error?: ReactNode;
  /** Extra controls above the button, e.g. "save to my account". */
  readonly extra?: ReactNode;
  readonly onSubmit: (input: AddressInput) => void;
  readonly onCancel?: () => void;
}

/** An Indian delivery or billing address. */
export function AddressForm({ initial, submitLabel, pending, error, extra, onSubmit, onCancel }: AddressFormProps) {
  const [fields, setFields] = useState<Fields>(() => initialFields(initial));
  const [errors, setErrors] = useState<FieldErrors>({});
  const knownState = !fields.province || (INDIAN_STATES as readonly string[]).includes(fields.province);

  const set = (name: keyof Fields) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setFields((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = validate(fields);
    setErrors(result.errors);
    if (result.input) onSubmit(result.input);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Full name"
          autoComplete="name"
          value={fields.fullName}
          onChange={set("fullName")}
          maxLength={100}
          error={errors.fullName}
        />
        <TextField
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="98765 43210"
          value={fields.phoneNumber}
          onChange={set("phoneNumber")}
          maxLength={16}
          error={errors.phoneNumber}
          hint="The seller may call about the delivery."
        />
        <TextField
          label="House number, building and street"
          autoComplete="address-line1"
          value={fields.streetLine1}
          onChange={set("streetLine1")}
          maxLength={200}
          error={errors.streetLine1}
          className="sm:col-span-2"
        />
        <TextField
          label="Area, landmark"
          optional
          autoComplete="address-line2"
          value={fields.streetLine2}
          onChange={set("streetLine2")}
          maxLength={200}
          className="sm:col-span-2"
        />
        <TextField
          label="City or town"
          autoComplete="address-level2"
          value={fields.city}
          onChange={set("city")}
          maxLength={80}
          error={errors.city}
        />
        <TextField
          label="PIN code"
          inputMode="numeric"
          autoComplete="postal-code"
          value={fields.postalCode}
          onChange={set("postalCode")}
          maxLength={6}
          error={errors.postalCode}
        />
        <SelectField
          label="State"
          autoComplete="address-level1"
          value={fields.province}
          onChange={set("province")}
          error={errors.province}
        >
          <option value="">Choose a state</option>
          {!knownState && <option value={fields.province}>{fields.province}</option>}
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </SelectField>
        <TextField
          label="Company"
          optional
          autoComplete="organization"
          value={fields.company}
          onChange={set("company")}
          maxLength={100}
        />
      </div>
      {extra}
      {error && <FormError>{error}</FormError>}
      <div className="flex flex-wrap items-center gap-3">
        <AccentButton type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </AccentButton>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
