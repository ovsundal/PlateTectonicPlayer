export interface GeologicalPeriod {
  name: string
  eon: string
  startMa: number // older boundary
  endMa: number   // younger boundary (0 = present)
  color: string   // ICS chart color
}

// Periods ordered oldest → youngest (startMa descending)
export const PERIODS: GeologicalPeriod[] = [
  { name: 'Tonian',        eon: 'Proterozoic', startMa: 1000, endMa: 720,   color: '#FEB24C' },
  { name: 'Cryogenian',    eon: 'Proterozoic', startMa: 720,  endMa: 635,   color: '#FD8D3C' },
  { name: 'Ediacaran',     eon: 'Proterozoic', startMa: 635,  endMa: 538.8, color: '#FC4E2A' },
  { name: 'Cambrian',      eon: 'Paleozoic',   startMa: 538.8,endMa: 485.4, color: '#7FA056' },
  { name: 'Ordovician',    eon: 'Paleozoic',   startMa: 485.4,endMa: 443.8, color: '#009270' },
  { name: 'Silurian',      eon: 'Paleozoic',   startMa: 443.8,endMa: 419.2, color: '#B3E1B6' },
  { name: 'Devonian',      eon: 'Paleozoic',   startMa: 419.2,endMa: 358.9, color: '#CB8C37' },
  { name: 'Carboniferous', eon: 'Paleozoic',   startMa: 358.9,endMa: 298.9, color: '#67A599' },
  { name: 'Permian',       eon: 'Paleozoic',   startMa: 298.9,endMa: 251.9, color: '#F04028' },
  { name: 'Triassic',      eon: 'Mesozoic',    startMa: 251.9,endMa: 201.3, color: '#812B92' },
  { name: 'Jurassic',      eon: 'Mesozoic',    startMa: 201.3,endMa: 145.0, color: '#34B2C9' },
  { name: 'Cretaceous',    eon: 'Mesozoic',    startMa: 145.0,endMa: 66.0,  color: '#67C27A' },
  { name: 'Paleogene',     eon: 'Cenozoic',    startMa: 66.0, endMa: 23.0,  color: '#FD9A52' },
  { name: 'Neogene',       eon: 'Cenozoic',    startMa: 23.0, endMa: 2.6,   color: '#FFE619' },
  { name: 'Quaternary',    eon: 'Cenozoic',    startMa: 2.6,  endMa: 0,     color: '#F9F97F' },
]

export function getPeriod(ageMa: number): GeologicalPeriod | null {
  return PERIODS.find((p) => ageMa >= p.endMa && ageMa <= p.startMa) ?? null
}

export interface MajorEvent {
  label: string
  ageMa: number
  description: string
  detail: string // longer text shown in the toast
}

