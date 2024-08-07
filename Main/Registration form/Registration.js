document.addEventListener("DOMContentLoaded", function() {
    window.generatePDF = async function() {
        const { jsPDF } = window.jspdf;

        try {
            const formValues = getFormValues();

            if (!formValues.termsAndConditionsAccepted) {
                alert("You must agree to the terms and conditions before submitting.");
                return;
            }

            const doc = new jsPDF();
            const logoImg = new Image();
            logoImg.src = 'Sinha library.jpg';

            logoImg.onload = async function() {
                // Add logo
                doc.addImage(logoImg, 'JPEG', 10, 10, 30, 30);
                
                // Add title
                doc.setFontSize(22);
                doc.text("SINHA LIBRARY", 70, 20);
                doc.setFontSize(16);
                doc.text("Best Place For Self Study", 70, 30);
                doc.text("LIBRARY MEMBERSHIP FORM", 70, 40);

                // Add form data
                doc.setFontSize(12);
                let yOffset = 60;
                doc.text(`Member ID: ${formValues.member_id}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Full Name: ${formValues.firstName}`, 10, yOffset);
                yOffset += 10;
                // doc.text(`Member ID: ${formValues.member_id}`, 10, yOffset);
                // yOffset += 10;
                doc.text(`Father's Name: ${formValues.fathersName}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Current Address: ${formValues.currentAddress}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Guardian's Address: ${formValues.guardiansAddress}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Gender: ${formValues.gender}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Contact No.: ${formValues.contactNo}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Guardian's No.: ${formValues.guardiansNo}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Identification Proof Type: ${formValues.identificationType}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Exam Preparing For: ${formValues.examPreparing}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Slots: ${formValues.slots.join(', ')}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Amount Paid: ${formValues.amountPaid}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Date: ${formValues.date}`, 10, yOffset);
                yOffset += 10;

                // Add student image, student signature, and authorized signature in a row
                const images = [
                    { id: 'studentImageFile', label: "Student's Image" },
                    { id: 'studentSignatureFile', label: "Student's Signature" },
                    { id: 'authorizedSignatureFile', label: "Authorized Signature" }
                ];

                let xOffset = 10;
                for (const imgInfo of images) {
                    await addImageToPDF(doc, imgInfo.id, xOffset, yOffset, imgInfo.label);
                    xOffset += 50; // Adjust the offset to place images in a row
                }

                // Add terms and conditions
                yOffset += 60; // Adjust this value based on the size of the image
                doc.setFontSize(10);
                doc.text("Terms and Conditions", 10, yOffset);
                yOffset += 10;
                doc.text(" 1. Fee Once deposite will not be REFUNDED", 10, yOffset);
                yOffset += 10;
                doc.text("If you ae absent it will be your responsibility", 10, yOffset);
                yOffset += 10;
                doc.text("3. You can leave your books and copy on your desk only if you are in full timing slot.", 10, yOffset);
                yOffset += 10;
                doc.text(" 4. if you choose full-time and you are absent for more than 7 days without informing, your seat will not be reserved.", 10, yOffset);
                yOffset += 10;
                doc.text(" 5. If you are not maintain the attendance register on daily basis then you are considered as absent ans your set will be removed.", 10, yOffset);

                doc.save("membership_form.pdf");
            };

            logoImg.onerror = function() {
                console.error("Failed to load the logo image");
            };
        } catch (error) {
            console.error(error);
        }
    };

    function getFormValues() {
        return {
            member_id: document.getElementById('member_id').value,
            firstName: document.getElementById('firstName').value,
            fathersName: document.getElementById('fathersName').value,
            currentAddress: document.getElementById('currentAddress').value,
            guardiansAddress: document.getElementById('guardiansAddress').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            contactNo: document.getElementById('contactNo').value,
            guardiansNo: document.getElementById('guardiansNo').value,
            identificationType: document.getElementById('identificationType').value,
            examPreparing: document.getElementById('examPreparing').value,
            slots: Array.from(document.querySelectorAll('input[name="slots"]:checked')).map(el => el.value),
            amountPaid: document.getElementById('amountPaid').value,
            date: document.getElementById('date').value,
            termsAndConditionsAccepted: document.getElementById('termsAndConditions').checked
        };
    }

    window.previewStudentImage = function(event) {
        const output = document.getElementById('studentImagePreview');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.style.display = 'block';
    };

    async function addImageToPDF(doc, inputId, xOffset, yOffset, label) {
        const inputFile = document.getElementById(inputId).files[0];
        if (inputFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function() {
                    doc.text(label, xOffset, yOffset);
                    doc.addImage(img, 'JPEG', xOffset, yOffset + 10, 30, 30);
                };
            };
            reader.readAsDataURL(inputFile);
            await new Promise(resolve => reader.onloadend = resolve);
        } else {
            doc.text(`No ${label}`, xOffset, yOffset);
        }
    }
});
