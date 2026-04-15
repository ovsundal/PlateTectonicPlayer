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
}

export const MAJOR_EVENTS: MajorEvent[] = [
  { ageMa: 750,  label: 'Rodinia',         description: 'Rodinia supercontinent (~750 Ma)' },
  { ageMa: 635,  label: 'Snowball Earth',  description: 'Cryogenian glaciation ends (~635 Ma)' },
  { ageMa: 540,  label: 'Cambrian',        description: 'Cambrian explosion (~540 Ma)' },
  { ageMa: 500,  label: 'Gondwana',        description: 'Gondwana fully assembled (~500 Ma)' },
  { ageMa: 250,  label: 'Pangaea',         description: 'Pangaea peak (~250 Ma) + Great Dying' },
  { ageMa: 180,  label: 'Breakup',         description: 'Pangaea begins breaking up (~180 Ma)' },
  { ageMa: 66,   label: 'K-Pg',            description: 'K-Pg extinction (dinosaur killer, ~66 Ma)' },
  { ageMa: 0,    label: 'Today',           description: 'Present day' },
]
