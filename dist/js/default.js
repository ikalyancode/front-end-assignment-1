document.addEventListener("DOMContentLoaded", async () => {
    const formContainer = document.getElementById("formContainer");
    const form = document.getElementById("dynamicForm");
    const statusMessage = document.getElementById("statusMessage");

   
    async function fetchQuestions() {
        try {
            console.log("Fetching questions...");
            const response = await fetch("https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d");

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Fetched Data:", data);
            return data; 
        } catch (error) {
            console.error("Fetch API Error:", error);
            statusMessage.textContent = "Error loading form. Please refresh.";
            return [];
        }
    }

   
    async function renderForm() {
        const questions = await fetchQuestions();

        if (questions.length === 0) return; 

        questions.forEach(q => {
            let field;

            if (q.type === "radio") {
                field = document.createElement("fieldset");
                field.innerHTML = `<legend>${q.legend}</legend>`;
                q.options.forEach(option => {
                    const radioWrapper = document.createElement("div");
                    radioWrapper.innerHTML = `
                        <input type="radio" id="${option.id}" name="${q.name}" value="${option.value}" ${q.required ? "required" : ""}>
                        <label for="${option.id}">${option.label}</label>
                    `;
                    field.appendChild(radioWrapper);
                });
            } else {
                field = document.createElement("div");
                field.innerHTML = `
                    <label for="${q.id}">${q.label} ${q.required ? "*" : ""}</label>
                    <input 
                        type="${q.type}" 
                        id="${q.id}" 
                        name="${q.name}" 
                        ${q.pattern ? `pattern="${q.pattern}"` : ""} 
                        ${q.required ? "required" : ""} 
                        aria-describedby="${q.id}-error"
                    >
                    <span id="${q.id}-error" class="error-message" aria-live="polite"></span>
                `;
            }

            formContainer.appendChild(field);
        });
    }

    // Form validation handling
    function validateInput(event) {
        const input = event.target;
        const errorSpan = document.getElementById(`${input.id}-error`);

        if (!errorSpan) return; // Prevent error if span is missing

        if (input.validity.valueMissing) {
            errorSpan.textContent = "This field is required.";
        } else if (input.validity.patternMismatch) {
            errorSpan.textContent = "Invalid format.";
        } else {
            errorSpan.textContent = "";
        }
    }

    form.addEventListener("input", validateInput);
    form.addEventListener("blur", validateInput, true);

    // Form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            statusMessage.textContent = "Please correct the errors before submitting.";
            return;
        }

        const formData = new FormData(form);
        const payload = [];

        for (const [name, value] of formData.entries()) {
            payload.push({ name, value });
        }

        try {
            console.log("Submitting form with data:", JSON.stringify(payload));

            const response = await fetch("https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.text(); 
            console.log("API Response:", result);

            if (response.ok && result === "good") {
                statusMessage.textContent = "Form submitted successfully!";
                form.reset();
            } else {
                throw new Error(`Unexpected API response: ${result}`);
            }
        } catch (error) {
            console.error("Submission Error:", error);
            statusMessage.textContent = "Error submitting form. Please try again.";
        }
    });

    
    renderForm();
});
