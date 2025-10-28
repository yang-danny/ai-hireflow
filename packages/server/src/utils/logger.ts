export class Logger {
   static info(message: string, ...args: any[]): void {
      console.log(`ℹ️  [INFO] ${message}`, ...args);
   }

   static error(message: string, ...args: any[]): void {
      console.error(`❌ [ERROR] ${message}`, ...args);
   }

   static warn(message: string, ...args: any[]): void {
      console.warn(`⚠️  [WARN] ${message}`, ...args);
   }

   static success(message: string, ...args: any[]): void {
      console.log(`✅ [SUCCESS] ${message}`, ...args);
   }

   static debug(message: string, ...args: any[]): void {
      if (process.env.NODE_ENV === 'development') {
         console.log(`🐛 [DEBUG] ${message}`, ...args);
      }
   }
}
