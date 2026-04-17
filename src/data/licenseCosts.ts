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
  { stateId: "AK", stateLabel: "Alaska", mdInitial: 500, mdRenewal: 450, mdRenewalYears: 2, npInitial: 200, npRenewal: 200, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.prior.state.ak.us/prior/medical-licensing", npSourceUrl: "https://www.prior.state.ak.us/prior/nursing-licensing" },
  { stateId: "AL", stateLabel: "Alabama", mdInitial: 175, mdRenewal: 175, mdRenewalYears: 1, npInitial: 175, npRenewal: 104, npRenewalYears: 2, notes: "MD-only state for controlled substances", mdSourceUrl: "https://www.albme.gov/licensure/fees", npSourceUrl: "https://www.abn.alabama.gov/licensing/" },
  { stateId: "AR", stateLabel: "Arkansas", mdInitial: 500, mdRenewal: 225, mdRenewalYears: 2, npInitial: 125, npRenewal: 125, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.armedicalboard.org/professionals/pdf/Fee%20Schedule.pdf", npSourceUrl: "https://www.arsbn.org/licensing" },
  { stateId: "AZ", stateLabel: "Arizona", mdInitial: 500, mdRenewal: 500, mdRenewalYears: 2, npInitial: 150, npRenewal: 150, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.azmd.gov/licensing/fees", npSourceUrl: "https://www.azbn.gov/licenses-and-certifications/apply-for-a-license" },
  { stateId: "CA", stateLabel: "California", mdInitial: 1151, mdRenewal: 1206, mdRenewalYears: 2, npInitial: 150, npRenewal: 215, npRenewalYears: 2, notes: "Includes CURES fee ($30) and Thompson Program fee ($25)", mdSourceUrl: "https://www.mbc.ca.gov/Licensing/Physicians-and-Surgeons/Fees.aspx", npSourceUrl: "https://www.rn.ca.gov/fees.shtml" },
  { stateId: "CO", stateLabel: "Colorado", mdInitial: 390, mdRenewal: 273, mdRenewalYears: 2, npInitial: 75, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dpo.colorado.gov/Medical/Fees", npSourceUrl: "https://dpo.colorado.gov/Nursing/Fees" },
  { stateId: "CT", stateLabel: "Connecticut", mdInitial: 565, mdRenewal: 455, mdRenewalYears: 2, npInitial: 200, npRenewal: 200, npRenewalYears: 1, notes: "", mdSourceUrl: "https://portal.ct.gov/DPH/Practitioner-Licensing--Investigations/PLIS/Physician-Licensing", npSourceUrl: "https://portal.ct.gov/DPH/Practitioner-Licensing--Investigations/Nursing/Nursing" },
  { stateId: "DC", stateLabel: "Washington D.C.", mdInitial: 803, mdRenewal: 550, mdRenewalYears: 2, npInitial: 180, npRenewal: 130, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dchealth.dc.gov/service/medicine-licensing", npSourceUrl: "https://dchealth.dc.gov/service/nursing-licensing" },
  { stateId: "DE", stateLabel: "Delaware", mdInitial: 378, mdRenewal: 378, mdRenewalYears: 2, npInitial: 255, npRenewal: 172, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dpr.delaware.gov/boards/medicalpractice/", npSourceUrl: "https://dpr.delaware.gov/boards/nursing/" },
  { stateId: "FL", stateLabel: "Florida", mdInitial: 424, mdRenewal: 355, mdRenewalYears: 2, npInitial: 110, npRenewal: 60, npRenewalYears: 2, notes: "", mdSourceUrl: "https://flboardofmedicine.gov/licensing/fees/", npSourceUrl: "https://floridasnursing.gov/licensing/fees/" },
  { stateId: "GA", stateLabel: "Georgia", mdInitial: 500, mdRenewal: 275, mdRenewalYears: 2, npInitial: 275, npRenewal: 125, npRenewalYears: 2, notes: "MD-only for controlled substances", mdSourceUrl: "https://medicalboard.georgia.gov/licensing", npSourceUrl: "https://sos.ga.gov/PLB/acrobat/Forms/38%20Reference%20-%20Fee%20Schedule.pdf" },
  { stateId: "HI", stateLabel: "Hawaii", mdInitial: 392, mdRenewal: 221, mdRenewalYears: 2, npInitial: 194, npRenewal: 126, npRenewalYears: 2, notes: "", mdSourceUrl: "https://cca.hawaii.gov/pvl/boards/medical/", npSourceUrl: "https://cca.hawaii.gov/pvl/boards/nursing/" },
  { stateId: "IA", stateLabel: "Iowa", mdInitial: 450, mdRenewal: 400, mdRenewalYears: 2, npInitial: 81, npRenewal: 81, npRenewalYears: 3, notes: "", mdSourceUrl: "https://medicalboard.iowa.gov/licensing/fees", npSourceUrl: "https://nursing.iowa.gov/licensing" },
  { stateId: "ID", stateLabel: "Idaho", mdInitial: 400, mdRenewal: 400, mdRenewalYears: 2, npInitial: 120, npRenewal: 90, npRenewalYears: 1, notes: "", mdSourceUrl: "https://bom.idaho.gov/BOMPortal/Fees.aspx", npSourceUrl: "https://ibn.idaho.gov/licensing/" },
  { stateId: "IL", stateLabel: "Illinois", mdInitial: 500, mdRenewal: 300, mdRenewalYears: 3, npInitial: 125, npRenewal: 50, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.idfpr.com/profs/MedPhys.asp", npSourceUrl: "https://www.idfpr.com/profs/Nursing.asp" },
  { stateId: "IN", stateLabel: "Indiana", mdInitial: 250, mdRenewal: 150, mdRenewalYears: 2, npInitial: 50, npRenewal: 50, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.in.gov/pla/professions/medical-licensing-board/", npSourceUrl: "https://www.in.gov/pla/professions/indiana-state-board-of-nursing/" },
  { stateId: "KS", stateLabel: "Kansas", mdInitial: 300, mdRenewal: 210, mdRenewalYears: 2, npInitial: 150, npRenewal: 85, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.ksbha.org/fees.shtml", npSourceUrl: "https://ksbn.kansas.gov/fees/" },
  { stateId: "KY", stateLabel: "Kentucky", mdInitial: 300, mdRenewal: 200, mdRenewalYears: 2, npInitial: 330, npRenewal: 100, npRenewalYears: 1, notes: "", mdSourceUrl: "https://kbml.ky.gov/fees/Pages/default.aspx", npSourceUrl: "https://kbn.ky.gov/fees/Pages/default.aspx" },
  { stateId: "LA", stateLabel: "Louisiana", mdInitial: 382, mdRenewal: 262, mdRenewalYears: 2, npInitial: 150, npRenewal: 100, npRenewalYears: 1, notes: "NP requires prescriptive authority add-on ($50)", mdSourceUrl: "https://www.lsbme.la.gov/content/licensing-fees", npSourceUrl: "https://www.lsbn.state.la.us/Licensure.aspx" },
  { stateId: "MA", stateLabel: "Massachusetts", mdInitial: 600, mdRenewal: 600, mdRenewalYears: 2, npInitial: 150, npRenewal: 150, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.mass.gov/info-details/board-of-registration-in-medicine-license-fees", npSourceUrl: "https://www.mass.gov/orgs/board-of-registration-in-nursing" },
  { stateId: "MD", stateLabel: "Maryland", mdInitial: 790, mdRenewal: 512, mdRenewalYears: 1, npInitial: 75, npRenewal: 210, npRenewalYears: 2, notes: "Includes MHCC assessment ($26)", mdSourceUrl: "https://www.mbp.state.md.us/bpqapp/fees.asp", npSourceUrl: "https://mbon.maryland.gov/Pages/fees.aspx" },
  { stateId: "ME", stateLabel: "Maine", mdInitial: 600, mdRenewal: 400, mdRenewalYears: 2, npInitial: 100, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.maine.gov/md/licensing/fees.html", npSourceUrl: "https://www.maine.gov/boardofnursing/licensing/" },
  { stateId: "MI", stateLabel: "Michigan", mdInitial: 368, mdRenewal: 270, mdRenewalYears: 3, npInitial: 200, npRenewal: 120, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.michigan.gov/lara/bureau-list/bpl/health/hp-lic-fees", npSourceUrl: "https://www.michigan.gov/lara/bureau-list/bpl/health/hp-lic-fees" },
  { stateId: "MN", stateLabel: "Minnesota", mdInitial: 200, mdRenewal: 192, mdRenewalYears: 2, npInitial: 105, npRenewal: 95, npRenewalYears: 2, notes: "", mdSourceUrl: "https://mn.gov/boards/medical-practice/licensure/fees/", npSourceUrl: "https://mn.gov/boards/nursing/licensure/fees/" },
  { stateId: "MO", stateLabel: "Missouri", mdInitial: 75, mdRenewal: 75, mdRenewalYears: 2, npInitial: 150, npRenewal: 80, npRenewalYears: 2, notes: "", mdSourceUrl: "https://pr.mo.gov/healingarts.asp", npSourceUrl: "https://pr.mo.gov/nursing.asp" },
  { stateId: "MS", stateLabel: "Mississippi", mdInitial: 550, mdRenewal: 325, mdRenewalYears: 2, npInitial: 100, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.msbml.ms.gov/Licensure/Fees", npSourceUrl: "https://www.msbn.ms.gov/licensure" },
  { stateId: "MT", stateLabel: "Montana", mdInitial: 500, mdRenewal: 400, mdRenewalYears: 2, npInitial: 175, npRenewal: 130, npRenewalYears: 2, notes: "NP prescriptive authority add-on ($100)", mdSourceUrl: "https://boards.bsd.dli.mt.gov/medical-examiners/fees", npSourceUrl: "https://boards.bsd.dli.mt.gov/nursing/fees" },
  { stateId: "NC", stateLabel: "North Carolina", mdInitial: 400, mdRenewal: 250, mdRenewalYears: 1, npInitial: 100, npRenewal: 100, npRenewalYears: 1, notes: "", mdSourceUrl: "https://www.ncmedboard.org/licensing/fees", npSourceUrl: "https://www.ncbon.com/licensing-fees" },
  { stateId: "ND", stateLabel: "North Dakota", mdInitial: 400, mdRenewal: 325, mdRenewalYears: 3, npInitial: 160, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.ndbom.org/licensing/fees/", npSourceUrl: "https://www.ndbon.org/Licensure/Fees.asp" },
  { stateId: "NE", stateLabel: "Nebraska", mdInitial: 350, mdRenewal: 300, mdRenewalYears: 2, npInitial: 68, npRenewal: 68, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dhhs.ne.gov/licensure/Pages/Medicine-and-Surgery.aspx", npSourceUrl: "https://dhhs.ne.gov/licensure/Pages/Nursing.aspx" },
  { stateId: "NH", stateLabel: "New Hampshire", mdInitial: 300, mdRenewal: 300, mdRenewalYears: 2, npInitial: 100, npRenewal: 110, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.oplc.nh.gov/medicine", npSourceUrl: "https://www.oplc.nh.gov/nursing" },
  { stateId: "NJ", stateLabel: "New Jersey", mdInitial: 805, mdRenewal: 400, mdRenewalYears: 2, npInitial: 260, npRenewal: 160, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.njconsumeraffairs.gov/bme/Pages/applications.aspx", npSourceUrl: "https://www.njconsumeraffairs.gov/nur/Pages/applications.aspx" },
  { stateId: "NM", stateLabel: "New Mexico", mdInitial: 400, mdRenewal: 250, mdRenewalYears: 2, npInitial: 100, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.nmmb.state.nm.us/licensing.html", npSourceUrl: "https://www.bon.nm.gov/licensing/" },
  { stateId: "NV", stateLabel: "Nevada", mdInitial: 1425, mdRenewal: 600, mdRenewalYears: 2, npInitial: 200, npRenewal: 150, npRenewalYears: 2, notes: "Highest initial MD fee in US", mdSourceUrl: "https://medboard.nv.gov/Licensure/Fees/", npSourceUrl: "https://nevadanursingboard.org/fees/" },
  { stateId: "NY", stateLabel: "New York", mdInitial: 735, mdRenewal: 530, mdRenewalYears: 2, npInitial: 85, npRenewal: 85, npRenewalYears: 3, notes: "", mdSourceUrl: "https://www.op.nysed.gov/professions/medicine/fees", npSourceUrl: "https://www.op.nysed.gov/professions/nursing/fees" },
  { stateId: "OH", stateLabel: "Ohio", mdInitial: 305, mdRenewal: 305, mdRenewalYears: 2, npInitial: 150, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://med.ohio.gov/Apply/Fees", npSourceUrl: "https://nursing.ohio.gov/licensing-certification-ce/aprn-authority-to-prescribe/" },
  { stateId: "OK", stateLabel: "Oklahoma", mdInitial: 500, mdRenewal: 350, mdRenewalYears: 2, npInitial: 70, npRenewal: 70, npRenewalYears: 2, notes: "Async only", mdSourceUrl: "https://www.okmedicalboard.org/licensing/fees", npSourceUrl: "https://nursing.ok.gov/fees.html" },
  { stateId: "OR", stateLabel: "Oregon", mdInitial: 375, mdRenewal: 556, mdRenewalYears: 2, npInitial: 150, npRenewal: 150, npRenewalYears: 2, notes: "High renewal relative to initial", mdSourceUrl: "https://www.oregon.gov/omb/licensing/Pages/fees.aspx", npSourceUrl: "https://www.oregon.gov/osbn/Pages/fees.aspx" },
  { stateId: "PA", stateLabel: "Pennsylvania", mdInitial: 35, mdRenewal: 35, mdRenewalYears: 2, npInitial: 100, npRenewal: 45, npRenewalYears: 2, notes: "Lowest MD fees in US", mdSourceUrl: "https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/Medicine/Pages/Medicine-Fees.aspx", npSourceUrl: "https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/Nursing/Pages/Nursing-Fees.aspx" },
  { stateId: "RI", stateLabel: "Rhode Island", mdInitial: 1090, mdRenewal: 440, mdRenewalYears: 2, npInitial: 145, npRenewal: 100, npRenewalYears: 2, notes: "", mdSourceUrl: "https://health.ri.gov/licenses/detail.php?id=247", npSourceUrl: "https://health.ri.gov/licenses/detail.php?id=250" },
  { stateId: "SC", stateLabel: "South Carolina", mdInitial: 580, mdRenewal: 300, mdRenewalYears: 2, npInitial: 145, npRenewal: 80, npRenewalYears: 2, notes: "", mdSourceUrl: "https://llr.sc.gov/med/fees.aspx", npSourceUrl: "https://llr.sc.gov/nur/fees.aspx" },
  { stateId: "SD", stateLabel: "South Dakota", mdInitial: 400, mdRenewal: 300, mdRenewalYears: 2, npInitial: 100, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://doh.sd.gov/boards/medicine/", npSourceUrl: "https://doh.sd.gov/boards/nursing/" },
  { stateId: "TN", stateLabel: "Tennessee", mdInitial: 510, mdRenewal: 255, mdRenewalYears: 2, npInitial: 210, npRenewal: 115, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.tn.gov/health/health-program-areas/health-professional-boards/me-board/me-board/fees.html", npSourceUrl: "https://www.tn.gov/health/health-program-areas/health-professional-boards/nursing-board/nursing-board/fees.html" },
  { stateId: "TX", stateLabel: "Texas", mdInitial: 817, mdRenewal: 317, mdRenewalYears: 2, npInitial: 150, npRenewal: 94, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.tmb.state.tx.us/page/fees", npSourceUrl: "https://www.bon.texas.gov/fees.asp" },
  { stateId: "UT", stateLabel: "Utah", mdInitial: 200, mdRenewal: 150, mdRenewalYears: 2, npInitial: 135, npRenewal: 65, npRenewalYears: 2, notes: "", mdSourceUrl: "https://dopl.utah.gov/med/", npSourceUrl: "https://dopl.utah.gov/nurse/" },
  { stateId: "VA", stateLabel: "Virginia", mdInitial: 302, mdRenewal: 217, mdRenewalYears: 2, npInitial: 125, npRenewal: 90, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.dhp.virginia.gov/medicine/medicine_fee.htm", npSourceUrl: "https://www.dhp.virginia.gov/nursing/nursing_fee.htm" },
  { stateId: "VT", stateLabel: "Vermont", mdInitial: 650, mdRenewal: 300, mdRenewalYears: 2, npInitial: 125, npRenewal: 75, npRenewalYears: 2, notes: "", mdSourceUrl: "https://www.sec.state.vt.us/professional-regulation/profession/physicians.aspx", npSourceUrl: "https://www.sec.state.vt.us/professional-regulation/profession/nursing.aspx" },
  { stateId: "WA", stateLabel: "Washington", mdInitial: 491, mdRenewal: 491, mdRenewalYears: 2, npInitial: 135, npRenewal: 135, npRenewalYears: 2, notes: "Includes HEALWA ($16) and WCN ($8) surcharges", mdSourceUrl: "https://www.doh.wa.gov/LicensesPermitsandCertificates/ProfessionsNewReneworUpdate/PhysicianMedicalDoctor/Fees", npSourceUrl: "https://www.doh.wa.gov/LicensesPermitsandCertificates/NursingCommission/Fees" },
  { stateId: "WI", stateLabel: "Wisconsin", mdInitial: 60, mdRenewal: 60, mdRenewalYears: 2, npInitial: 82, npRenewal: 82, npRenewalYears: 2, notes: "Very low MD fees", mdSourceUrl: "https://dsps.wi.gov/pages/Professions/Physician/Default.aspx", npSourceUrl: "https://dsps.wi.gov/pages/Professions/RN/Default.aspx" },
  { stateId: "WV", stateLabel: "West Virginia", mdInitial: 400, mdRenewal: 300, mdRenewalYears: 2, npInitial: 35, npRenewal: 35, npRenewalYears: 2, notes: "Lowest NP fees in US", mdSourceUrl: "https://www.wvbom.wv.gov/fees.asp", npSourceUrl: "https://www.wvrnboard.wv.gov/licensing/Pages/default.aspx" },
  { stateId: "WY", stateLabel: "Wyoming", mdInitial: 400, mdRenewal: 250, mdRenewalYears: 2, npInitial: 325, npRenewal: 150, npRenewalYears: 2, notes: "NP includes prescriptive authority ($70)", mdSourceUrl: "https://wyomedboard.wyo.gov/licensing/fees/", npSourceUrl: "https://nursing-online.state.wy.us/fees/" },
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
