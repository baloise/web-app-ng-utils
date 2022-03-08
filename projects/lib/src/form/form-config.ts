import { GtmEvent } from '@baloise/web-app-google-utils'
import { Option } from '../models/option.model'
import { TooltipContent } from '../models/tooltip.model'

export interface FormControlConfig<O = unknown> {
  name?: string
  label?: string
  maxSize?: number
  minValue?: number
  maxValue?: number
  visible?: boolean
  required?: boolean
  multiSelect?: boolean
  step: number
  placeholder?: string
  tooltip?: TooltipContent
  options?: Option<O>[]
  gtm?: GtmEvent
  validation?: {
    [validationErrorType: string]: string
  }
  summary?: {
    label: string
  }
}

export interface FormConfig {
  [name: string]: FormControlConfig<unknown>
}
