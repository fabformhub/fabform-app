import { Button, Label, Input, TextArea, Checkbox, Dropdown, } from '../components/ui';
import { Welcome, ShortText, LongText, Select, DatePicker, DropdownBlock, OpinionScale, StarRating, Signature, Number, PhoneNumber, Statement, ThankYou, Website, Scheduler, FileUploader, Email, YesNo, CheckboxBlock, MoodMeter, Stripe } from '../blocks';

export function getComponent(componentName) {
  const components = {
    Button,
    Label,
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
    Signature,
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
    MoodMeter,
    Stripe
  };
  return components[componentName] || null;
}
