export enum OptionType {
  Bool,
  BoolMultiFlag,
  Dropdown,
  DropdownMultiFlag,
  String,
  File,
  Number
}

export const optionSections = [
  {
    title: 'Styling',
    options: [
      {
        title: 'Diagram Mode',
        option: '--diagrams',
        type: OptionType.Dropdown,
        values: [
          { name: 'Undefined', value: undefined },
          { name: 'All', value: 'all' },
          { name: 'user-defined chords', value: 'user' },
          { name: 'None', value: 'none' }
        ],
        default: 'Undefined'
      },
      {
        title: 'Only lyrics',
        type: OptionType.Bool,
        option: '-l'
      },
      {
        title: 'Table of contents',
        type: OptionType.BoolMultiFlag,
        true: '--toc',
        false: '--no-toc'
      },
      {
        title: 'Starting Page Number',
        type: OptionType.Number,
        omitIfZero: true,
        option: '-p'
      }
    ]
  },
  {
    title: 'Chord-related',
    options: [
      {
        title: 'Transpose',
        type: OptionType.Number,
        min: -12,
        max: 12,
        omitIfZero: true,
        option: '--transpose'
      },
      {
        title: 'Resolve Capo',
        type: OptionType.BoolMultiFlag,
        true: '--decapo',
        false: ''
      },
      {
        title: 'Strict mode',
        type: OptionType.BoolMultiFlag,
        true: '--strict',
        false: '--no-strict'
      },
      {
        title: 'Transcode Notation',
        option: '--transcode',
        type: OptionType.Dropdown,
        values: [
          { name: 'Undefined', value: null },
          { name: 'common/Dutch (C, D, E, F, G, A, B)', value: 'common' },
          { name: 'German (C, … A, Ais/B, H)', value: 'german' },
          { name: 'Latin (Do, Re, Mi, Fa, Sol, …)', value: 'latin' },
          { name: 'Scandinavian (C, … A, A#/Bb, H)', value: 'scandinavian' },
          { name: 'Solfège (Do, Re, Mi, Fa, So, …) (key-relative)', value: 'solfege' },
          { name: 'Nashville (1, 2, 3, ...) (key-relative)', value: 'nashville' },
          { name: 'Roman (I, II, III, ...) (key-relative)', value: 'roman' }
        ],
        default: 'Undefined'
      }
    ]
  },
  {
    title: 'Other',
    options: [
      {
        title: 'Front Matter / Cover',
        type: OptionType.File,
        filetypes: [{ name: 'PDF', extensions: ['pdf'] }],
        option: '--front-matter'
      },
      {
        title: 'Back Matter',
        type: OptionType.File,
        filetypes: [{ name: 'PDF', extensions: ['pdf'] }],
        option: '--back-matter'
      },
      // TODO: Output format (--generate)
      {
        title: 'Config File',
        type: OptionType.File,
        filetypes: [{ name: 'ChordPro Config', extensions: ['json'] }],
        option: '--config'
      },
      {
        title: 'Write CSV',
        type: OptionType.BoolMultiFlag,
        true: '--csv',
        false: '--no-csv',
        default: true
      }
    ]
  },
  {
    title: "Weird (Don't touch)",
    options: [
      {
        title: 'Force Mode',
        type: OptionType.DropdownMultiFlag,
        options: [
          { name: 'None', value: null },
          { name: 'Legacy ASCII to ChordPro', value: '--a2crd' },
          { name: 'No Legacy ASCII to ChordPro', value: '--noa2crd' },
          { name: 'Legacy CRD', value: '--crd' }
        ],
        default: 'None'
      }
    ]
  }
]

export function getOptionDict() {
  const opts = {}
  for (const section of optionSections) {
    for (const option of section.options) {
      opts[option.title] = option
    }
  }
  return opts
}