export const MAJOR_EVENTS: MajorEvent[] = [
  {
    ageMa: 750,
    label: 'Rodinia',
    description: 'Rodinia supercontinent (~750 Ma)',
    detail: 'Rodinia was one of Earth\'s earliest supercontinents, assembled around 1.1 Ga and beginning to rift apart ~750 Ma. Most of today\'s continents were clustered near the equator in a configuration almost unrecognisable compared to the modern world.',
  },
  {
    ageMa: 635,
    label: 'Snowball Earth',
    description: 'Cryogenian glaciation ends (~635 Ma)',
    detail: 'The Cryogenian period saw global glaciations so severe that ice sheets may have extended to the tropics — "Snowball Earth." The thaw around 635 Ma triggered a surge of atmospheric CO₂ and set the stage for the explosion of complex multicellular life.',
  },
  {
    ageMa: 600,
    label: 'Ediacaran Biota',
    description: 'First complex multicellular animals (~600 Ma)',
    detail: 'The Ediacaran biota represent Earth\'s first large, complex multicellular organisms — soft-bodied creatures unlike anything alive today. They ranged from frond-like forms to disc-shaped mats, living on the seafloor in an ocean without predators. Most vanished at the Cambrian boundary, leaving no clear descendants.',
  },
  {
    ageMa: 540,
    label: 'Cambrian Explosion',
    description: 'Cambrian explosion (~540 Ma)',
    detail: 'Within a geologically brief ~20 million years, almost all major animal body plans appear in the fossil record for the first time. The causes remain debated — rising oxygen, ecological opportunity after the Snowball thaw, or evolutionary innovation — but the result was permanent: complex animal life was here to stay.',
  },
  {
    ageMa: 500,
    label: 'Gondwana',
    description: 'Gondwana fully assembled (~500 Ma)',
    detail: 'The southern supercontinent Gondwana brought together what would become South America, Africa, Antarctica, Australia, and the Indian subcontinent. It dominated the Southern Hemisphere for nearly 300 million years before rifting apart in the Jurassic.',
  },
  {
    ageMa: 445,
    label: 'End-Ordovician',
    description: 'End-Ordovician extinction (~445 Ma)',
    detail: 'The second largest mass extinction in Earth\'s history wiped out ~85% of all species. It struck in two pulses — first a glaciation that locked up seawater into ice sheets, collapsing shallow marine ecosystems, then a rapid warming as the glaciers melted. Trilobites, brachiopods, and early corals were devastated.',
  },
  {
    ageMa: 420,
    label: 'Plants on Land',
    description: 'First vascular plants colonise land (~420 Ma)',
    detail: 'The colonisation of land by plants fundamentally transformed the planet. Early vascular plants like Cooksonia spread across barren landscapes, pumping oxygen into the atmosphere, binding soil with roots, and creating new ecological niches that would eventually support insects, amphibians, and all terrestrial life.',
  },
  {
    ageMa: 370,
    label: 'Late Devonian',
    description: 'Late Devonian extinction (~370 Ma)',
    detail: 'A prolonged crisis spanning ~25 million years eliminated ~75% of all species, hitting marine ecosystems hardest. Reefs collapsed worldwide and would not recover for millions of years. The cause may have been land plants: their roots released nutrients into the sea, triggering algal blooms and ocean anoxia.',
  },
  {
    ageMa: 250,
    label: 'Pangaea & the Great Dying',
    description: 'Pangaea peak (~250 Ma) + Great Dying',
    detail: 'At its peak, Pangaea was a single landmass stretching pole to pole. The end-Permian extinction — the Great Dying — wiped out ~96% of marine species and ~70% of terrestrial vertebrates, likely driven by massive Siberian volcanic eruptions, ocean anoxia, and rapid climate change.',
  },
  {
    ageMa: 200,
    label: 'End-Triassic',
    description: 'End-Triassic extinction (~200 Ma)',
    detail: 'As Pangaea began to rift apart, massive volcanic eruptions from the Central Atlantic Magmatic Province flooded the atmosphere with CO₂, triggering rapid warming and ocean acidification. About 80% of species were lost — clearing the ecological stage for dinosaurs to dominate for the next 135 million years.',
  },
  {
    ageMa: 180,
    label: 'Pangaea Breakup',
    description: 'Pangaea begins breaking up (~180 Ma)',
    detail: 'Rifting began to tear Pangaea apart in the Early Jurassic. The Central Atlantic opened first, separating North America from Africa. This breakup drove the diversification of dinosaurs and set the stage for the isolated evolutionary experiments that would eventually produce modern mammals, birds, and flowering plants.',
  },
  {
    ageMa: 66,
    label: 'K-Pg Extinction',
    description: 'K-Pg extinction (~66 Ma)',
    detail: 'A ~10 km asteroid struck the Yucatán Peninsula, triggering wildfires, a "nuclear winter," and the collapse of food chains. Non-avian dinosaurs, marine reptiles, and ammonites vanished. Mammals and birds — small, opportunistic survivors — inherited a reshaped world and radiated explosively into the aftermath.',
  },
  {
    ageMa: 55,
    label: 'PETM',
    description: 'Paleocene-Eocene Thermal Maximum (~55 Ma)',
    detail: 'In under 20,000 years, global temperatures spiked 5–8°C in the most rapid natural warming event in the fossil record. Vast stores of carbon — possibly from volcanic activity or methane hydrates — flooded the atmosphere. Deep-sea ecosystems collapsed, but many mammals diversified rapidly in the warmer world.',
  },
  {
    ageMa: 34,
    label: 'Antarctic Ice',
    description: 'Antarctic glaciation begins (~34 Ma)',
    detail: 'As South America and Antarctica finally separated, the Drake Passage opened, allowing the Antarctic Circumpolar Current to isolate the continent thermally. Ice sheets began to build on Antarctica for the first time in tens of millions of years, dramatically lowering sea levels and reshaping global ocean circulation.',
  },
  {
    ageMa: 0,
    label: 'Present Day',
    description: 'Present day',
    detail: 'The continents as we know them today. The Atlantic continues to widen at ~2.5 cm/year, roughly the rate fingernails grow. In ~250 million years, models predict the next supercontinent — sometimes called Pangaea Proxima — may begin to assemble.',
  },
]
