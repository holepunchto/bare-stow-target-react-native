import { Target } from 'bare-stow'

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

declare const target: Target

declare namespace target {
  export { type ReactNativeOptions }
}

export = target
