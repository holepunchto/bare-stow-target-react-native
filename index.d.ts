import { JavaScriptOptions, Target, TargetLanguage } from 'bare-stow'

/** The options of the target, given as `targetOptions` to `stow()`. */
interface ReactNativeOptions {
  /** The options for iOS. */
  ios?: {
    /** The JavaScript engine of the application on iOS (default `'v8'`). */
    engine?: 'v8' | 'javascriptcore'
  }
  /** The options for Android. */
  android?: {
    /** The JavaScript engine of the application on Android (default `'v8'`). */
    engine?: 'v8' | 'quickjs'
  }
}

/** The options of the target with defaults applied, as passed to its properties. */
interface ReactNativeResolvedOptions {
  ios: { engine: 'v8' | 'javascriptcore' }
  android: { engine: 'v8' | 'quickjs' }
}

interface ReactNativeTarget extends Target<ReactNativeResolvedOptions> {
  languages: {
    javascript: TargetLanguage<JavaScriptOptions, ReactNativeResolvedOptions>
  }
  options(given?: ReactNativeOptions): ReactNativeResolvedOptions
}

declare const target: ReactNativeTarget

declare namespace target {
  export { type ReactNativeOptions, type ReactNativeResolvedOptions }
}

export = target
