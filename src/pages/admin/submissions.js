// src/components/common/SubmissionForm.js
// A reusable component for creating forms with a simple layout.

import React from 'react';
import GetQuoteSubmission from '@/components/dashboard/GetQuoteSubmission';
import ContactSubmission from '@/components/dashboard/ContactSubmission';
function Submissions() {

  return (
    <>
     <GetQuoteSubmission/>
     <ContactSubmission/>
     </>
  );
}

export default Submissions;
