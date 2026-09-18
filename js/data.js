const STATUS_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'employed', label: 'Employed (Private)' },
  { value: 'government', label: 'Government Employee' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'ofw', label: 'Overseas Filipino Worker (OFW)' },
]

function driversLicenseChecklist({ age, isFirstTime }) {
  const appointment = { required: true, detail: 'Book online via the LTO LTMS portal.' }
  const location = 'Nearest LTO Licensing Center or District Office'

  if (isFirstTime && age < 16) {
    return {
      eligible: false,
      notices: [
        {
          tone: 'warning',
          message:
            "You must be at least 16 years old to apply for a Student Permit, the first step toward getting a driver's license.",
        },
      ],
    }
  }

  if (!isFirstTime && age < 17) {
    return {
      eligible: false,
      notices: [
        {
          tone: 'warning',
          message:
            "Driver's licenses are only issued to applicants 17 years old and above. If you currently hold a Student Permit, select \"Yes\" as a first-time applicant.",
        },
      ],
    }
  }

  if (!isFirstTime) {
    return {
      requirements: [
        { label: "Current Driver's License", detail: 'Your existing license card, even if it has already expired.' },
        { label: 'Medical Certificate', detail: 'Issued by an LTO-accredited clinic and uploaded to the LTMS.' },
        {
          label: 'CDE Completion Certificate',
          detail: "Proof that you passed the Comprehensive Driver's Education (CDE) online exam.",
        },
      ],
      appointment,
      fees: '₱650.00 – ₱900.00 (license and computer fees; penalties apply to expired licenses)',
      location,
    }
  }

  const isStudentPermitStage = age < 17
  const requirements = [
    { label: 'PSA Birth Certificate', detail: 'Original copy with one photocopy.' },
    { label: 'TDC Certificate', detail: 'Proof of completing the 15-hour Theoretical Driving Course.' },
    { label: 'Medical Certificate', detail: 'Issued by an LTO-accredited clinic and uploaded to the LTMS.' },
  ]

  if (!isStudentPermitStage) {
    requirements.push(
      { label: 'Valid Student Permit', detail: 'Held for at least one month before applying for a license.' },
      { label: 'PDC Certificate', detail: 'Proof of completing the 8-hour Practical Driving Course.' },
    )
  }

  if (age < 18) {
    requirements.push({
      label: 'Parent or Guardian Consent',
      detail: "Signed consent with a photocopy of your parent or guardian's valid ID.",
    })
  }

  return {
    notices: isStudentPermitStage
      ? [
          {
            tone: 'info',
            message:
              "At 16, you can apply for a Student Permit. Once you turn 17 and have held the permit for at least one month, you can apply for a non-professional driver's license.",
          },
        ]
      : [],
    requirements,
    appointment,
    fees: isStudentPermitStage
      ? '₱200.00 – ₱350.00 (Student Permit and computer fees)'
      : '₱820.00 – ₱1,200.00 (includes application and computer fees)',
    location,
    notes: [
      ...(isStudentPermitStage
        ? []
        : ["If you don't have a Student Permit yet, apply for one first using your PSA birth certificate, TDC certificate, and medical certificate."]),
      'Driving school and medical exam fees are paid separately to the accredited provider.',
    ],
  }
}

function passportChecklist({ age, isFirstTime }) {
  const isMinor = age < 18
  const requirements = [
    {
      label: 'Confirmed Online Appointment',
      detail: 'Printed appointment confirmation and accomplished application form.',
    },
  ]

  if (isFirstTime) {
    requirements.push({
      label: 'PSA Birth Certificate',
      detail: 'Original copy printed on PSA security paper, plus one photocopy.',
    })
    if (!isMinor) {
      requirements.push({
        label: 'Valid Government-Issued ID',
        detail: "One valid photo ID such as a UMID, driver's license, or PhilID, plus one photocopy.",
      })
    }
  } else {
    requirements.push({
      label: 'Current or Most Recent Passport',
      detail: 'Bring the passport along with a photocopy of its data page.',
    })
  }

  if (isMinor) {
    requirements.push({
      label: 'Parent Accompaniment',
      detail:
        'Either parent must appear in person with a valid ID. If neither parent can attend, additional authorization documents are required.',
    })
  }

  return {
    requirements,
    appointment:
      age >= 60
        ? { required: false, detail: 'Senior citizens may walk in through the DFA courtesy lane.' }
        : { required: true, detail: 'Book online at passport.gov.ph.' },
    fees: '₱950.00 (regular processing) or ₱1,200.00 (expedited processing)',
    location: 'DFA Consular Office, or a Philippine Embassy or Consulate if you are abroad',
    notes: [
      ...(isMinor ? [] : ['If you use your married surname, bring your PSA marriage certificate.']),
      ...(isFirstTime
        ? []
        : ['Lost or damaged passports are not processed as regular renewals and have additional requirements.']),
    ],
  }
}

