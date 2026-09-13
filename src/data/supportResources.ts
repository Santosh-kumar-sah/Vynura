export interface SupportHelpline {
  id: string;
  name: string;
  agency: string;
  phonePrimary: string;
  phoneSecondary?: string;
  telPrimaryUri: string;
  telSecondaryUri?: string;
  hours: string;
  languages: string;
  description: string;
  tags: string[];
}

export const SUPPORT_DISCLAIMER =
  "Vynura is not a diagnostic or clinical tool. If you're going through something difficult, these are real people who can help.";

export const INDIA_SUPPORT_RESOURCES: SupportHelpline[] = [
  {
    id: 'tele_manas',
    name: 'Tele-MANAS',
    agency: 'Govt. of India · Ministry of Health (Supervised by NIMHANS)',
    phonePrimary: '14416',
    phoneSecondary: '1800-891-4416',
    telPrimaryUri: 'tel:14416',
    telSecondaryUri: 'tel:18008914416',
    hours: '24/7, 365 Days · Toll-Free',
    languages: 'Available in 20 Indian regional languages',
    description:
      'National tele-mental health programme providing comprehensive, confidential psychological support with automated state-routing.',
    tags: ['24/7 TOLL-FREE', '20 LANGUAGES', 'GOVT. OF INDIA'],
  },
  {
    id: 'kiran_helpline',
    name: 'KIRAN Mental Health Helpline',
    agency: 'Govt. of India · Ministry of Social Justice & Empowerment',
    phonePrimary: '1800-599-0019',
    telPrimaryUri: 'tel:18005990019',
    hours: '24/7, 365 Days · Toll-Free',
    languages: 'Hindi, English, and 11 Regional Languages',
    description:
      'Dedicated helpline dedicated to providing first-aid psychological support, distress management, and mental wellbeing guidance.',
    tags: ['24/7 TOLL-FREE', 'CONFIDENTIAL', 'DISTRESS CARE'],
  },
];
