import { getOptionDict, OptionType } from './options'

export function cleanRawInput(setOptions, outputFile): string[] {
  const optDict = getOptionDict()
  let k: keyof typeof setOptions

  const output: string[] = []
  for (k in setOptions) {
    const opt = setOptions[k]
    if (opt == undefined || opt == null || opt == '') continue
    const optMeta = optDict[k]
    if (optMeta.type == OptionType.BoolMultiFlag || optMeta.type == OptionType.DropdownMultiFlag) {
      output.push(opt)
    } else if (optMeta.type == OptionType.Bool) {
      if (opt) {
        output.push(`${optMeta.option}`)
      }
    } else if (optMeta.type == OptionType.Number) {
      if (!(optMeta.omitIfZero == true && opt == 0)) {
        output.push(`${optMeta.option}=${opt}`)
      }
    } else {
      output.push(`${optMeta.option}=${opt}`)
    }
  }
  if (outputFile) output.push(`--output="${outputFile}"`)
  return output
}

export function getCommandString(setOptions, outputFile, inputFile): string {
  const o = cleanRawInput(setOptions, outputFile)
  let cmd = 'chordpro'
  if (o && o.length > 0) cmd += ` ${o.join(' ')}`
  if (inputFile) cmd += ` ${inputFile}`
  return cmd
}