function philhealthChecklist({ age, isFirstTime }) {
  const notices = []

  if (!isFirstTime) {
    notices.push({
      tone: 'info',
      message:
        'PhilHealth IDs do not need to be renewed. The checklist below is for updating your records or replacing your ID.',
    })
  }

  if (age < 18) {
    notices.push({
      tone: 'info',
      message:
        'Minors are usually covered as dependents of a parent who is a PhilHealth member. A parent or guardian should accompany you.',
    })
  }

  return {
    notices,
    requirements: isFirstTime
      ? [
          { label: 'PhilHealth Member Registration Form (PMRF)', detail: 'Completely filled out and signed.' },
          {
            label: 'Proof of Identity',
            detail: 'PSA birth certificate or any valid government-issued ID, with one photocopy.',
          },
          { label: '1x1 ID Photo', detail: 'One recent photo for your PhilHealth ID card.' },
        ]
      : [
          {
            label: 'PhilHealth Identification Number (PIN)',
            detail: 'Found on your Member Data Record (MDR) or previous PhilHealth ID.',
          },
          { label: 'PMRF for Updating', detail: 'Mark the updating/amendment option and fill in the details to change.' },
          { label: 'Valid Government-Issued ID', detail: 'Original copy with one photocopy.' },
        ],
    appointment: { required: false, detail: 'Walk in at any PhilHealth office during business hours.' },
    fees: 'Free (no fee for registration or ID card issuance)',
    location: 'PhilHealth Local Health Insurance Office (LHIO) or PhilHealth Express outlet',
  }
}

function nationalIdChecklist({ age, isFirstTime }) {
  if (!isFirstTime) {
    return {
      notices: [
        {
          tone: 'info',
          message:
            'The PhilID does not expire, so there is no renewal. The checklist below is for updating your information or replacing a lost or damaged card.',
        },
      ],
      requirements: [
        {
          label: 'PhilSys Number (PSN) or PhilID',
          detail: 'Your PhilID, printed ePhilID, or registration transaction slip.',
        },
        {
          label: 'Supporting Documents',
          detail: 'A PSA-issued certificate or valid ID showing the information you need to update.',
        },
      ],
      appointment: { required: false, detail: 'Visit a PhilSys Registration Center during operating hours.' },
      fees: 'Free for updates; a fee may apply to replace a lost or damaged card',
      location: 'PhilSys Registration Center',
    }
  }

  const isMinor = age < 18

  return {
    notices:
      age < 5
        ? [
            {
              tone: 'info',
              message:
                'Children below 5 are registered with a photo and demographic details only. Fingerprints and iris scans are captured once they turn 5.',
            },
          ]
        : [],
    requirements: isMinor
      ? [
          { label: 'PSA Birth Certificate', detail: 'Original copy of your PSA-issued Certificate of Live Birth.' },
          { label: "Parent or Guardian's ID", detail: "Your parent or guardian's PhilID or valid government-issued ID." },
          {
            label: 'Parent or Guardian Accompaniment',
            detail: 'Registrants below 18 must be accompanied by a parent or guardian.',
          },
        ]
      : [
          {
            label: 'PSA Birth Certificate',
            detail: 'Presented together with one government-issued ID that shows your full name and photo.',
          },
          {
            label: 'Alternative: Philippine Passport or UMID',
            detail: 'Either of these can be presented on its own in place of the documents above.',
          },
        ],
    appointment: { required: false, detail: 'Walk-in registration is accepted at most registration centers.' },
    fees: 'Free',
    location: 'PhilSys Registration Center (PSA offices, local government units, and partner sites)',
    notes: ['While waiting for your physical card, you can generate a printable ePhilID.'],
  }
}

