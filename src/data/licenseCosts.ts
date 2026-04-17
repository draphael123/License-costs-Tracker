/**
 * License Cost Data
 * Compiled from state medical boards, nursing boards, and DEA
 */

export interface LicenseCostRow {
  stateId: string;
  stateLabel: string;
  mdInitial: number;
  mdRenewal: number;
  mdRenewalYears: number;
  npInitial: number;
  npRenewal: number;
  npRenewalYears: number;
  notes: string;
  mdSourceUrl?: string;
  npSourceUrl?: string;
}

export const DEA_COSTS = {
  applicationFee: 888,
  renewalFee: 888,
  renewalYears: 3,
  annualEquivalent: 296,
  description: 'DEA Registration (Practitioners)'
};

export const LICENSE_COSTS: LicenseCostRow[] = [
  { stateId: "AK", stateLabel: "Alaska", mdInitial: 500, mdRenewal: 450, mdRenewalYears: 2, npInitial: 200, npRenewal: 200, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.prior.state.ak.us/prior/pages/medical", npSourceUrl: "https://www.prior.state.ak.us/prior/pages/nursing" },
  { stateId: "AL", stateLabel: "Alabama", mdInitial: 175, mdRenewal: 175, mdRenewalYears: 1, npInitial: 175, npRenewal: 104, npRenewalYears: 2, notes: "MD-only state for controlled substances", mdSourceUrl: "https://www.albme.gov/", npSourceUrl: "https://www.abn.alabama.gov/" },
  { stateId: "AR", stateLabel: "Arkansas", mdInitial: 500, mdRenewal: 225, mdRenewalYears: 2, npInitial: 125, npRenewal: 125, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.armedicalboard.org/", npSourceUrl: "https://www.arsbn.org/" },
  { stateId: "AZ", stateLabel: "Arizona", mdInitial: 675, mdRenewal: 500, mdRenewalYears: 2, npInitial: 150, npRenewal: 150, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.azmd.gov/licensure/licensure", npSourceUrl: "https://www.azbn.gov/licenses-and-certifications" },
  { stateId: "CA", stateLabel: "California", mdInitial: 1176, mdRenewal: 1206, mdRenewalYears: 2, npInitial: 150, npRenewal: 215, npRenewalYears: 2, notes: "Includes CURES fee ($30) and Thompson Program fee ($25)", mdSourceUrl: "https://www.mbc.ca.gov/Licensing/Physicians-and-Surgeons/Apply/Physicians-and-Surgeons-License/Fees.aspx", npSourceUrl: "https://www.rn.ca.gov/fees.shtml" },
  { stateId: "CO", stateLabel: "Colorado", mdInitial: 400, mdRenewal: 273, mdRenewalYears: 2, npInitial: 75, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dpo.colorado.gov/Medical", npSourceUrl: "https://dpo.colorado.gov/Nursing" },
  { stateId: "CT", stateLabel: "Connecticut", mdInitial: 565, mdRenewal: 455, mdRenewalYears: 2, npInitial: 200, npRenewal: 200, npRenewalYears: 1, notes: "", mdSourceUrl: "https://portal.ct.gov/DPH/Practitioner-Licensing--Investigations/PLIS/Physician-Licensing", npSourceUrl: "https://portal.ct.gov/DPH/Practitioner-Licensing--Investigations/Nursing/Nursing" },
  { stateId: "DC", stateLabel: "Washington D.C.", mdInitial: 803, mdRenewal: 550, mdRenewalYears: 2, npInitial: 180, npRenewal: 130, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dchealth.dc.gov/service/medicine-licensing", npSourceUrl: "https://dchealth.dc.gov/service/nursing-licensing" },
  { stateId: "DE", stateLabel: "Delaware", mdInitial: 378, mdRenewal: 378, mdRenewalYears: 2, npInitial: 255, npRenewal: 172, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dpr.delaware.gov/boards/medicalpractice/", npSourceUrl: "https://dpr.delaware.gov/boards/nursing/" },
  { stateId: "FL", stateLabel: "Florida", mdInitial: 350, mdRenewal: 280, mdRenewalYears: 2, npInitial: 110, npRenewal: 60, npRenewalYears: 2, notes: "", mdSourceUrl: "https://flboardofmedicine.gov/", npSourceUrl: "https://floridasnursing.gov/" },
  { stateId: "GA", stateLabel: "Georgia", mdInitial: 500, mdRenewal: 275, mdRenewalYears: 2, npInitial: 275, npRenewal: 125, npRenewalYears: 2, notes: "MD-only for controlled substances", mdSourceUrl: "https://medicalboard.georgia.gov/", npSourceUrl: "https://sos.ga.gov/PLB/acrobat/Forms/38%20Reference%20-%20Fee%20Schedule.pdf" },
  { stateId: "HI", stateLabel: "Hawaii", mdInitial: 392, mdRenewal: 221, mdRenewalYears: 2, npInitial: 194, npRenewal: 126, npRenewalYears: 2, notes: "", mdSourceUrl: "https://cca.hawaii.gov/pvl/boards/medical/", npSourceUrl: "https://cca.hawaii.gov/pvl/boards/nursing/" },
  { stateId: "IA", stateLabel: "Iowa", mdInitial: 450, mdRenewal: 400, mdRenewalYears: 2, npInitial: 81, npRenewal: 81, npRenewalYears: 3, notes: "", mdSourceUrl: "https://medicalboard.iowa.gov/", npSourceUrl: "https://nursing.iowa.gov/" },
  { stateId: "ID", stateLabel: "Idaho", mdInitial: 400, mdRenewal: 400, mdRenewalYears: 2, npInitial: 120, npRenewal: 90, npRenewalYears: 1, notes: "", mdSourceUrl: "https://bom.idaho.gov/BOMPortal/", npSourceUrl: "https://ibn.idaho.gov/" },
  { stateId: "IL", stateLabel: "Illinois", mdInitial: 500, mdRenewal: 300, mdRenewalYears: 3, npInitial: 125, npRenewal: 50, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.idfpr.com/profs/MedPhys.asp", npSourceUrl: "https://www.idfpr.com/profs/Nursing.asp" },
  { stateId: "IN", stateLabel: "Indiana", mdInitial: 250, mdRenewal: 150, mdRenewalYears: 2, npInitial: 50, npRenewal: 50, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.in.gov/pla/professions/medical-licensing-board/", npSourceUrl: "https://www.in.gov/pla/professions/indiana-state-board-of-nursing/" },
  { stateId: "KS", stateLabel: "Kansas", mdInitial: 300, mdRenewal: 210, mdRenewalYears: 2, npInitial: 150, npRenewal: 85, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.ksbha.org/", npSourceUrl: "https://ksbn.kansas.gov/" },
  { stateId: "KY", stateLabel: "Kentucky", mdInitial: 300, mdRenewal: 200, mdRenewalYears: 2, npInitial: 330, npRenewal: 100, npRenewalYears: 1, notes: "", mdSourceUrl: "https://kbml.ky.gov/", npSourceUrl: "https://kbn.ky.gov/" },
  { stateId: "LA", stateLabel: "Louisiana", mdInitial: 382, mdRenewal: 262, mdRenewalYears: 2, npInitial: 150, npRenewal: 100, npRenewalYears: 1, notes: "NP requires prescriptive authority add-on ($50)", mdSourceUrl: "https://www.lsbme.la.gov/", npSourceUrl: "https://www.lsbn.state.la.us/" },
  { stateId: "MA", stateLabel: "Massachusetts", mdInitial: 600, mdRenewal: 600, mdRenewalYears: 2, npInitial: 150, npRenewal: 150, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.mass.gov/orgs/board-of-registration-in-medicine", npSourceUrl: "https://www.mass.gov/orgs/board-of-registration-in-nursing" },
  { stateId: "MD", stateLabel: "Maryland", mdInitial: 790, mdRenewal: 512, mdRenewalYears: 1, npInitial: 75, npRenewal: 210, npRenewalYears: 2, notes: "Includes MHCC assessment ($26)", mdSourceUrl: "https://www.mbp.state.md.us/", npSourceUrl: "https://mbon.maryland.gov/" },
  { stateId: "ME", stateLabel: "Maine", mdInitial: 600, mdRenewal: 400, mdRenewalYears: 2, npInitial: 100, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.maine.gov/md/", npSourceUrl: "https://www.maine.gov/boardofnursing/" },
  { stateId: "MI", stateLabel: "Michigan", mdInitial: 368, mdRenewal: 270, mdRenewalYears: 3, npInitial: 200, npRenewal: 120, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.michigan.gov/lara/bureau-list/bpl/health/hp-lic-fees", npSourceUrl: "https://www.michigan.gov/lara/bureau-list/bpl/health/hp-lic-fees" },
  { stateId: "MN", stateLabel: "Minnesota", mdInitial: 200, mdRenewal: 192, mdRenewalYears: 2, npInitial: 105, npRenewal: 95, npRenewalYears: 2, notes: "", mdSourceUrl: "https://mn.gov/boards/medical-practice/", npSourceUrl: "https://mn.gov/boards/nursing/" },
  { stateId: "MO", stateLabel: "Missouri", mdInitial: 75, mdRenewal: 75, mdRenewalYears: 2, npInitial: 150, npRenewal: 80, npRenewalYears: 2, notes: "", mdSourceUrl: "https://pr.mo.gov/healingarts.asp", npSourceUrl: "https://pr.mo.gov/nursing.asp" },
  { stateId: "MS", stateLabel: "Mississippi", mdInitial: 550, mdRenewal: 325, mdRenewalYears: 2, npInitial: 100, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.msbml.ms.gov/", npSourceUrl: "https://www.msbn.ms.gov/" },
  { stateId: "MT", stateLabel: "Montana", mdInitial: 500, mdRenewal: 400, mdRenewalYears: 2, npInitial: 175, npRenewal: 130, npRenewalYears: 2, notes: "NP prescriptive authority add-on ($100)", mdSourceUrl: "https://boards.bsd.dli.mt.gov/medical-examiners", npSourceUrl: "https://boards.bsd.dli.mt.gov/nursing" },
  { stateId: "NC", stateLabel: "North Carolina", mdInitial: 400, mdRenewal: 250, mdRenewalYears: 1, npInitial: 100, npRenewal: 100, npRenewalYears: 1, notes: "", mdSourceUrl: "https://www.ncmedboard.org/", npSourceUrl: "https://www.ncbon.com/" },
  { stateId: "ND", stateLabel: "North Dakota", mdInitial: 400, mdRenewal: 325, mdRenewalYears: 3, npInitial: 160, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.ndbom.org/", npSourceUrl: "https://www.ndbon.org/" },
  { stateId: "NE", stateLabel: "Nebraska", mdInitial: 350, mdRenewal: 300, mdRenewalYears: 2, npInitial: 68, npRenewal: 68, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dhhs.ne.gov/licensure/Pages/Medicine-and-Surgery.aspx", npSourceUrl: "https://dhhs.ne.gov/licensure/Pages/Nursing.aspx" },
  { stateId: "NH", stateLabel: "New Hampshire", mdInitial: 300, mdRenewal: 300, mdRenewalYears: 2, npInitial: 100, npRenewal: 110, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.oplc.nh.gov/medicine", npSourceUrl: "https://www.oplc.nh.gov/nursing" },
  { stateId: "NJ", stateLabel: "New Jersey", mdInitial: 805, mdRenewal: 400, mdRenewalYears: 2, npInitial: 260, npRenewal: 160, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.njconsumeraffairs.gov/bme/", npSourceUrl: "https://www.njconsumeraffairs.gov/nur/" },
  { stateId: "NM", stateLabel: "New Mexico", mdInitial: 400, mdRenewal: 250, mdRenewalYears: 2, npInitial: 100, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.nmmb.state.nm.us/", npSourceUrl: "https://www.bon.nm.gov/" },
  { stateId: "NV", stateLabel: "Nevada", mdInitial: 1425, mdRenewal: 600, mdRenewalYears: 2, npInitial: 200, npRenewal: 150, npRenewalYears: 2, notes: "Highest initial MD fee in US", mdSourceUrl: "https://medboard.nv.gov/", npSourceUrl: "https://nevadanursingboard.org/" },
  { stateId: "NY", stateLabel: "New York", mdInitial: 735, mdRenewal: 600, mdRenewalYears: 3, npInitial: 85, npRenewal: 85, npRenewalYears: 3, notes: "", mdSourceUrl: "https://www.op.nysed.gov/professions/medicine", npSourceUrl: "https://www.op.nysed.gov/professions/nursing" },
  { stateId: "OH", stateLabel: "Ohio", mdInitial: 305, mdRenewal: 305, mdRenewalYears: 2, npInitial: 150, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://med.ohio.gov/", npSourceUrl: "https://nursing.ohio.gov/" },
  { stateId: "OK", stateLabel: "Oklahoma", mdInitial: 500, mdRenewal: 350, mdRenewalYears: 2, npInitial: 70, npRenewal: 70, npRenewalYears: 2, notes: "Async only", mdSourceUrl: "https://www.okmedicalboard.org/", npSourceUrl: "https://nursing.ok.gov/" },
  { stateId: "OR", stateLabel: "Oregon", mdInitial: 375, mdRenewal: 556, mdRenewalYears: 2, npInitial: 150, npRenewal: 150, npRenewalYears: 2, notes: "High renewal relative to initial", mdSourceUrl: "https://www.oregon.gov/omb/", npSourceUrl: "https://www.oregon.gov/osbn/" },
  { stateId: "PA", stateLabel: "Pennsylvania", mdInitial: 35, mdRenewal: 35, mdRenewalYears: 2, npInitial: 100, npRenewal: 45, npRenewalYears: 2, notes: "Lowest MD fees in US", mdSourceUrl: "https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/Medicine/", npSourceUrl: "https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/Nursing/" },
  { stateId: "RI", stateLabel: "Rhode Island", mdInitial: 1090, mdRenewal: 440, mdRenewalYears: 2, npInitial: 145, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://health.ri.gov/licenses/detail.php?id=247", npSourceUrl: "https://health.ri.gov/licenses/detail.php?id=250" },
  { stateId: "SC", stateLabel: "South Carolina", mdInitial: 580, mdRenewal: 300, mdRenewalYears: 2, npInitial: 145, npRenewal: 80, npRenewalYears: 2, notes: "", mdSourceUrl: "https://llr.sc.gov/med/", npSourceUrl: "https://llr.sc.gov/nur/" },
  { stateId: "SD", stateLabel: "South Dakota", mdInitial: 400, mdRenewal: 300, mdRenewalYears: 2, npInitial: 100, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://doh.sd.gov/boards/medicine/", npSourceUrl: "https://doh.sd.gov/boards/nursing/" },
  { stateId: "TN", stateLabel: "Tennessee", mdInitial: 510, mdRenewal: 255, mdRenewalYears: 2, npInitial: 210, npRenewal: 115, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.tn.gov/health/health-program-areas/health-professional-boards/me-board.html", npSourceUrl: "https://www.tn.gov/health/health-program-areas/health-professional-boards/nursing-board.html" },
  { stateId: "TX", stateLabel: "Texas", mdInitial: 867, mdRenewal: 317, mdRenewalYears: 2, npInitial: 150, npRenewal: 94, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.tmb.texas.gov/", npSourceUrl: "https://www.bon.texas.gov/" },
  { stateId: "UT", stateLabel: "Utah", mdInitial: 200, mdRenewal: 150, mdRenewalYears: 2, npInitial: 135, npRenewal: 65, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dopl.utah.gov/med/", npSourceUrl: "https://dopl.utah.gov/nurse/" },
  { stateId: "VA", stateLabel: "Virginia", mdInitial: 302, mdRenewal: 217, mdRenewalYears: 2, npInitial: 125, npRenewal: 90, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.dhp.virginia.gov/medicine/", npSourceUrl: "https://www.dhp.virginia.gov/nursing/" },
  { stateId: "VT", stateLabel: "Vermont", mdInitial: 650, mdRenewal: 300, mdRenewalYears: 2, npInitial: 125, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.sec.state.vt.us/professional-regulation/profession/physicians.aspx", npSourceUrl: "https://www.sec.state.vt.us/professional-regulation/profession/nursing.aspx" },
  { stateId: "WA", stateLabel: "Washington", mdInitial: 491, mdRenewal: 491, mdRenewalYears: 2, npInitial: 135, npRenewal: 135, npRenewalYears: 2, notes: "Includes HEALWA ($16) and WCN ($8) surcharges", mdSourceUrl: "https://www.doh.wa.gov/LicensesPermitsandCertificates/ProfessionsNewReneworUpdate/PhysicianMedicalDoctor", npSourceUrl: "https://www.doh.wa.gov/LicensesPermitsandCertificates/NursingCommission" },
  { stateId: "WI", stateLabel: "Wisconsin", mdInitial: 60, mdRenewal: 60, mdRenewalYears: 2, npInitial: 82, npRenewal: 82, npRenewalYears: 2, notes: "Very low MD fees", mdSourceUrl: "https://dsps.wi.gov/pages/Professions/Physician/Default.aspx", npSourceUrl: "https://dsps.wi.gov/pages/Professions/RN/Default.aspx" },
  { stateId: "WV", stateLabel: "West Virginia", mdInitial: 400, mdRenewal: 300, mdRenewalYears: 2, npInitial: 35, npRenewal: 35, npRenewalYears: 2, notes: "Lowest NP fees in US", mdSourceUrl: "https://www.wvbom.wv.gov/", npSourceUrl: "https://www.wvrnboard.wv.gov/" },
  { stateId: "WY", stateLabel: "Wyoming", mdInitial: 400, mdRenewal: 250, mdRenewalYears: 2, npInitial: 325, npRenewal: 150, npRenewalYears: 2, notes: "NP includes prescriptive authority ($70)", mdSourceUrl: "https://wyomedboard.wyo.gov/", npSourceUrl: "https://nursing-online.state.wy.us/" },
];

export function getLicenseCost(stateId: string): LicenseCostRow | undefined {
  return LICENSE_COSTS.find(s => s.stateId === stateId);
}

export function getStateName(stateId: string): string {
  const state = LICENSE_COSTS.find(s => s.stateId === stateId);
  return state?.stateLabel || stateId;
}

// Map state names to IDs
export const STATE_NAME_TO_ID: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'DC': 'DC', 'Washington D.C.': 'DC', 'Puerto Rico': 'PR'
};
