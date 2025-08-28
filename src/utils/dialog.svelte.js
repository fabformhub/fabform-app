// dialog.svelte.js

export const dialog = $state({
  show: false,
  title: "",
  message: "",
  cancelLabel: "Cancel",  
  confirmLabel: "Yes",
  component: null,
  props: null,
  resolve: null
});

export function openDialog(title, message, cancelLabel = "Cancel", confirmLabel = "Yes", component = null, props = null) {
  return new Promise((resolve) => {
    dialog.title = title;
    dialog.message = message;
    dialog.cancelLabel = cancelLabel; 
    dialog.confirmLabel = confirmLabel;
    dialog.show = true;
    dialog.component = component;
    dialog.props = props;
    dialog.resolve = resolve;
  });
}

export function closeDialog(result) {
  if (dialog.resolve) {
    dialog.resolve(result);
    dialog.resolve = null;
    dialog.component = null;
  }
  dialog.show = false;
}
