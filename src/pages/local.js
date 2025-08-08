// updateFormMeta.js

import { getFormById, updateForm } from './src/services/formService.js';

// Get form ID and new meta from command-line arguments
const formId = "qK5KSORVIbQU"  
const newMeta =`{"theme":"dark"}`
}


async function main() {
  const result = await getFormById(formId);

  if (!result.success) {
    console.error("❌ Error fetching form:", result.error);
    return;
  }

  const form = result.data.form;

  form.meta = {
    ...(form.meta || {}),
    ...newMeta,
  };

  const updateResult = await updateForm(form);

  if (updateResult.success) {
    console.log("✅ Form meta updated successfully.");
    console.log("New form meta:", updateResult.data.form.meta);
  } else {
    console.error("❌ Failed to update form:", updateResult.error);
  }
}

main();

