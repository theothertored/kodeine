import { IKodeFunction, KodeValue } from "../base.js";
import { EvaluationError } from "../errors.js";
import { EvaluationContext } from "../evaluables/evaluation-context.js";
import { FunctionCall } from "../evaluables/function-call.js";

// this file contains classes for functions that have not been implemented yet.
// they should be moved to separate files after they are implemented.

export class LocationInfoFunction extends IKodeFunction {
    getName() { return 'li'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class AirQualityFunction extends IKodeFunction {
    getName() { return 'aq'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class NetworkConnectivityFunction extends IKodeFunction {
    getName() { return 'nc'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class SystemNotificationsFunction extends IKodeFunction {
    getName() { return 'ni'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class TextConverterFunction extends IKodeFunction {
    getName() { return 'tc'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class WebGetFunction extends IKodeFunction {
    getName() { return 'wg'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class ResourceMonitorFunction extends IKodeFunction {
    getName() { return 'rm'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class ColorEditorFunction extends IKodeFunction {
    getName() { return 'ce'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class GlobalVariableFunction extends IKodeFunction {
    getName() { return 'gv'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class ShellCommandFunction extends IKodeFunction {
    getName() { return 'sh'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class CurrentWeatherFunction extends IKodeFunction {
    getName() { return 'wi'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class BatteryInfoFunction extends IKodeFunction {
    getName() { return 'bi'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class SystemInfoFunction extends IKodeFunction {
    getName() { return 'si'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class MusicQueueFunction extends IKodeFunction {
    getName() { return 'mq'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class TrafficStatsFunction extends IKodeFunction {
    getName() { return 'ts'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class BitmapPaletteFunction extends IKodeFunction {
    getName() { return 'bp'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class ColorMakerFunction extends IKodeFunction {
    getName() { return 'cm'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class BroadcastReceiverFunction extends IKodeFunction {
    getName() { return 'br'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class ForLoopFunction extends IKodeFunction {
    getName() { return 'fl'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class DateFormatFunction extends IKodeFunction {
    getName() { return 'df'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class MusicInfoFunction extends IKodeFunction {
    getName() { return 'mi'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class WeatherForecastFunction extends IKodeFunction {
    getName() { return 'wf'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class TimeSpanFunction extends IKodeFunction {
    getName() { return 'tf'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class UnreadCounterFunction extends IKodeFunction {
    getName() { return 'uc'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class CalendarEventFunction extends IKodeFunction {
    getName() { return 'ci'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class AstronomicalInfoFunction extends IKodeFunction {
    getName() { return 'ai'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class FitnessDataFunction extends IKodeFunction {
    getName() { return 'fd'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class MathUtilsFunction extends IKodeFunction {
    getName() { return 'mu'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class DateParserFunction extends IKodeFunction {
    getName() { return 'dp'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}

export class TimerUtilsFunction extends IKodeFunction {
    getName() { return 'tu'; }
    call(evalCtx: EvaluationContext, call: FunctionCall, args: KodeValue[]): KodeValue {
        throw new EvaluationError(call, 'This function isn\'t implemented yet.');
    }
}