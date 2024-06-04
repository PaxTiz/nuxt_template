import type { User as DatabaseUser } from "./database";

declare module '#auth-utils' {
    interface User extends DatabaseUser {}
  
    interface UserSession {
      // Add your own fields
    }
  }
  
  export { };
