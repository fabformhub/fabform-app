import { Button, Input, TextArea, Checkbox, Dropdown, } from '$lib/fabform/ui';
import { Welcome, ShortText, LongText, Select, DatePicker, DropdownBlock, OpinionScale, StarRating, Number, PhoneNumber, Statement, Website, Scheduler, FileUploader, Email, YesNo, CheckboxBlock, Signature, MoodMeter,TimeSlotPicker,ThankYou } from '$lib/fabform/blocks';

export function getComponent(componentName) {
  const components = {
    Button,
    Input,
    TextArea,
    Checkbox,
    Dropdown,
    Welcome,
    ShortText,
    LongText,
    DatePicker,
    TextArea,
    Button,
    Checkbox,
    Dropdown,
    Select,
    DropdownBlock,
    StarRating,
    OpinionScale,
    Statement,
    Number,
    PhoneNumber,
    ThankYou,
    Website,
    Scheduler,
    FileUploader,
    Email,
    YesNo,
    CheckboxBlock,
    Signature,
    MoodMeter,
    TimeSlotPicker
  };
  return components[componentName] || null;
}