function postalIdChecklist({ age, isFirstTime }) {
  return {
    notices:
      age < 18
        ? [
            {
              tone: 'info',
              message:
                'Applicants below 18 should confirm with the post office whether a parent or guardian needs to be present.',
            },
          ]
        : [],
    requirements: isFirstTime
      ? [
          { label: 'Postal ID Application Form', detail: 'Two accomplished copies.' },
          { label: 'Proof of Identity', detail: 'PSA birth certificate or a valid government-issued ID.' },
          {
            label: 'Proof of Address',
            detail: 'Barangay certificate of residency, utility bill, or bank statement in your name.',
          },
        ]
      : [
          { label: 'Current or Expired Postal ID', detail: 'Your previous Postal ID card.' },
          { label: 'Postal ID Application Form', detail: 'Two accomplished copies.' },
          { label: 'Proof of Address', detail: 'Required if your address has changed since your last application.' },
        ],
    appointment: { required: false, detail: 'Walk in at a post office that processes Postal IDs.' },
    fees: '₱504.00 (regular) or ₱650.00 (rush processing)',
    location: 'Post offices with Postal ID capture facilities',
    notes: ['Your Postal ID is delivered to the address on your application, so double-check it before submitting.'],
  }
}

const DOCUMENT_TYPES = [
  {
    id: 'drivers_license',
    name: "Driver's License",
    optionLabel: "Apply for Driver's License",
    iconKey: 'car',
    agency: 'Land Transportation Office (LTO)',
    agencyShort: 'LTO',
    website: { label: 'LTO LTMS Portal', url: 'https://portal.lto.gov.ph' },
    summary:
      "Get a Student Permit, apply for a non-professional driver's license, or renew your existing license through the LTO.",
    steps: [
      {
        title: 'Create an LTMS account',
        description:
          'Register on the LTO Land Transportation Management System (LTMS) portal. You will use it to book appointments and track your application.',
      },
      {
        title: 'Complete the Theoretical Driving Course',
        description:
          "Take the 15-hour Theoretical Driving Course (TDC) at an LTO-accredited driving school or LTO Driver's Education Center.",
      },
      {
        title: 'Apply for a Student Permit',
        description:
          'Applicants 16 years old and above can apply using their TDC certificate, PSA birth certificate, and medical certificate.',
      },
      {
        title: 'Take the Practical Driving Course',
        description:
          'Complete the 8-hour Practical Driving Course (PDC) and practice driving under supervision while holding your Student Permit.',
      },
      {
        title: 'Get a medical certificate',
        description: 'Have a medical exam at an LTO-accredited clinic. Results are uploaded directly to the LTMS.',
      },
      {
        title: 'Take the exams and claim your license',
        description:
          'Book an appointment, pass the written and practical driving exams, pay the fees, and have your photo and signature captured.',
      },
    ],
    statusNotes: {
      student: 'A valid school ID can be presented as a supporting ID.',
    },
    checklist: driversLicenseChecklist,
  },
  {
    id: 'passport',
    name: 'Passport',
    optionLabel: 'Apply for Passport',
    iconKey: 'plane',
    agency: 'Department of Foreign Affairs (DFA)',
    agencyShort: 'DFA',
    website: { label: 'DFA Passport Appointment', url: 'https://www.passport.gov.ph' },
    summary: 'Apply for a new Philippine passport or renew an existing one through the Department of Foreign Affairs.',
    steps: [
      {
        title: 'Book an appointment',
        description:
          'Choose a DFA consular office and schedule your visit at passport.gov.ph. Slots are released regularly, so check back if none are available.',
      },
      {
        title: 'Pay the passport fee',
        description: 'Settle the fee through the payment options shown during booking and keep your reference number.',
      },
      {
        title: 'Prepare your documents',
        description:
          'Print your application form and appointment confirmation, and bring original documents with photocopies.',
      },
      {
        title: 'Appear on your schedule',
        description:
          'Arrive at the consular office on time for document verification, photo capture, and biometrics.',
      },
      {
        title: 'Receive your passport',
        description: 'Claim your passport at the consular office or have it delivered to your address.',
      },
    ],
    statusNotes: {
      government:
        'If you are traveling on official government business, you may need an official passport, which has separate requirements.',
      ofw: 'OFWs may use the DFA courtesy lane with proof of overseas employment, such as an OEC or employment contract.',
    },
    checklist: passportChecklist,
  },
  {
    id: 'philhealth',
    name: 'PhilHealth ID',
    optionLabel: 'Apply for PhilHealth ID',
    iconKey: 'heart-pulse',
    agency: 'Philippine Health Insurance Corporation (PhilHealth)',
    agencyShort: 'PhilHealth',
    website: { label: 'PhilHealth Website', url: 'https://www.philhealth.gov.ph' },
    summary:
      'Register as a PhilHealth member, get your PhilHealth Identification Number (PIN), and request your ID card.',
    steps: [
      {
        title: 'Fill out the PMRF',
        description:
          'Download the PhilHealth Member Registration Form (PMRF) from the PhilHealth website or get a copy at any PhilHealth office.',
      },
      {
        title: 'Prepare your supporting documents',
        description: 'Bring your PSA birth certificate or a valid government-issued ID, plus a recent 1x1 ID photo.',
      },
      {
        title: 'Visit a PhilHealth office',
        description:
          'Submit your form at the nearest Local Health Insurance Office (LHIO) or PhilHealth Express outlet.',
      },
      {
        title: 'Receive your PIN and MDR',
        description:
          'You will be given your PhilHealth Identification Number (PIN) and Member Data Record (MDR).',
      },
      {
        title: 'Claim your PhilHealth ID',
        description: 'Request your PhilHealth ID card, which some offices can release on the same day.',
      },
    ],
    statusNotes: {
      student: 'If you are under 21, you may already be covered as a dependent of a parent who is a PhilHealth member.',
      employed:
        'Your employer usually handles PhilHealth registration and contributions. Ask your HR department for your PIN.',
      government:
        'Your agency usually handles PhilHealth registration and contributions. Ask your HR office for your PIN.',
      self_employed: 'Register as a direct contributor under the self-earning individual category.',
      unemployed:
        'You may qualify for subsidized coverage. Ask the PhilHealth office or your local social welfare office about your options.',
      ofw: 'OFWs register as direct contributors. Bring your passport and proof of overseas employment.',
    },
    checklist: philhealthChecklist,
  },
  {
    id: 'national_id',
    name: 'National ID (PhilSys)',
    optionLabel: 'Apply for National ID (PhilSys)',
    iconKey: 'id-card',
    agency: 'Philippine Statistics Authority (PSA)',
    agencyShort: 'PhilSys',
    website: { label: 'PhilSys Website', url: 'https://philsys.gov.ph' },
    summary: 'Register for the Philippine Identification System (PhilSys) and receive your PhilID for free.',
    steps: [
      {
        title: 'Find a registration center',
        description: 'Check philsys.gov.ph or official PSA announcements for registration centers and schedules near you.',
      },
      {
        title: 'Bring your supporting documents',
        description:
          'Prepare a PSA birth certificate with one government-issued photo ID, or a valid Philippine passport or UMID card.',
      },
      {
        title: 'Register and capture biometrics',
        description:
          'Provide your demographic details and have your fingerprints, iris scan, and front-facing photo taken.',
      },
      {
        title: 'Keep your transaction slip',
        description: 'Your registration slip contains a transaction number you can use to follow up on your PhilID.',
      },
      {
        title: 'Receive your PhilID',
        description:
          'The physical PhilID is delivered by PHLPost. You can also generate a printable ePhilID in the meantime.',
      },
    ],
    statusNotes: {
      ofw: 'If you are abroad, check philsys.gov.ph for registration options available to Filipinos overseas.',
    },
    checklist: nationalIdChecklist,
  },
  {
    id: 'postal_id',
    name: 'Postal ID',
    optionLabel: 'Apply for Postal ID',
    iconKey: 'mail',
    agency: 'Philippine Postal Corporation (PHLPost)',
    agencyShort: 'PHLPost',
    website: { label: 'PHLPost Website', url: 'https://www.phlpost.gov.ph' },
    summary: 'Apply for a Postal ID, a widely accepted valid ID issued by the Philippine Postal Corporation.',
    steps: [
      {
        title: 'Get the application form',
        description: 'Download the Postal ID application form from the PHLPost website or pick one up at a post office.',
      },
      {
        title: 'Prepare proof of identity and address',
        description: 'Bring your PSA birth certificate or a valid ID, plus a document showing your current address.',
      },
      {
        title: 'Submit and pay at the post office',
        description: 'Visit a post office that processes Postal IDs, submit your form, and pay the fee.',
      },
      {
        title: 'Capture your photo and biometrics',
        description: 'Your photo, signature, and fingerprints are taken on-site.',
      },
      {
        title: 'Receive your Postal ID',
        description: 'Your Postal ID is delivered to the address on your application.',
      },
    ],
    statusNotes: {},
    checklist: postalIdChecklist,
  },
]
