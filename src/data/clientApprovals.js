/**
 * Sample client approval data
 * This would be fetched from API in a production environment
 */

export const clientApprovals = [
  {
    id: 'CL-00125',
    name: 'Silverlight Investments LLC',
    type: 'Corporate',
    submittedBy: 'John Milton',
    submittedDate: '2025-03-01T14:23:00Z',
    status: 'Pending',
    priority: 'High',
    details: {
      address: '1250 Park Avenue, Suite 710, New York, NY 10065',
      contactPerson: 'Robert Silverstein',
      contactEmail: 'r.silverstein@silverlightinv.com',
      contactPhone: '+1 (212) 555-7890',
      taxId: 'US-7866543210',
      documentationStatus: 'Complete',
      notes: 'High-priority corporate client with international operations.'
    }
  },
  {
    id: 'CL-00126',
    name: 'Brent Global Holdings',
    type: 'Institutional',
    submittedBy: 'Sarah Chen',
    submittedDate: '2025-03-02T09:45:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '35 Canary Wharf, London, UK E14 5AA',
      contactPerson: 'Jonathan Maxwell',
      contactEmail: 'j.maxwell@brentglobal.co.uk',
      contactPhone: '+44 20 7946 1122',
      taxId: 'UK-883251694',
      documentationStatus: 'Incomplete',
      notes: 'Missing final KYC documents. Client has assets over $500M.'
    }
  },
  {
    id: 'CL-00127',
    name: 'Meridian Capital Partners',
    type: 'Institutional',
    submittedBy: 'Michael Torres',
    submittedDate: '2025-03-02T11:15:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '888 Boylston Street, Boston, MA 02199',
      contactPerson: 'Elizabeth Warren',
      contactEmail: 'e.warren@meridiancapital.com',
      contactPhone: '+1 (617) 555-3344',
      taxId: 'US-3399887766',
      documentationStatus: 'Complete',
      notes: 'Existing client expanding services. Strategic account.'
    }
  },
  {
    id: 'CL-00128',
    name: 'Hashimoto Financial Group',
    type: 'Corporate',
    submittedBy: 'David Liu',
    submittedDate: '2025-03-03T10:20:00Z',
    status: 'Pending',
    priority: 'High',
    details: {
      address: 'Marunouchi Building, 2-4-1 Marunouchi, Chiyoda-ku, Tokyo',
      contactPerson: 'Takashi Yamamoto',
      contactEmail: 't.yamamoto@hashimotofinancial.jp',
      contactPhone: '+81 3 5555 7777',
      taxId: 'JP-123456789',
      documentationStatus: 'Complete',
      notes: 'Important new Japanese client. Special handling required.'
    }
  },
  {
    id: 'CL-00129',
    name: 'Willow Creek Investments',
    type: 'Retail',
    submittedBy: 'Jessica Barnes',
    submittedDate: '2025-03-03T13:10:00Z',
    status: 'Pending',
    priority: 'Low',
    details: {
      address: '501 Main Street, Hartford, CT 06103',
      contactPerson: 'Gregory Wilson',
      contactEmail: 'g.wilson@willowcreek.net',
      contactPhone: '+1 (860) 555-9876',
      taxId: 'US-5544332211',
      documentationStatus: 'Incomplete',
      notes: 'Smaller retail client. Missing financial statements.'
    }
  },
  {
    id: 'CL-00130',
    name: 'Renaissance Asset Management',
    type: 'Institutional',
    submittedBy: 'Thomas Reynolds',
    submittedDate: '2025-03-04T08:30:00Z',
    status: 'Pending',
    priority: 'High',
    details: {
      address: '100 Wall Street, New York, NY 10005',
      contactPerson: 'Margaret Chen',
      contactEmail: 'm.chen@renaissanceasset.com',
      contactPhone: '+1 (212) 555-1234',
      taxId: 'US-1122334455',
      documentationStatus: 'Complete',
      notes: 'Large institutional client. Expedited approval requested.'
    }
  },
  {
    id: 'CL-00131',
    name: 'Quantum Pacific Advisors',
    type: 'Corporate',
    submittedBy: 'Amanda Johnson',
    submittedDate: '2025-03-04T14:45:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '555 California Street, San Francisco, CA 94104',
      contactPerson: 'Daniel Kim',
      contactEmail: 'd.kim@quantumpacific.com',
      contactPhone: '+1 (415) 555-7788',
      taxId: 'US-9988776655',
      documentationStatus: 'Complete',
      notes: 'Technology-focused investment firm.'
    }
  },
  {
    id: 'CL-00132',
    name: 'Horizon Equity Partners',
    type: 'Corporate',
    submittedBy: 'Robert Phillips',
    submittedDate: '2025-03-05T09:15:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '200 Peachtree Street, Atlanta, GA 30303',
      contactPerson: 'Catherine Brooks',
      contactEmail: 'c.brooks@horizonequity.com',
      contactPhone: '+1 (404) 555-6543',
      taxId: 'US-4455667788',
      documentationStatus: 'Complete',
      notes: 'Regional investment firm with strong growth.'
    }
  },
  {
    id: 'CL-00133',
    name: 'Blackwater Fund Management',
    type: 'Institutional',
    submittedBy: 'James Wilson',
    submittedDate: '2025-03-05T16:30:00Z',
    status: 'Pending',
    priority: 'High',
    details: {
      address: '600 Anton Boulevard, Costa Mesa, CA 92626',
      contactPerson: 'Alexander Rodriguez',
      contactEmail: 'a.rodriguez@blackwaterfund.com',
      contactPhone: '+1 (949) 555-3322',
      taxId: 'US-9876543210',
      documentationStatus: 'Complete',
      notes: 'VIP client with AUM over $2B. Premium service required.'
    }
  },
  {
    id: 'CL-00134',
    name: 'Eagle Peak Capital',
    type: 'Corporate',
    submittedBy: 'Melissa Thompson',
    submittedDate: '2025-03-06T10:45:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '1700 Lincoln Street, Denver, CO 80203',
      contactPerson: 'Brian Martinez',
      contactEmail: 'b.martinez@eaglepeak.com',
      contactPhone: '+1 (303) 555-1199',
      taxId: 'US-2233445566',
      documentationStatus: 'Incomplete',
      notes: 'Waiting for board resolution document.'
    }
  },
  {
    id: 'CL-00135',
    name: 'Summit Financial Partners',
    type: 'Retail',
    submittedBy: 'Kevin Richardson',
    submittedDate: '2025-03-06T13:20:00Z',
    status: 'Pending',
    priority: 'Low',
    details: {
      address: '400 Market Street, Philadelphia, PA 19106',
      contactPerson: 'Michelle Adams',
      contactEmail: 'm.adams@summitfinancial.com',
      contactPhone: '+1 (215) 555-4488',
      taxId: 'US-6677889900',
      documentationStatus: 'Complete',
      notes: 'Family office with focus on conservative investments.'
    }
  },
  {
    id: 'CL-00136',
    name: 'Granite State Asset Management',
    type: 'Institutional',
    submittedBy: 'Patricia Lee',
    submittedDate: '2025-03-07T09:00:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '1000 Elm Street, Manchester, NH 03101',
      contactPerson: 'Steven Clark',
      contactEmail: 's.clark@granitestate.com',
      contactPhone: '+1 (603) 555-9900',
      taxId: 'US-1357924680',
      documentationStatus: 'Complete',
      notes: 'Pension fund manager seeking custody services.'
    }
  },
  {
    id: 'CL-00137',
    name: 'Centaur Wealth Solutions',
    type: 'Corporate',
    submittedBy: 'Christopher Moore',
    submittedDate: '2025-03-07T11:45:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '300 Madison Avenue, New York, NY 10017',
      contactPerson: 'Jennifer Peterson',
      contactEmail: 'j.peterson@centaurwealth.com',
      contactPhone: '+1 (212) 555-6677',
      taxId: 'US-2468013579',
      documentationStatus: 'Incomplete',
      notes: 'Missing beneficial ownership information.'
    }
  },
  {
    id: 'CL-00138',
    name: 'Diamond Trust Investments',
    type: 'Retail',
    submittedBy: 'Laura Williams',
    submittedDate: '2025-03-08T10:30:00Z',
    status: 'Pending',
    priority: 'Low',
    details: {
      address: '800 5th Avenue, Seattle, WA 98104',
      contactPerson: 'Richard Norton',
      contactEmail: 'r.norton@diamondtrust.com',
      contactPhone: '+1 (206) 555-1212',
      taxId: 'US-3692581470',
      documentationStatus: 'Complete',
      notes: 'Boutique wealth management firm.'
    }
  },
  {
    id: 'CL-00139',
    name: 'AlphaCore Capital',
    type: 'Institutional',
    submittedBy: 'Daniel Martin',
    submittedDate: '2025-03-08T14:15:00Z',
    status: 'Pending',
    priority: 'High',
    details: {
      address: '10880 Wilshire Blvd, Los Angeles, CA 90024',
      contactPerson: 'Sophia Garcia',
      contactEmail: 's.garcia@alphacorecapital.com',
      contactPhone: '+1 (310) 555-8877',
      taxId: 'US-9517538642',
      documentationStatus: 'Complete',
      notes: 'Hedge fund with significant AUM. High priority.'
    }
  },
  {
    id: 'CL-00140',
    name: 'Nexus Financial Group',
    type: 'Corporate',
    submittedBy: 'Ryan Anderson',
    submittedDate: '2025-03-09T08:45:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '225 Franklin Street, Boston, MA 02110',
      contactPerson: 'Victoria King',
      contactEmail: 'v.king@nexusfinancial.com',
      contactPhone: '+1 (617) 555-3399',
      taxId: 'US-7539518642',
      documentationStatus: 'Complete',
      notes: 'Multi-family office with international clients.'
    }
  },
  {
    id: 'CL-00141',
    name: 'Peninsula Asset Management',
    type: 'Corporate',
    submittedBy: 'Andrew Hughes',
    submittedDate: '2025-03-09T15:00:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '1 Market Street, San Francisco, CA 94105',
      contactPerson: 'Olivia Chen',
      contactEmail: 'o.chen@peninsulaam.com',
      contactPhone: '+1 (415) 555-2211',
      taxId: 'US-9876123450',
      documentationStatus: 'Complete',
      notes: 'Tech-focused investment firm based in San Francisco.'
    }
  },
  {
    id: 'CL-00142',
    name: 'Crown Capital Advisors',
    type: 'Retail',
    submittedBy: 'Stephanie Baker',
    submittedDate: '2025-03-10T09:30:00Z',
    status: 'Pending',
    priority: 'Low',
    details: {
      address: '123 Grand Boulevard, St. Louis, MO 63103',
      contactPerson: 'Jason Taylor',
      contactEmail: 'j.taylor@crowncapital.com',
      contactPhone: '+1 (314) 555-7766',
      taxId: 'US-1234987650',
      documentationStatus: 'Incomplete',
      notes: 'Waiting for additional identification documents.'
    }
  },
  {
    id: 'CL-00143',
    name: 'Pinnacle Wealth Strategies',
    type: 'Corporate',
    submittedBy: 'Eric Foster',
    submittedDate: '2025-03-10T13:45:00Z',
    status: 'Pending',
    priority: 'Medium',
    details: {
      address: '2 North LaSalle Street, Chicago, IL 60602',
      contactPerson: 'Natalie Harris',
      contactEmail: 'n.harris@pinnaclewealth.com',
      contactPhone: '+1 (312) 555-4433',
      taxId: 'US-7891234560',
      documentationStatus: 'Complete',
      notes: 'Regional wealth management firm with strong reputation.'
    }
  },
  {
    id: 'CL-00144',
    name: 'Vanguard Financial Advisors',
    type: 'Institutional',
    submittedBy: 'Michelle Cooper',
    submittedDate: '2025-03-11T08:00:00Z',
    status: 'Pending',
    priority: 'High',
    details: {
      address: '500 E. Pratt Street, Baltimore, MD 21202',
      contactPerson: 'Christopher Bennett',
      contactEmail: 'c.bennett@vanguardadvisors.com',
      contactPhone: '+1 (410) 555-1010',
      taxId: 'US-4567890123',
      documentationStatus: 'Complete',
      notes: 'Large institutional client. Key relationship for firm growth.'
    }
  }
];

export default clientApprovals;