import { Button, Input, TextArea, Checkbox, Dropdown, } from '../components/ui';
import { Welcome, ShortText, LongText, Select, DatePicker, DropdownBlock, OpinionScale, StarRating, Number, PhoneNumber, Statement, ThankYou, Website, Scheduler, FileUploader, Email, YesNo, CheckboxBlock, MoodMeter } from '../blocks';

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
    MoodMeter,
  };
  return components[componentName] || null;
}
