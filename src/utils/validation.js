class Validator {
  constructor(value) {
    this.value = value;
    this.error = null;
  }

  required(msg = 'This field is required.') {
    if (!this.error && (this.value === '' || this.value == null)) {
      this.error = msg;
    }
    return this;
  }

  email(msg = 'Invalid email format.') {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.error && this.value && !regex.test(this.value)) {
      this.error = msg;
    }
    return this;
  }

  url(msg = 'Invalid URL.') {
    const regex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (!this.error && this.value && !regex.test(this.value)) {
      this.error = msg;
    }
    return this;
  }

  min(len, msg) {
    if (!this.error && this.value?.length < len) {
      this.error = msg || `Minimum ${len} characters required.`;
    }
    return this;
  }

  max(len, msg) {
    if (!this.error && this.value?.length > len) {
      this.error = msg || `Maximum ${len} characters allowed.`;
    }
    return this;
  }

  minSelection(msg = 'Please select at least one option.') {
    if (!this.error && (!this.value || this.value.length === 0)) {
      this.error = msg;
    }
    return this;
  }

  result() {
    return this.error;
  }
}

export function validateBlock({ meta, value }) {
  if (!meta?.component) return null;

  const { required } = meta.validation || {};
  const { minCharacters, maxCharacters } = meta.props || {};
  const v = new Validator(value);

  const applyRequired = () => (required ? v.required() : v);

  const chain = {
    ShortText: () => applyRequired(),
    DropdownBlock: () => applyRequired(),
    StarRatings: () => applyRequired(),
    DatePicker: () => applyRequired(),
    Number: () => applyRequired(),
    PhoneNumber: () => applyRequired(),
    OpinionScale: () => applyRequired(),
    Signature: () => applyRequired(),
    Website: () => applyRequired().url(),
    Scheduler: () => applyRequired(),
    Email: () => applyRequired().email(),
    LongText: () => applyRequired().min(minCharacters),
    Select: () => applyRequired().minSelection(),
    YesNo: () => applyRequired(),
    CheckboxBlock: () => applyRequired(),
    Website: () => applyRequired().url(),
    
  };

  return chain[meta.component]?.().result() || null;
}
