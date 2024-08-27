document.addEventListener("DOMContentLoaded", function() {
    // Function to generate PDF
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
                doc.addImage(logoImg, 'JPEG', 10, 10, 20, 20);
                
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
                doc.text(`Identification Number: ${formValues.identificationNumber}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Exam Preparing For: ${formValues.examPreparing}`, 10, yOffset);
                yOffset += 10;

                // Add preferred slots
                doc.text(`Preferred Slots: ${formValues.preferredSlots}`, 10, yOffset);
                yOffset += 10;

                doc.text(`Amount Paid: ${formValues.amountPaid}`, 10, yOffset);
                yOffset += 10;
                doc.text(`Date: ${formValues.date}`, 10, yOffset);

                // Add terms and conditions
                yOffset += 10;
                doc.setFontSize(10);
                doc.text("Terms and Conditions", 10, yOffset);
                yOffset += 10;

                const terms = [
                    "1. Fee once deposited will not be REFUNDED.",
                    "2. If you are absent, it will be your responsibility.",
                    "3. You can leave your books and copy on your desk only if you are in the full timing slot.",
                    "4. If you choose full-time and are absent for more than 7 days without informing, your seat will not be reserved.",
                    "5. If you do not maintain the attendance register on a daily basis, you will be considered absent and your seat will be removed."
                ];

                for (const line of terms) {
                    if (yOffset > doc.internal.pageSize.height - 30) { // Check if we are close to the bottom of the page
                        doc.addPage(); // Add a new page if needed
                        yOffset = 10; // Reset yOffset for new page
                    }
                    doc.text(line, 10, yOffset);
                    yOffset += 10;
                }

                // Positioning for student image
                if (formValues.studentImage) {
                    const img = new Image();
                    img.src = formValues.studentImage;
                    img.onload = function() {
                        const imgWidth = 40;
                        const imgHeight = 40;
                        const pageHeight = doc.internal.pageSize.height;
                        const marginBottom = 210;
                        const imgX = 150;
                        const imgY = pageHeight - imgHeight - marginBottom;

                        doc.addImage(img, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                        // Download PDF after adding the image
                        doc.save(`${formValues.firstName}_MembershipForm.pdf`);
                    };
                } else {
                    doc.save(`${formValues.firstName}_MembershipForm.pdf`);
                }
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    // Function to get form values
    function getFormValues() {
        return {
            member_id: document.getElementById("member_id").value,
            firstName: document.getElementById("firstName").value,
            fathersName: document.getElementById("fathersName").value,
            currentAddress: document.getElementById("currentAddress").value,
            guardiansAddress: document.getElementById("guardiansAddress").value,
            gender: document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : '',
            contactNo: document.getElementById("contactNo").value,
            guardiansNo: document.getElementById("guardiansNo").value,
            identificationType: document.getElementById("identificationType").value,
            identificationNumber: document.getElementById("identificationNumber").value,
            examPreparing: document.getElementById("examPreparing").value,
            preferredSlots: document.getElementById("preferredSlots").value,
            amountPaid: document.getElementById("amountPaid").value,
            date: document.getElementById("date").value,
            termsAndConditionsAccepted: document.getElementById("termsAndConditions").checked,
            studentImage: document.getElementById("studentImagePreview").src
        };
    }

    // Function to preview student image
    window.previewStudentImage = function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            const output = document.getElementById('studentImagePreview');
            output.src = reader.result;
            output.style.display = 'block';
        };
        reader.readAsDataURL(event.target.files[0]);
    };
});
